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
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const FinancialReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchFinancialStats();
  }, []);

  const fetchFinancialStats = async () => {
    try {
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      
      const res = await axios.get('/api/reports/financial', { params });
      setStats(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch financial stats');
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
    fetchFinancialStats();
  };

  if (loading) return <div>Loading financial statistics...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return <div>No statistics data found</div>;

  const statusData = stats.summary.statuses.map(status => ({
    name: status.status,
    revenue: status.totalAmount,
    collected: status.paidAmount
  }));

  return (
    <div className="financial-reports">
      <h3>Financial Statistics</h3>
      
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
        <p>Total Revenue: ${stats.summary.totalRevenue.toFixed(2)}</p>
        <p>Total Collected: ${stats.summary.totalCollected.toFixed(2)}</p>
        <p>Outstanding: ${stats.summary.outstanding.toFixed(2)}</p>
        <ul>
          {stats.summary.statuses.map((status, index) => (
            <li key={index}>
              {status.status}: ${status.totalAmount.toFixed(2)} (
              {status.count} bills)
            </li>
          ))}
        </ul>
      </div>

      <div className="chart-container">
        <h4>Revenue by Payment Status</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
            <Bar dataKey="collected" fill="#82ca9d" name="Collected" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h4>Monthly Revenue</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="collected"
              stroke="#82ca9d"
              name="Collected"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialReports;