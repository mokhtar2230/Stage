import React from 'react';

const DownloadReportButton = ({ userId, reportId, fileName }) => {
  // Construct the URL for downloading the report
  const downloadUrl = `http://127.0.0.1:5000/download_report/${userId}/${reportId}`;

  return (
    <a
      href={downloadUrl}
      className="btn btn-outline-primary"
      download={fileName}  // This is used to suggest a default file name for the download
    >
      Download
    </a>
  );
};

export default DownloadReportButton;
