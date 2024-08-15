import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadComponent from './components/UploadComponent';
import FailedAdmin from './components/FailedAdmin';

const MainContent = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<UploadComponent />} />
      <Route path="/history" element={<div>History Component</div>} />
      <Route path="/failed" element={<FailedAdmin />} />
      <Route path="/tables" element={<div>Tables Component</div>} />
      <Route path="/charts" element={<div>Charts Component</div>} />
      <Route path="/signin" element={<div>Sign In Component</div>} />
      <Route path="/signup" element={<div>Sign Up Component</div>} />
      <Route path="/404" element={<div>404 Error Component</div>} />
      <Route path="/blank" element={<div>Blank Page Component</div>} />
    </Routes>
  );
};

export default MainContent;
