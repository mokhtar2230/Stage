import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const FailedAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newRecord, setNewRecord] = useState({ fileName: '', file: null });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getallfailed/');
      if (response.data && response.data.faileds) {
        setData(response.data.faileds);
      } else {
        setData([]);
      }
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
    const { name, value, files } = e.target;
    if (name === 'file') {
      setNewRecord({ ...newRecord, file: files[0] });
    } else {
      setNewRecord({ ...newRecord, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fileName', newRecord.fileName);
    formData.append('file', newRecord.file);

    try {
      await axios.post('http://localhost:5000/uploadFailed/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchData();
      setNewRecord({ fileName: '', file: null });
      handleClose();
    } catch (err) {
      setError('An error occurred while adding the record.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?');
    if (confirmDelete) {
      try {
        await axios.delete('http://localhost:5000/remove/', { data: { id } });
        fetchData();
      } catch (err) {
        setError('An error occurred while deleting the record.');
        console.error(err);
      }
    }
  };

  const handleDownload = (fileData, fileName) => {
    const blob = new Blob([fileData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = data.filter(item =>
    (item.file_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="col-12">
        <div className="bg-secondary rounded h-100 p-4">
          <h6 className="mb-4">Failed Data</h6>

          {error && <div className="alert alert-danger">{error}</div>}

          <Form.Control
            type="text"
            placeholder="Search by FileName"
            className="mb-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="table-responsive">
            <Button variant="outline-success" className="m-2" onClick={handleShow}>
              Add
            </Button>
            {filteredData.length === 0 ? (
              <div>No records found</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">FileName</th>
                    <th scope="col">Action</th>
                    <th scope="col">Download</th> {/* New column for Download button */}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.file_name || 'N/A'}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          className="m-2"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          className="m-2"
                          onClick={() => handleDownload(item.file_data, item.file_name)}
                        >
                          Download
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

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>File</Form.Label>
              <Form.Control
                type="file"
                name="file"
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

export default FailedAdmin;
