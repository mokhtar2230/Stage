import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import styled from 'styled-components';

// Register the required components for Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Styled components
const DarkModal = styled(Modal)`
  .modal-content {
    background-color: #343a40; /* Dark background for modal */
    color: #fff; /* White text color */
  }

  .modal-header,
  .modal-footer {
    border-color: #6c757d; /* Darker border color */
  }

  .form-select {
    background-color: #495057; /* Dark background for select dropdown */
    color: #fff; /* White text color */
  }

  .form-select option {
    background-color: #495057; /* Dark background for options */
    color: #fff; /* White text color */
  }
`;

const FilterByTCName = ({ show, handleClose, title, TC_NAME, selectedTCNAME, handleTCNAMEChange }) => {
  // Extract TC names
  const tcNames = TC_NAME.map((tc) => tc.name);

  // Determine the default selected TC
  const defaultSelectedTC = tcNames.length > 0 ? tcNames[0] : '';

  // Handle default selection if no TC is selected
  const [currentTC, setCurrentTC] = useState(selectedTCNAME || defaultSelectedTC);

  useEffect(() => {
    // Update currentTC if selectedTCNAME changes from parent
    if (selectedTCNAME && tcNames.includes(selectedTCNAME)) {
      setCurrentTC(selectedTCNAME);
    }
  }, [selectedTCNAME, tcNames]);

  // Find the selected TC and extract its percentages
  const selectedTCData = TC_NAME.find((tc) => tc.name === currentTC) || { No_Results: 0, success: 0, failed: 0 };

  const data = {
    labels: ['No Results', 'Success', 'Failed'],
    datasets: [
      {
        label: 'Files',
        data: [selectedTCData.No_Results, selectedTCData.success, selectedTCData.failed],
        backgroundColor: ['#ffeb9c', '#84d888', '#ff6f6f'], // Yellow for No Results, Green for Success, Red for Failed
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  const handleSelectChange = (event) => {
    const newTC = event.target.value;
    setCurrentTC(newTC);
    handleTCNAMEChange(event); // Call the parent's handler to update the selected TC
  };

  return (
    <DarkModal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="tcSelect" className="form-label">Select TC</label>
          <select id="tcSelect" value={currentTC} onChange={handleSelectChange} className="form-select">
            {tcNames.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <h6>Files:</h6>
          <Pie data={data} options={options} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </DarkModal>
  );
};

export default FilterByTCName;
