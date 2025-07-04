import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { auth } = useContext(AuthContext);
  const history = useHistory();

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (auth.isAuthenticated) {
    if (auth.user.role === 'admin') {
      history.push('/admin');
    } else if (auth.user.role === 'doctor') {
      history.push('/doctor');
    } else {
      history.push('/patient');
    }
    return null;
  }

  return (
    <div className="home-page">
      <h1>Welcome to Hospital Management System</h1>
      <p>Please login or register to continue</p>
      <div className="home-buttons">
        <button onClick={() => history.push('/login')}>Login</button>
        <button onClick={() => history.push('/register')}>Register</button>
      </div>
    </div>
  );
};

export default HomePage;