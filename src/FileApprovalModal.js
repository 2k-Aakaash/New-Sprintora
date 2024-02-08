import React from 'react';
import './styles.css';

const FileApprovalModal = ({ onAccept, onReject }) => {
  return (
    <div className='file-approval-modal'>
      <p className='approval-label'>Incoming File Transfer</p>
      <div className='approval-buttons'>
        <button className='accept-button' onClick={onAccept}>
          Accept
        </button>
        <button className='reject-button' onClick={onReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default FileApprovalModal;
