// ConnectionApproval.js
import React from "react";
import "./styles.css";

const ConnectionApproval = ({ id, onAccept, onReject }) => {
  return (
    <div className="connection-approval-modal">
      <p className="approval-label">
        <span>Incoming Connection from</span>
        {id}
      </p>
      <div className="approval-buttons">
        <button className="accept-button" onClick={onAccept}>
          Accept
        </button>
        <button className="reject-button" onClick={onReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default ConnectionApproval;
