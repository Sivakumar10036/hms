import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get('/api/patients');
        setPatients(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch patients');
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div>Loading patients...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="patients-list">
      <div className="list-header">
        <h3>Patients</h3>
        <button onClick={() => history.push('/patients/new')}>
          Add New Patient
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient._id}>
              <td>{patient._id}</td>
              <td>{patient.firstName} {patient.lastName}</td>
              <td>{patient.phone}</td>
              <td>{patient.email}</td>
              <td>
                <button onClick={() => history.push(`/patients/${patient._id}`)}>
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

export default PatientsList;