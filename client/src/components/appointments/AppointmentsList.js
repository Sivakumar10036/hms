import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const AppointmentsList = ({ patientId, doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let url = '/api/appointments';
        if (patientId) {
          url += `?patient=${patientId}`;
        } else if (doctorId) {
          url += `?doctor=${doctorId}`;
        }
        
        const res = await axios.get(url);
        setAppointments(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch appointments');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId, doctorId]);

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="appointments-list">
      <div className="list-header">
        <h3>Appointments</h3>
        {!doctorId && (
          <button onClick={() => history.push('/appointments/new')}>
            Book New Appointment
          </button>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            {!patientId && <th>Patient</th>}
            {!doctorId && <th>Doctor</th>}
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment._id}>
              <td>{new Date(appointment.date).toLocaleDateString()}</td>
              <td>{appointment.time}</td>
              {!patientId && (
                <td>
                  {appointment.patient?.firstName} {appointment.patient?.lastName}
                </td>
              )}
              {!doctorId && (
                <td>
                  Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                </td>
              )}
              <td>{appointment.reason}</td>
              <td>{appointment.status}</td>
              <td>
                <button onClick={() => history.push(`/appointments/${appointment._id}`)}>
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

export default AppointmentsList;