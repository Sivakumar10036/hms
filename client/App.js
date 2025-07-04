import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import DoctorPage from './pages/DoctorPage';
import PatientPage from './pages/PatientPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute exact path="/patient" component={PatientPage} />
            <PrivateRoute exact path="/doctor" component={DoctorPage} />
            <AdminRoute exact path="/admin" component={AdminPage} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
