import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import styled from 'styled-components';

// Register the required components for Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Styled components for dark-themed modal
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

const FilterByECU = ({ show, handleClose, title, ECU, selectedECU, handleECUChange }) => {
  // Extract ECU names
  const ecuNames = ECU.map((ecu) => ecu.name);

  // Determine the default selected ECU
  const defaultSelectedECU = ecuNames.length > 0 ? ecuNames[0] : '';

  // Handle default selection if no ECU is selected
  const [currentECU, setCurrentECU] = useState(selectedECU || defaultSelectedECU);

  useEffect(() => {
    // Update currentECU if selectedECU changes from parent
    if (selectedECU && ecuNames.includes(selectedECU)) {
      setCurrentECU(selectedECU);
    }
  }, [selectedECU, ecuNames]);

  // Find the selected ECU and extract its data
  const selectedECUData = ECU.find((ecu) => ecu.name === currentECU);

  // Prepare data for the Pie chart
  const data = {
    labels: ['No Results', 'Success', 'Failed'],
    datasets: [
      {
        label: 'Files',
        data: selectedECUData ? [selectedECUData.No_Results, selectedECUData.success, selectedECUData.failed] : [0, 0, 0],
        backgroundColor: ['#ffeb9c', '#84d888', '#ff6f6f'], // Colors for each category
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  // Options for the Pie chart
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

  // Handle ECU selection change
  const handleSelectChange = (event) => {
    const newECU = event.target.value;
    setCurrentECU(newECU);
    handleECUChange(event); // Call the parent's handler to update the selected ECU
  };

  return (
    <DarkModal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="ecuSelect" className="form-label">Select ECU</label>
          <select id="ecuSelect" value={currentECU} onChange={handleSelectChange} className="form-select">
            {ecuNames.map((name, index) => (
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

export default FilterByECU;
