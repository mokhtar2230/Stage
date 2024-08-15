import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, component }) => {
  return isAuthenticated ? component : <Navigate to="/" />;
};

export default PrivateRoute;
