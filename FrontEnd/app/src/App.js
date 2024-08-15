import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import axios from 'axios';
import UploadComponent from './components/UploadComponent';
import History from './components/History';
import FailedAdmin from './components/FailedAdmin';
import NaAdmin from './components/NaAdmin'; // Ensure file name matches
import Chart from './components/Chart';
import Login from './components/Login';
import Reports from './components/Reports'; // Ensure file name matches
import PrivateRoute from './components/PrivateRoute'; // Ensure path is correct
import AddUser from './components/AddUser'; 
function App() {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  const handleUpload = async (files) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);
      return response.data;
    } catch (error) {
      console.error('Error uploading files', error);
      setLoading(false);
      throw error;
    }
  };

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setUsername(username);
    const storedRole = sessionStorage.getItem('role') || ''; // Retrieve role from session storage
    setRole(storedRole);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/logout');
      setIsAuthenticated(false);
      setUsername('');
      setRole('');
      sessionStorage.removeItem('role'); // Clear role from session storage
      setLoading(false);
    } catch (error) {
      console.error('Error during logout', error);
      setLoading(false);
    }
  };

  return (
   
    <Router>
     
      <div className="App">
        {isAuthenticated && (
          <div className="sidebar pe-4 pb-3">
            <nav className="navbar bg-secondary navbar-dark">
              <div className="d-flex align-items-center ms-4 mb-4">
                <div className="position-relative">
                  <img
                    className="rounded-circle"
                    src="img/user.jpg"
                    alt=""
                    style={{ width: 40, height: 40 }}
                  />
                  <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1" />
                </div>
                <div className="ms-3">
                  <h6 className="mb-0">{username}</h6>
                </div>
              </div>
              <div className="navbar-nav w-100">
                <NavLink to="/" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`}>
                  <i className="fa fa-tachometer-alt me-2" />
                  Dashboard
                </NavLink>
                <NavLink to="/history" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`}>
                  <i className="bi bi-clock-history" />
                  History
                </NavLink>
            
                {role === 'admin' && (
                  <>
                      <NavLink to="/failed-admin" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`}>
                  <i className="bi bi-question" />
                  Failed Admin
                </NavLink>
                <NavLink to="/na-admin" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`}>
                  <i className="bi bi-exclamation-triangle" />
                  N/A Admin
                </NavLink>

                    <NavLink to="/reports" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`}>
                      <i className="bi bi-file-earmark-text" />
                      Reports
                    </NavLink>
                    {/* New Admin-Only Nav Item */}
                    <NavLink to="/AddUser" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`}>
  <i className="bi bi-person" />
  AddUser
</NavLink>

                  </>
                )}

                <button className="btn btn-danger mt-3" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </nav>
          </div>
        )}

        <div className="content">
          <nav className="navbar navbar-expand bg-secondary navbar-dark sticky-top px-4 py-0">
            {/* Navbar content */}
          </nav>

          {loading && (
            <div id="spinner" className="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          <div className="container-fluid pt-4 px-4">
            <Routes>
              <Route path="/upload" element={<PrivateRoute isAuthenticated={isAuthenticated} component={<UploadComponent onUpload={handleUpload} />} />} />
              <Route path="/history" element={<PrivateRoute isAuthenticated={isAuthenticated} component={<History />} />} />
              <Route path="/failed-admin" element={<PrivateRoute isAuthenticated={isAuthenticated} component={<FailedAdmin />} />} />
              <Route path="/na-admin" element={<PrivateRoute isAuthenticated={isAuthenticated} component={<NaAdmin />} />} />
              <Route path="/reports" element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Reports />} />} />
              <Route path="/chart" element={<PrivateRoute isAuthenticated={isAuthenticated} component={<Chart />} />} />
              <Route path="/AddUser" element={<PrivateRoute isAuthenticated={isAuthenticated} component={< AddUser />} />} /> {/* Replace with actual component */}
              <Route path="/" element={isAuthenticated ? <PrivateRoute isAuthenticated={isAuthenticated} component={<UploadComponent onUpload={handleUpload} />} /> : <Login onLogin={handleLogin} />} />
            </Routes>
          </div>
        </div>
      </div>
    
    </Router>
  
  );
}

export default App;
