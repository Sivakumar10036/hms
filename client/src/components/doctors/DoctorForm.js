import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

const DoctorForm = ({ doctor: initialDoctor, isEdit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    department: '',
    phone: '',
    email: '',
    licenseNumber: '',
    education: [],
    experience: [],
    availability: []
  });
  const [newEducation, setNewEducation] = useState({
    degree: '',
    university: '',
    year: ''
  });
  const [newExperience, setNewExperience] = useState({
    position: '',
    hospital: '',
    from: '',
    to: '',
    current: false
  });
  const [newAvailability, setNewAvailability] = useState({
    day: 'Monday',
    startTime: '',
    endTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    if (initialDoctor) {
      setFormData(initialDoctor);
    } else if (isEdit && id) {
      const fetchDoctor = async () => {
        try {
          const res = await axios.get(`/api/doctors/${id}`);
          setFormData(res.data.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch doctor');
        }
      };
      fetchDoctor();
    }
  }, [initialDoctor, isEdit, id]);

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

  const handleEducationChange = e => {
    const { name, value } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.university && newEducation.year) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEducation]
      }));
      setNewEducation({
        degree: '',
        university: '',
        year: ''
      });
    }
  };

  const handleRemoveEducation = index => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleExperienceChange = e => {
    const { name, value, type, checked } = e.target;
    setNewExperience(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddExperience = () => {
    if (newExperience.position && newExperience.hospital && newExperience.from) {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, newExperience]
      }));
      setNewExperience({
        position: '',
        hospital: '',
        from: '',
        to: '',
        current: false
      });
    }
  };

  const handleRemoveExperience = index => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleAvailabilityChange = e => {
    const { name, value } = e.target;
    setNewAvailability(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAvailability = () => {
    if (newAvailability.startTime && newAvailability.endTime) {
      setFormData(prev => ({
        ...prev,
        availability: [...prev.availability, newAvailability]
      }));
      setNewAvailability({
        day: 'Monday',
        startTime: '',
        endTime: ''
      });
    }
  };

  const handleRemoveAvailability = index => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await axios.put(`/api/doctors/${id}`, formData);
      } else {
        await axios.post('/api/doctors', formData);
      }
      history.push('/doctors');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save doctor');
      setLoading(false);
    }
  };

  return (
    <div className="doctor-form">
      <h3>{isEdit ? 'Edit' : 'Add'} Doctor</h3>
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
            <label>Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
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
          <label>License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
          />
        </div>

        <h4>Education</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Degree</label>
            <input
              type="text"
              name="degree"
              value={newEducation.degree}
              onChange={handleEducationChange}
            />
          </div>
          <div className="form-group">
            <label>University</label>
            <input
              type="text"
              name="university"
              value={newEducation.university}
              onChange={handleEducationChange}
            />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              name="year"
              value={newEducation.year}
              onChange={handleEducationChange}
            />
          </div>
          <button type="button" onClick={handleAddEducation}>
            Add
          </button>
        </div>
        <div className="array-items">
          {formData.education.map((edu, index) => (
            <div key={index} className="array-item">
              {edu.degree} from {edu.university} ({edu.year})
              <button
                type="button"
                onClick={() => handleRemoveEducation(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <h4>Experience</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              name="position"
              value={newExperience.position}
              onChange={handleExperienceChange}
            />
          </div>
          <div className="form-group">
            <label>Hospital</label>
            <input
              type="text"
              name="hospital"
              value={newExperience.hospital}
              onChange={handleExperienceChange}
            />
          </div>
          <div className="form-group">
            <label>From</label>
            <input
              type="date"
              name="from"
              value={newExperience.from}
              onChange={handleExperienceChange}
            />
          </div>
          <div className="form-group">
            <label>To</label>
            <input
              type="date"
              name="to"
              value={newExperience.to}
              onChange={handleExperienceChange}
              disabled={newExperience.current}
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="current"
                checked={newExperience.current}
                onChange={handleExperienceChange}
              />
              Current
            </label>
          </div>
          <button type="button" onClick={handleAddExperience}>
            Add
          </button>
        </div>
        <div className="array-items">
          {formData.experience.map((exp, index) => (
            <div key={index} className="array-item">
              {exp.position} at {exp.hospital} ({new Date(exp.from).getFullYear()}
              {exp.current ? ' - Present' : exp.to ? ` - ${new Date(exp.to).getFullYear()}` : ''})
              <button
                type="button"
                onClick={() => handleRemoveExperience(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <h4>Availability</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Day</label>
            <select
              name="day"
              value={newAvailability.day}
              onChange={handleAvailabilityChange}
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="startTime"
              value={newAvailability.startTime}
              onChange={handleAvailabilityChange}
            />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              name="endTime"
              value={newAvailability.endTime}
              onChange={handleAvailabilityChange}
            />
          </div>
          <button type="button" onClick={handleAddAvailability}>
            Add
          </button>
        </div>
        <div className="array-items">
          {formData.availability.map((avail, index) => (
            <div key={index} className="array-item">
              {avail.day}: {avail.startTime} - {avail.endTime}
              <button
                type="button"
                onClick={() => handleRemoveAvailability(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Doctor'}
        </button>
      </form>
    </div>
  );
};

export default DoctorForm;