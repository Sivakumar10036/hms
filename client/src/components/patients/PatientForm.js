import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

const PatientForm = ({ patient: initialPatient, isEdit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    phone: '',
    email: '',
    bloodType: '',
    allergies: [],
    medicalHistory: [],
    insuranceInfo: {
      provider: '',
      policyNumber: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedicalRecord, setNewMedicalRecord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    if (initialPatient) {
      setFormData(initialPatient);
    } else if (isEdit && id) {
      const fetchPatient = async () => {
        try {
          const res = await axios.get(`/api/patients/${id}`);
          setFormData(res.data.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch patient');
        }
      };
      fetchPatient();
    }
  }, [initialPatient, isEdit, id]);

  const handleChange = e => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = index => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  const handleAddMedicalRecord = () => {
    if (newMedicalRecord.trim()) {
      setFormData(prev => ({
        ...prev,
        medicalHistory: [...prev.medicalHistory, newMedicalRecord.trim()]
      }));
      setNewMedicalRecord('');
    }
  };

  const handleRemoveMedicalRecord = index => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await axios.put(`/api/patients/${id}`, formData);
      } else {
        await axios.post('/api/patients', formData);
      }
      history.push('/patients');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save patient');
      setLoading(false);
    }
  };

  return (
    <div className="patient-form">
      <h3>{isEdit ? 'Edit' : 'Add'} Patient</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Blood Type</label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
          >
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="form-group">
          <label>Allergies</label>
          <div className="array-input">
            <input
              type="text"
              value={newAllergy}
              onChange={e => setNewAllergy(e.target.value)}
              placeholder="Add allergy"
            />
            <button type="button" onClick={handleAddAllergy}>
              Add
            </button>
          </div>
          <div className="array-items">
            {formData.allergies.map((allergy, index) => (
              <div key={index} className="array-item">
                {allergy}
                <button
                  type="button"
                  onClick={() => handleRemoveAllergy(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Medical History</label>
          <div className="array-input">
            <input
              type="text"
              value={newMedicalRecord}
              onChange={e => setNewMedicalRecord(e.target.value)}
              placeholder="Add medical record"
            />
            <button type="button" onClick={handleAddMedicalRecord}>
              Add
            </button>
          </div>
          <div className="array-items">
            {formData.medicalHistory.map((record, index) => (
              <div key={index} className="array-item">
                {record}
                <button
                  type="button"
                  onClick={() => handleRemoveMedicalRecord(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <h4>Insurance Information</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Provider</label>
            <input
              type="text"
              name="insuranceInfo.provider"
              value={formData.insuranceInfo?.provider || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Policy Number</label>
            <input
              type="text"
              name="insuranceInfo.policyNumber"
              value={formData.insuranceInfo?.policyNumber || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <h4>Emergency Contact</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="emergencyContact.name"
              value={formData.emergencyContact?.name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Relationship</label>
            <input
              type="text"
              name="emergencyContact.relationship"
              value={formData.emergencyContact?.relationship || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="emergencyContact.phone"
              value={formData.emergencyContact?.phone || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Patient'}
        </button>
      </form>
    </div>
  );
};

export default PatientForm;