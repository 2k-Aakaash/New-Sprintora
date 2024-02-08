import React, { useState, useEffect, StrictMode } from "react";
import Peer from "peerjs"; // Import PeerJS library
import UserIdComponent from "./UserIdComponent";
import "./styles.css";

const App = () => {
  return (
    <React.StrictMode>
      <div>
        <div className="outline-div">
          <div className="app-name-div">
            <h1 className="app-name">Sprintora</h1>
          </div>
          <div className="main-card-container">
            <div className="main-card-div">
              <UserIdComponent />
              <div className="separation-line-div">
                <div className="separation-line"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default App;
