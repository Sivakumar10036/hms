import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('/api/doctors');
        setDoctors(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch doctors');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <div>Loading doctors...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="doctors-list">
      <div className="list-header">
        <h3>Doctors</h3>
        <button onClick={() => history.push('/doctors/new')}>
          Add New Doctor
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(doctor => (
            <tr key={doctor._id}>
              <td>{doctor._id}</td>
              <td>{doctor.firstName} {doctor.lastName}</td>
              <td>{doctor.specialization}</td>
              <td>{doctor.department}</td>
              <td>{doctor.phone}</td>
              <td>
                <button onClick={() => history.push(`/doctors/${doctor._id}`)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsList;