import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

const AppointmentForm = ({ patientId }) => {
  const [formData, setFormData] = useState({
    patient: patientId || '',
    doctor: '',
    date: '',
    time: '',
    reason: '',
    status: 'Scheduled'
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('/api/doctors');
        setDoctors(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch doctors');
      }
    };

    fetchDoctors();

    if (id) {
      const fetchAppointment = async () => {
        try {
          const res = await axios.get(`/api/appointments/${id}`);
          setFormData(res.data.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch appointment');
        }
      };
      fetchAppointment();
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (id) {
        await axios.put(`/api/appointments/${id}`, formData);
      } else {
        await axios.post('/api/appointments', formData);
      }
      history.push(patientId ? '/patient' : '/appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save appointment');
      setLoading(false);
    }
  };

  return (
    <div className="appointment-form">
      <h3>{id ? 'Edit' : 'Book'} Appointment</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        {!patientId && (
          <div className="form-group">
            <label>Patient</label>
            <input
              type="text"
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label>Doctor</label>
          <select
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map(doctor => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>
        {id && (
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No-Show">No-Show</option>
            </select>
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Appointment'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;