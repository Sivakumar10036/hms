import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';

const AdminPage = () => {
  const { auth, logout } = useContext(AuthContext);

  if (auth.loading || !auth.isAuthenticated || auth.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-page">
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;