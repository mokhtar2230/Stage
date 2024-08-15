import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null); 
  const [role, setRole] = useState(null); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        credentials: 'include', // Important for sending cookies/session info
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Response data:', data); // Log full response data

      if (response.ok) {
        setMessage('Login successful');
        setUserId(data.user_id); 
        setRole(data.role_name); 
        console.log('Role:', data.role_name); // Log the role in the console
        sessionStorage.setItem('user_id', data.user_id); 
        sessionStorage.setItem('role', data.role_name); 
        onLogin(username, data.role_name); 
        navigate('/');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid position-relative d-flex p-0">
      {loading && (
        <div id="spinner" className="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="container-fluid">
        <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            <div className="bg-secondary rounded p-4 p-sm-5 my-4 mx-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3>Sign In</h3>
              </div>
              <form onSubmit={handleLogin}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingUsername"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingUsername">Username</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary py-3 w-100 mb-4">Sign In</button>
                {message && <p className="text-center mt-3">{message}</p>}
                {userId && <h1>User ID: {userId}</h1>}
                {role && <h1>Role: {role}</h1>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
