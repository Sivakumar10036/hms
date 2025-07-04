import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

const BillingForm = () => {
  const [formData, setFormData] = useState({
    patient: '',
    appointment: '',
    services: [],
    totalAmount: 0,
    paymentStatus: 'Pending',
    paymentMethod: '',
    insuranceClaim: {
      isClaimed: false,
      claimAmount: 0,
      claimStatus: ''
    }
  });
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newService, setNewService] = useState({
    description: '',
    cost: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, appointmentsRes] = await Promise.all([
          axios.get('/api/patients'),
          axios.get('/api/appointments')
        ]);
        
        setPatients(patientsRes.data.data);
        setAppointments(appointmentsRes.data.data);
        
        if (id) {
          const billRes = await axios.get(`/api/billing/${id}`);
          setFormData(billRes.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      }
    };

    fetchData();
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleServiceChange = e => {
    const { name, value } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: name === 'cost' ? parseFloat(value) || 0 : value
    }));
  };

  const handleAddService = () => {
    if (newService.description) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService],
        totalAmount: prev.totalAmount + (newService.cost || 0)
      }));
      setNewService({
        description: '',
        cost: 0
      });
    }
  };

  const handleRemoveService = index => {
    const removedCost = formData.services[index].cost || 0;
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
      totalAmount: prev.totalAmount - removedCost
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (id) {
        await axios.put(`/api/billing/${id}`, formData);
      } else {
        await axios.post('/api/billing', formData);
      }
      history.push('/billing');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bill');
      setLoading(false);
    }
  };

  return (
    <div className="billing-form">
      <h3>{id ? 'Edit' : 'Create'} Bill</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient</label>
          <select
            name="patient"
            value={formData.patient}
            onChange={handleChange}
            required
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient._id} value={patient._id}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Appointment (optional)</label>
          <select
            name="appointment"
            value={formData.appointment}
            onChange={handleChange}
          >
            <option value="">Select Appointment</option>
            {appointments
              .filter(appt => appt.patient?._id === formData.patient)
              .map(appointment => (
                <option key={appointment._id} value={appointment._id}>
                  {new Date(appointment.date).toLocaleDateString()} - {appointment.time} - {appointment.reason}
                </option>
              ))}
          </select>
        </div>

        <h4>Services</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={newService.description}
              onChange={handleServiceChange}
            />
          </div>
          <div className="form-group">
            <label>Cost</label>
            <input
              type="number"
              name="cost"
              value={newService.cost}
              onChange={handleServiceChange}
              min="0"
              step="0.01"
            />
          </div>
          <button type="button" onClick={handleAddService}>
            Add Service
          </button>
        </div>
        <div className="services-list">
          {formData.services.map((service, index) => (
            <div key={index} className="service-item">
              <span>{service.description}: ${service.cost.toFixed(2)}</span>
              <button
                type="button"
                onClick={() => handleRemoveService(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Total Amount</label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>Payment Status</label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Insurance">Insurance</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <h4>Insurance Claim</h4>
        <div className="form-row">
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="insuranceClaim.isClaimed"
                checked={formData.insuranceClaim.isClaimed}
                onChange={handleChange}
              />
              Claimed to Insurance
            </label>
          </div>
          {formData.insuranceClaim.isClaimed && (
            <>
              <div className="form-group">
                <label>Claim Amount</label>
                <input
                  type="number"
                  name="insuranceClaim.claimAmount"
                  value={formData.insuranceClaim.claimAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Claim Status</label>
                <input
                  type="text"
                  name="insuranceClaim.claimStatus"
                  value={formData.insuranceClaim.claimStatus}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Bill'}
        </button>
      </form>
    </div>
  );
};

export default BillingForm;