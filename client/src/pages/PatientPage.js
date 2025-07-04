import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PatientDashboard from '../components/dashboard/PatientDashboard';

const PatientPage = () => {
  const { auth, logout } = useContext(AuthContext);

  if (auth.loading || !auth.isAuthenticated || auth.user?.role !== 'patient') {
    return null;
  }

  return (
    <div className="patient-page">
      <header>
        <h1>Patient Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <PatientDashboard profile={auth.profile} />
    </div>
  );
};

export default PatientPage;