import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DoctorDashboard from '../components/dashboard/DoctorDashboard';

const DoctorPage = () => {
  const { auth, logout } = useContext(AuthContext);

  if (auth.loading || !auth.isAuthenticated || auth.user?.role !== 'doctor') {
    return null;
  }

  return (
    <div className="doctor-page">
      <header>
        <h1>Doctor Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <DoctorDashboard profile={auth.profile} />
    </div>
  );
};

export default DoctorPage;