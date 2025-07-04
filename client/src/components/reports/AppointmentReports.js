import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AppointmentReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchAppointmentStats();
  }, []);

  const fetchAppointmentStats = async () => {
    try {
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      
      const res = await axios.get('/api/reports/appointments', { params });
      setStats(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch appointment stats');
      setLoading(false);
    }
  };

  const handleDateChange = e => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    fetchAppointmentStats();
  };

  if (loading) return <div>Loading appointment statistics...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return <div>No statistics data found</div>;

  const statusData = stats.summary.statuses.map(status => ({
    name: status.status,
    count: status.count
  }));

  const doctorData = stats.topDoctors.map(doctor => ({
    name: `${doctor.doctor.firstName} ${doctor.doctor.lastName}`,
    count: doctor.count,
    specialization: doctor.doctor.specialization
  }));

  return (
    <div className="appointment-reports">
      <h3>Appointment Statistics</h3>
      
      <form onSubmit={handleSubmit} className="report-filters">
        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </div>
          <button type="submit">Apply Filters</button>
        </div>
      </form>

      <div className="report-summary">
        <p>Total Appointments: {stats.summary.total}</p>
        <ul>
          {stats.summary.statuses.map((status, index) => (
            <li key={index}>
              {status.status}: {status.count} (
              {((status.count / stats.summary.total) * 100 || 0).toFixed(1)}%)
            </li>
          ))}
        </ul>
      </div>

      <div className="chart-container">
        <h4>Appointments by Status</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Appointments" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h4>Top Doctors by Appointments</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={doctorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" name="Appointments" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AppointmentReports;