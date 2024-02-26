// UserIdComponent.js
import React, { useState, useEffect } from "react";
import Peer from "peerjs";
// import ReactHtmlParser from "react-html-parser";
import DOMPurify from 'dompurify';
import ConnectionApproval from "./ConnectionApproval";
import "./styles.css";

const UserIdComponent = () => {
  const [uniqueId, setUniqueId] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [peer, setPeer] = useState(null);
  const [connection, setConnection] = useState(null);
  const [peerIdInput, setPeerIdInput] = useState("");
  const [showApproval, setShowApproval] = useState(false); // Initially, hide the approval modal
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [fileInput, setFileInput] = useState(null);

  useEffect(() => {
    const newPeerInstance = new Peer();

    newPeerInstance.on("open", (id) => {
      setUniqueId(id);
    });

    newPeerInstance.on("connection", (conn) => {
      console.log("Incoming connection:", conn.peer);
      setIncomingRequest({ id: conn.peer, conn, pending: true });

      conn.on("open", () => {
        console.log("Connection to", conn.peer, "established");
        setConnection(conn);
      });

      conn.on("error", (error) => {
        console.error("Connection error:", error);
      });

      conn.on("data", (data) => {
        console.log("Received data:", data);
        // if (data.text) {
        //   console.log("Received message:", data.text);
        //   setReceivedMessages((prevMessages) => [
        //     ...prevMessages,
        //     { text: data.text, sender: conn.peer },
        //   ]);
        // }
      });
    });

    setPeer(newPeerInstance);

    return () => {
      if (newPeerInstance) {
        newPeerInstance.destroy();
      }
    };
  }, []);


  // useEffect(() => {
  //   if (connection) {
  //     connection.on("open", () => {
  //       setConnectionStatus("Your Connection is now Open!");

  //       if (incomingRequest && incomingRequest.pending) {
  //         incomingRequest.conn.send({
  //           connectionStatus:
  //             'You\'re in! Your files are now geared up for a <span class="sprint-span">sprint</span>.',
  //         });
  //       }
  //     });

  //     connection.on("close", () => {
  //       setConnectionStatus("Connection Closed");
  //       setConnection(null);
  //     });

  //     connection.on("data", (data) => {
  //       if (data.connectionStatus) {
  //         console.log("Received connection status:", data.connectionStatus);

  //         // Extract connection status and set it to conn-status
  //         const connectionStatusValue = data.connectionStatus;

  //         // Update the UI or state with the connection status
  //         setConnectionStatus(connectionStatusValue);
  //       } else if (data.file) {
  //         console.log("Received file:", data.filename, "Size:", data.filesize);
  //       } else if (data.text) {
  //         console.log("Received message:", data.text);
  //         setReceivedMessages((prevMessages) => [
  //           ...prevMessages,
  //           { text: data.text, sender: connection.peer },
  //         ]);
  //       }
  //     });
  //   }
  // }, [connection, incomingRequest]);

  useEffect(() => {
    if (connection) {
      connection.on("open", () => {
        setConnectionStatus("Your Connection is now Open!");
  
        if (incomingRequest && incomingRequest.pending) {
          incomingRequest.conn.send({
            connectionStatus:
              'You\'re in! Your files are now geared up for a <span class="sprint-span">sprint</span>.',
          });
        }
      });
  
      connection.on("close", () => {
        setConnectionStatus("Connection Closed");
        setConnection(null);
      });
  
      // Remove previous event listeners
      connection.off("data", handleReceiveMessage);
  
      // Add a new event listener
      connection.on("data", handleReceiveMessage);
    }
  }, [connection, incomingRequest]);
  

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setFileInput(file);
  };

  const handleSendFile = () => {
    if (connection && fileInput) {
      const reader = new FileReader();

      reader.onloadend = () => {
        connection.send({
          dataType: "FILE",
          file: reader.result,
          fileName: fileInput.name,
          fileType: fileInput.type,
        });
      };

      reader.readAsArrayBuffer(fileInput);
    }
  };

  const handleCopyToClipboard = () => {
    const uniqueIdElement = document.querySelector(".your-unique-id");

    if (uniqueIdElement) {
      const idToCopy = uniqueIdElement.textContent || uniqueIdElement.innerText;

      if (navigator.clipboard) {
        // Use Clipboard API if available
        navigator.clipboard
          .writeText(idToCopy)
          .then(() => showCopyStatus("ID copied to clipboard!"))
          .catch((err) =>
            showCopyStatus(`Copying to clipboard failed: ${err}`)
          );
      } else {
        // Fallback for browsers that do not support Clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = idToCopy;
        document.body.appendChild(textArea);
        textArea.select();

        try {
          document.execCommand("copy");
          showCopyStatus("ID copied to clipboard!");
        } catch (err) {
          showCopyStatus(`Copying to clipboard failed: ${err}`);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    }
  };

  const handleConnect = () => {
    if (peer && peerIdInput) {
      const conn = peer.connect(peerIdInput);

      conn.on("open", () => {
        console.log("Connection to", conn.peer, "established");
        setConnection(conn);
      });

      conn.on("data", (data) => {
        console.log("Received data:", data);
        if (data.file) {
          console.log("Received file:", data.filename, "Size:", data.filesize);
        } else if (data.text) {
          console.log("Received message:", data.text);
          setReceivedMessages((prevMessages) => [
            ...prevMessages,
            { text: data.text, sender: conn.peer },
          ]);
        }
      });

      conn.on("close", () => {
        console.log("Connection closed");
        setConnection(null);
      });
    }
  };

  const handleSendData = () => {
    if (connection) {
      const dataToSend = "Hello, this is a message!";
      connection.send(dataToSend);
    }
  };

  const handleAcceptRequest = () => {
    console.log("Accepted connection request from:", incomingRequest.id);
    setConnection(incomingRequest.conn);
    setIncomingRequest(null);
    setShowApproval(false);
    const successMessage =
      'You\'re in! Your files are now geared up for a <span class="sprint-span">sprint</span>.';

    // Notify the sender
    if (incomingRequest && !incomingRequest.pending) {
      incomingRequest.conn.send({ connectionStatus: successMessage });
    }

    // Notify the receiver
    if (connection) {
      connection.send({ connectionStatus: successMessage });
    }

    // Update the connection status for both the sender and the receiver
    setConnectionStatus(successMessage);
    if (incomingRequest && !incomingRequest.pending) {
      incomingRequest.conn.send({ connectionStatus: successMessage });
    }
  };

  const handleRejectRequest = () => {
    console.log("Rejected connection request from:", incomingRequest.id);
    if (incomingRequest.conn) {
      incomingRequest.conn.close();
    }
    setIncomingRequest(null);
    setShowApproval(false);
    setConnectionStatus(`Connection was Rejected by ${incomingRequest.id}`);
  };

  const showCopyStatus = (status) => {
    setCopyStatus(status);

    requestAnimationFrame(() => {
      const copyStatusBox = document.querySelector(".copy-status-box");
      copyStatusBox.classList.add("show");

      setTimeout(() => {
        copyStatusBox.classList.add("outro");
      }, 2000);

      setTimeout(() => {
        setCopyStatus("");
        copyStatusBox.classList.remove("show", "outro");
      }, 2500);
    });
  };

  const handleReceiveMessage = (data) => {
    if (data.connectionStatus) {
      console.log("Received connection status:", data.connectionStatus);

      // Extract connection status and set it to conn-status
      const connectionStatusValue = data.connectionStatus;

      // Update the UI or state with the connection status
      setConnectionStatus(connectionStatusValue);
    } else if (data.text) {
      console.log("Received message:", data.text);

      // Update the state with the new message
      setReceivedMessages((prevMessages) => [
        ...prevMessages,
        { text: data.text, sender: connection.peer },
      ]);
    } else if (data.dataType === 'FILE' && data.file instanceof Uint8Array) {
      console.log("Received file:", data.fileName, "Type:", data.fileType);
  
      // Convert Uint8Array to Blob
      const blob = new Blob([data.file], { type: data.fileType });
  
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = data.fileName;
  
      // Trigger download
      downloadLink.click();
    } // Add this to your handleReceiveMessage function
    else if (data.dataType === 'FILE' && data.file instanceof ArrayBuffer) {
      console.log("Received file:", data.fileName, "Type:", data.fileType);
    
      // Convert ArrayBuffer to Blob
      const blob = new Blob([data.file], { type: data.fileType });
    
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = data.fileName;
    
      // Trigger download
      downloadLink.click();
    }
  };

  const handleSendMessage = () => {
    if (connection && inputMessage.trim() !== "") {
      connection.send({ text: inputMessage });
      setReceivedMessages((prevMessages) => [
        ...prevMessages,
        { text: inputMessage, sender: "You" },
      ]);
      setInputMessage("");
    }
  };

  // // Add these console.log statements to your UserIdComponent.js
  // console.log('showApproval:', showApproval);
  // console.log('incomingRequest:', incomingRequest);

  return (
    <div>
      <div className={`copy-status-box${copyStatus ? " show" : ""}`}>
        {copyStatus}
      </div>
      <div className={`user-id-container${showApproval ? " blur" : ""}`}>
        <div className="user-id-div">
          <p className="your-id-label">Your ID: </p>
          <p className="your-unique-id">{uniqueId}</p>
          <div className="copy-svg-div" onClick={handleCopyToClipboard}>
            <svg
              width="26"
              height="30"
              viewBox="0 0 26 30"
              fill="none"
              className="copy-svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.00073 5.21312L3 21.25C3 24.5637 5.57884 27.2751 8.83906 27.4867L9.25 27.5L20.286 27.5018C19.7707 28.9573 18.3821 30 16.75 30H8C3.85786 30 0.5 26.6421 0.5 22.5V8.75C0.5 7.11695 1.54386 5.72771 3.00073 5.21312ZM21.75 0C23.8211 0 25.5 1.67893 25.5 3.75V21.25C25.5 23.3211 23.8211 25 21.75 25H9.25C7.17893 25 5.5 23.3211 5.5 21.25V3.75C5.5 1.67893 7.17893 0 9.25 0H21.75ZM21.75 2.5H9.25C8.55964 2.5 8 3.05964 8 3.75V21.25C8 21.9404 8.55964 22.5 9.25 22.5H21.75C22.4404 22.5 23 21.9404 23 21.25V3.75C23 3.05964 22.4404 2.5 21.75 2.5Z"
                fill="#212121"
              />
            </svg>
          </div>
          <div className="conn-input-div">
            <div className="input-section-div">
              <p className="conn-label">Enter Recipient's ID</p>
              <div className="input-bar-div">
                <input
                  className="id-input-bar"
                  type="text"
                  placeholder="Paste it here!"
                  value={peerIdInput}
                  onChange={(e) => setPeerIdInput(e.target.value)}
                />
              </div>
              <div className="connect-button-div">
                <button className="connect-button" onClick={handleConnect}>
                  Connect
                </button>
              </div>
              <div className="conn-status-div" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(connectionStatus) }}></div>
              // <button onClick={handleSendData}>Send Data</button>
              <div className="separation-line-div">
                <div className="separation-line"></div>
              </div>
              {/* <button onClick={handleSendData}>Send Data</button> */}
              <div className="message-container">
              <div className="text-input-div">
                
                <input
                  type="text"
                  className="input-bar"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <button onClick={handleSendMessage} className="send-button">
                <svg
                  viewBox="0 0 28 28"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#212121"
                  width="24px"
                  height="24px"
                >
                  <path d="M3.79,2.77L24.86,12.85C25.48,13.15 25.75,13.89 25.45,14.52C25.33,14.77 25.12,14.98 24.86,15.11L3.79,25.18C3.17,25.48 2.42,25.22 2.12,24.59C1.99,24.32 1.97,24.02 2.04,23.73L4.15,16C4.2,15.8 4.37,15.66 4.57,15.63L14.78,14.25C14.87,14.24 14.94,14.18 14.97,14.1L14.99,14.04C15.01,13.92 14.94,13.81 14.83,13.77L14.78,13.75L4.58,12.37C4.38,12.34 4.22,12.2 4.16,12L2.04,4.23C1.86,3.56 2.26,2.88 2.92,2.69C3.21,2.62 3.52,2.64 3.79,2.77Z"/>
                </svg>
                </button>
                </div>
              </div>
              <div className="received-messages-container">
                <h2>Received Messages</h2>
                <ul>
                  {receivedMessages.map((message, index) => (
                    <li key={index}>
                      {message.sender}: {message.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {incomingRequest && incomingRequest.pending && (
        <div className="overlay">
          <ConnectionApproval
            id={incomingRequest.id}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
          />
        </div>
      )}
      <div className="file-input-div">
        <input type="file" onChange={handleFileInputChange} />
        <button onClick={handleSendFile}>Send File</button>
      </div>
    </div>
  );
};

export default UserIdComponent;
