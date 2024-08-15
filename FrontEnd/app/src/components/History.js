import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Alert, Container } from 'react-bootstrap';
import DownloadReportButton from './DownloadReportButton'; // Adjust the import path as necessary

const History = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/reports/');
        setReports(response.data.reports);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred');
      }
    };

    fetchReports();
  }, []);

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (

    <Container className="my-4">
          <div className="bg-secondary rounded h-100 p-4">
          <div className="table-responsive">
          <div className="table">
      <h2 className="mb-4">Your reports</h2>
      {reports.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>File Name</th>
        
              
              <th>Download</th>
       
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td>{report.file_name}</td>
       
                  
                <td>
                  <DownloadReportButton
                    userId={report.user_id}
                    reportId={report.id}
                    fileName={report.file_name}
                  />
                </td>
                
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No reports found.</div>
      )}
        </div>
        </div>
        </div>
    </Container>
  
  );
};

export default History;
