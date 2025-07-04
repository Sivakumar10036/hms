import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminRoute = ({ component: Component, ...rest }) => {
  const { auth } = useContext(AuthContext);
  
  return (
    <Route
      {...rest}
      render={props =>
        !auth.loading && (
          auth.isAuthenticated && auth.user?.role === 'admin' ? (
            <Component {...props} />
          ) : (
            <Redirect to="/login" />
          )
        )
      }
    />
  );
};

export default AdminRoute;