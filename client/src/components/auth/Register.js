import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'patient',
    profileData: {
      firstName: '',
      lastName: '',
      phone: ''
    }
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const history = useHistory();

  const { username, email, password, role, profileData } = formData;

  const onChange = e => {
    if (e.target.name in profileData) {
      setFormData({
        ...formData,
        profileData: {
          ...profileData,
          [e.target.name]: e.target.value
        }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    
    const result = await register(formData);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select name="role" value={role} onChange={onChange}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={profileData.firstName}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={profileData.lastName}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={profileData.phone}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
      <p>
        Already have an account?{' '}
        <span className="text-link" onClick={() => history.push('/login')}>
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;