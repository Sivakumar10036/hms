import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true
  });
  const history = useHistory();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        try {
          const res = await axios.get('/api/auth/me');
          setAuth({
            isAuthenticated: true,
            user: res.data.user,
            profile: res.data.profile,
            token,
            loading: false
          });
        } catch (err) {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setAuth({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false
          });
        }
      } else {
        setAuth(prev => ({ ...prev, loading: false }));
      }
    };
    
    initAuth();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setAuth({
        isAuthenticated: true,
        user: res.data.user,
        profile: null, // Will be fetched in useEffect
        token: res.data.token,
        loading: false
      });
      
      // Redirect based on role
      if (res.data.user.role === 'admin') {
        history.push('/admin');
      } else if (res.data.user.role === 'doctor') {
        history.push('/doctor');
      } else {
        history.push('/patient');
      }
      
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed'
      };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setAuth({
        isAuthenticated: true,
        user: res.data.user,
        profile: null, // Will be fetched in useEffect
        token: res.data.token,
        loading: false
      });
      
      // Redirect based on role
      if (res.data.user.role === 'admin') {
        history.push('/admin');
      } else if (res.data.user.role === 'doctor') {
        history.push('/doctor');
      } else {
        history.push('/patient');
      }
      
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false
    });
    history.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        register,
        logout,
        setAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };