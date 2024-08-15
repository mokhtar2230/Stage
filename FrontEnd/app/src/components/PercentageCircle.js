import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import FilterByECU from './FilterByECU';
import FilterByTCName from './FilterByTCName';
import { Modal, Button } from 'react-bootstrap';

const PercentageCircle = ({ pr_failed = 0, Success = 0, no_Results = 0, naCount = 0, ECU = [], TC_NAME = [] }) => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedECU, setSelectedECU] = useState('');
  const [selectedTCNAME, setSelectedTCNAME] = useState('');

  const total = Success + no_Results + naCount + pr_failed;
  const isEmpty = total === 0;

  const data = [
    { name: 'Success', value: Success, percentage: total ? ((Success / total) * 100).toFixed(1) : 0 },
    { name: 'No Results', value: no_Results, percentage: total ? ((no_Results / total) * 100).toFixed(1) : 0 },
    { name: 'NA', value: naCount, percentage: total ? ((naCount / total) * 100).toFixed(1) : 0 },
    { name: 'Failed', value: pr_failed, percentage: total ? ((pr_failed / total) * 100).toFixed(1) : 0 },
  ];

  const defaultData = [{ name: 'Empty', value: 1 }];

  const colors = ['#84d888', '#ffeb9c', '#b6b6b6', '#ff6f6f'];

  const handleShowMore = (e) => {
    e.preventDefault();
    setModalShow(true);
  };

  const handleECUChange = (e) => {
    setSelectedECU(e.target.value);
  };

  const handleTCNAMEChange = (e) => {
    setSelectedTCNAME(e.target.value);
  };

  const handleSelectComponent = (component) => {
    setSelectedComponent(component);
    setModalShow(false); // Close the modal after selecting
  };

  return (
    <div className="h-100 bg-secondary rounded p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h6 className="mb-0">Detailed Analysis</h6>
        <a href="/" onClick={handleShowMore}>Show More</a>
      </div>
      <div className="d-flex justify-content-center">
        <div style={{ width: 300, height: 300 }}>
          <PieChart width={380} height={330}>
            <Pie
              data={isEmpty ? defaultData : data}
              dataKey="value"
              outerRadius={120}
              fill="#b6b6b6"
              label={({ percentage }) => !isEmpty ? `${percentage}%` : ''}
            >
              {(isEmpty ? defaultData : data).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={isEmpty ? '#b6b6b6' : colors[index]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`]}
            />
            <Legend />
          </PieChart>
        </div>
      </div>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detailed Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>Choose filter type:</h1>
          <div className="d-flex justify-content-around mb-4">
            <Button variant="primary" onClick={() => handleSelectComponent('FilterByECU')}>
              Filter by ECU
            </Button>
            <Button variant="secondary" onClick={() => handleSelectComponent('FilterByTCName')}>
              Filter by TC Name
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {selectedComponent === 'FilterByECU' && (
        <FilterByECU
          show={true}
          handleClose={() => setSelectedComponent(null)}
          title="Detailed Analysis"
          ECU={ECU}
          selectedECU={selectedECU}
          handleECUChange={handleECUChange}
        />
      )}

      {selectedComponent === 'FilterByTCName' && (
        <FilterByTCName
          show={true}
          handleClose={() => setSelectedComponent(null)}
          title="Detailed Analysis"
          TC_NAME={TC_NAME}
          selectedTCNAME={selectedTCNAME}
          handleTCNAMEChange={handleTCNAMEChange}
        />
      )}
    </div>
  );
};

export default PercentageCircle;
