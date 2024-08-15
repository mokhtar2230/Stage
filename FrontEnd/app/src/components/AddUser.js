import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

const UserManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState(''); // State to hold the selected role filter

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/afficheuser');
      setData(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('An error occurred while fetching the data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?');
    if (confirmDelete) {
      try {
        await axios.delete('http://127.0.0.1:5000/removeuser/', { data: { id } });
        fetchData();
      } catch (err) {
        console.error('Error deleting record:', err);
        setError('An error occurred while deleting the record.');
      }
    }
  };

  // Filtering data based on search query and role filter
  const filteredData = data.filter(item =>
    item.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (roleFilter === '' || (roleFilter === '1' && item.role_id === 1) || (roleFilter === '2' && item.role_id === 2))
  );

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="col-12">
        <div className="bg-secondary rounded h-100 p-4">
          <h6 className="mb-4">User Management</h6>

          {/* Search input */}
          <Form.Control
            type="text"
            placeholder="Search by Username"
            className="mb-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Role filter dropdown */}
          <Form.Control
            as="select"
            className="mb-3"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="1">Admin</option>
            <option value="2">User</option>
          </Form.Control>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <Button variant="outline-success" className="m-2" onClick={handleShow}>Add User</Button>
            {filteredData.length === 0 ? (
              <div>No records found</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.username}</td>
                      <td>{item.email}</td>
                      <td>{item.role_id === 1 ? 'Admin' : item.role_id === 2 ? 'User' : 'Unknown'}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          className="m-2"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddUserForm handleClose={handleClose} fetchData={fetchData} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const AddUserForm = ({ handleClose, fetchData }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('/roles');
        setRoles(response.data.roles);  // Assuming response contains an array of roles
      } catch (error) {
        console.error('Error fetching roles:', error);
        setError('Failed to load roles.');
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/add_user', {
        username,
        password,
        mail,
        role_name: roleName
      });
      alert(response.data.message);
      setUsername('');
      setPassword('');
      setMail('');
      setRoleName('');
      handleClose();
      fetchData();
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <div style={styles.formGroup}>
        <label htmlFor="username" style={styles.label}>Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
          onBlur={(e) => e.target.style.borderColor = '#555'}
        />
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="password" style={styles.label}>Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
          onBlur={(e) => e.target.style.borderColor = '#555'}
        />
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="mail" style={styles.label}>Email:</label>
        <input
          id="mail"
          type="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          required
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
          onBlur={(e) => e.target.style.borderColor = '#555'}
        />
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="role" style={styles.label}>Role:</label>
        {error ? (
          <p style={styles.error}>{error}</p>
        ) : (
          <select
            id="role"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">Select a role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
        )}
      </div>
      <button
        type="submit"
        style={styles.submitButton}
        onMouseOver={(e) => e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor}
        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
      >
        Add User
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: '15px',
    width: '100%',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #555',
    outline: 'none',
  },
  inputFocus: {
    borderColor: '#007bff',
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  submitButtonHover: {
    backgroundColor: '#0056b3',
  },
  error: {
    color: 'red',
  },
};

export default UserManager;
