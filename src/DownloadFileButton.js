// DownloadFileButton.js
import React from 'react';

const DownloadFileButton = ({ file }) => {
    const handleDownload = () => {
      const blob = new Blob([file.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = file.filename;
      link.click();
    };
  
    return (
      <button onClick={handleDownload}>
        Download File: {file.filename}
      </button>
    );
  };
  

export default DownloadFileButton;
