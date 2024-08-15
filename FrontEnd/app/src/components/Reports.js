import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Alert, Container } from 'react-bootstrap';
import DownloadReportButton from './DownloadReportButton'; // Adjust the import path as necessary

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/get_reports/');
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
    <div className="bg-secondary rounded h-100 p-4">
    <Container className="my-4">
      <h2 className="mb-4">User Reports</h2>
      {reports.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Uploaded By</th>
              
              <th>Download</th>
       
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td>{report.file_name}</td>
                <td>{report.username}</td>
                  
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
    </Container>
    </div>

  );
};

export default Reports;
