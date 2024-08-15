import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

const NaAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newRecord, setNewRecord] = useState({ FileName: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getallna/');
      setData(response.data.data || []); // Ensure data is an empty array if no records found
      setLoading(false);
    } catch (err) {
      setError('An error occurred while fetching the data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/addna/', newRecord);
      fetchData(); // Re-fetch data after adding a record
      setNewRecord({ FileName: '' }); // Clear the form
      handleClose();
    } catch (err) {
      setError('An error occurred while adding the record.');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?');
    if (confirmDelete) {
      try {
        await axios.delete('http://localhost:5000/removena/', { data: { id } });
        fetchData(); // Re-fetch data after deletion
      } catch (err) {
        setError('An error occurred while deleting the record.');
      }
    }
  };

  const filteredData = data.filter(item =>
    item.nom.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h6 className="mb-4">N/A Data</h6>

          {/* Search input */}
          <Form.Control
            type="text"
            placeholder="Search by FileName"
            className="mb-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <Button variant="outline-success" className="m-2" onClick={handleShow}>Add</Button>
            {filteredData.length === 0 ? (
              <div>No records found</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">FileName</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nom}</td>
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
          <Modal.Title>Add New Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>FileName</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter FileName"
                name="FileName"
                value={newRecord.nom}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
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

export default NaAdmin;
