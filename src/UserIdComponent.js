// // UserIdComponent.js
// import React, { useState, useEffect } from 'react';
// import Peer from 'peerjs';
// import './styles.css';
// import { useDropzone } from 'react-dropzone';
// import IncomingConnection from './IncomingConnection'; // Adjust the import path

// const UserIdComponent = () => {
//     const [uniqueId, setUniqueId] = useState('');
//     const [recipientId, setRecipientId] = useState('');
//     const [connectionStatus, setConnectionStatus] = useState('');
//     const [incomingConnection, setIncomingConnection] = useState(null);
//     const [peer, setPeer] = useState(null);
//     const [rejectedConnections, setRejectedConnections] = useState([]);
//     const [selectedFile, setSelectedFile] = useState(null);
  
//     useEffect(() => {
//       const initializePeer = async () => {
//         const newPeer = await initializePeerConnection();
//         setPeer(newPeer);
  
//         newPeer.on('open', (id) => {
//           setUniqueId(id);
//         });
  
//         newPeer.on('connection', (conn) => {
//           // Handle incoming connection request
//           handleIncomingConnection(conn);
//         });
//       };
  
//       initializePeer();
  
//       return () => {
//         if (peer) {
//           peer.destroy();
//         }
//       };
//     }, []); // The empty dependency array ensures that this effect runs once on mount
  
//     const handleConnect = () => {
//       if (recipientId === '') {
//         setConnectionStatus('Please enter a recipient ID.');
//       } else {
//         // Initiate a connection
//         initiateConnection(recipientId);
//       }
//     };
  
//     const initializePeerConnection = async () => {
//       return new Peer();
//     };
  
  
//     const initiateConnection = (recipientId) => {
//         const conn = peer.connect(recipientId);
    
//         conn.on('open', () => {
//           // Connection established
//           setConnectionStatus(`Connected to ${recipientId}`);
//           // Send a confirmation message to the recipient
//           conn.send('Connection successful');
//         });
      
//         conn.on('data', (data) => {
//             // Handle data received from the connected peer
//             console.log(`Data received from ${conn.peer}:`, data);
      
//             if (data.startsWith('Connection rejected by')) {
//               // Handle rejection message
//               setRejectedConnections((prev) => [...prev, conn.peer]);
//               setConnectionStatus(`Rejected connection from ${conn.peer}`);
//             }
//           });
      
//           conn.on('error', (err) => {
//             // Handle connection error
//             setConnectionStatus(`Error connecting to ${recipientId}: ${err}`);
//           });
//         };
      
//     const handleIncomingConnection = (conn) => {
//       setIncomingConnection(conn);
//     };
  
//     const handleAccept = () => {
//         if (incomingConnection) {
//           // Update connection status
//           setConnectionStatus(`Connected to ${incomingConnection.peer}`);
    
//           // Send a confirmation message to the initiator
//           incomingConnection.send('Connection accepted');
    
//           incomingConnection.on('open', () => {
//             // Connection established
//             setIncomingConnection(null);
//           });
//         }
//       };
  
//       const handleReject = () => {
//         if (incomingConnection) {
//           // Broadcast the rejection message to all connected peers
//           peer.connections[incomingConnection.peer].forEach((conn) => {
//             conn.send(`Connection rejected by ${uniqueId}`);
//             conn.close();
//           });
    
//           // Update connection status
//           setConnectionStatus(`Rejected connection from ${incomingConnection.peer}`);
    
//           // Clear incoming connection state
//           setIncomingConnection(null);
    
//           // Add the rejecting peer to the rejected connections list
//           setRejectedConnections((prev) => [...prev, incomingConnection.peer]);
//         }
//       };
  
//     const onDrop = (acceptedFiles) => {
//         // Handle dropped files
//         if (acceptedFiles.length > 0) {
//           setSelectedFile(acceptedFiles[0]);
//         }
//       };
    
//       const { getRootProps, getInputProps } = useDropzone({ onDrop });
    
//       const handleSendFile = () => {
//         if (incomingConnection) {
//           // Display an approval box for file transfer
//           const approval = window.confirm(`Receive file ${selectedFile.name}?`);
//           if (approval) {
//             // Send the file to the connected peer
//             const reader = new FileReader();
//             reader.onload = (event) => {
//               const fileData = event.target.result;
//               incomingConnection.send({
//                 type: 'file',
//                 name: selectedFile.name,
//                 data: fileData,
//               });
//             };
//             reader.readAsDataURL(selectedFile);
    
//             // Clear selected file after sending
//             setSelectedFile(null);
//           }
//         }
//       };
    
//       useEffect(() => {
//         if (incomingConnection) {
//           // Handle data received from the connected peer
//           incomingConnection.on('data', (data) => {
//             console.log(`Data received from ${incomingConnection.peer}:`, data);
//             if (data.type === 'file') {
//               // Display an approval box for file transfer
//               const approval = window.confirm(`Receive file ${data.name}?`);
//               if (approval) {
//                 // Process the file data
//                 console.log(`File ${data.name} received successfully.`);
//               } else {
//                 // Handle rejection
//                 console.log(`File transfer rejected by ${incomingConnection.peer}.`);
//               }
//             } else {
//               // Handle other data if needed
//             }
//           });
//         }
//       }, [incomingConnection, selectedFile]);
    
//   return (
//     <div className='user-id-container'>
//         {incomingConnection && !rejectedConnections.includes(incomingConnection.peer) && (
//         <IncomingConnection
//           incomingId={incomingConnection.peer}
//           onAccept={handleAccept}
//           onReject={handleReject}
//         />
//       )}
//        <div className='file-transfer-section'>
//         <div {...getRootProps()} className='file-drop-zone'>
//           <input {...getInputProps()} />
//           <p>Drag 'n' drop a file here, or click to select a file</p>
//         </div>
//         {selectedFile && (
//           <div className='selected-file-info'>
//             <p>Selected File:</p>
//             <p>{`${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`}</p>
//           </div>
//         )}
//         <button onClick={handleSendFile} disabled={!selectedFile}>
//           Send File
//         </button>
//       </div>
//     <div className='user-id-div'>
//       <p className='your-id-label'>Your ID: </p>
//       <p className='your-unique-id'>{uniqueId}</p>
//       <div className='copy-svg-div'>
//         <svg width="26" height="30" viewBox="0 0 26 30" fill="none" className='copy-svg' xmlns="http://www.w3.org/2000/svg">
//         <path d="M3.00073 5.21312L3 21.25C3 24.5637 5.57884 27.2751 8.83906 27.4867L9.25 27.5L20.286 27.5018C19.7707 28.9573 18.3821 30 16.75 30H8C3.85786 30 0.5 26.6421 0.5 22.5V8.75C0.5 7.11695 1.54386 5.72771 3.00073 5.21312ZM21.75 0C23.8211 0 25.5 1.67893 25.5 3.75V21.25C25.5 23.3211 23.8211 25 21.75 25H9.25C7.17893 25 5.5 23.3211 5.5 21.25V3.75C5.5 1.67893 7.17893 0 9.25 0H21.75ZM21.75 2.5H9.25C8.55964 2.5 8 3.05964 8 3.75V21.25C8 21.9404 8.55964 22.5 9.25 22.5H21.75C22.4404 22.5 23 21.9404 23 21.25V3.75C23 3.05964 22.4404 2.5 21.75 2.5Z" fill="#212121"/>
//         </svg>
//       </div>
//       <div className='conn-input-div'>
//         <div className='input-section-div'>
//           <p className='conn-label'>Enter Recipient's ID</p>
//           <div className='input-bar-div'>
//           <input
//               className='id-input-bar'
//               type="text"
//               placeholder='Paste it here!'
//               value={recipientId}
//               onChange={(e) => setRecipientId(e.target.value)}
//             />
//           </div>
//           <div className='connect-button-div'>
//             <button className='connect-button' onClick={handleConnect}>Connect</button>
//           </div>
//           <div className='conn-status-div'>
//             <p className='conn-status'>{connectionStatus}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//   );
// };

// export default UserIdComponent;

// // Function to initialize Peer connection
// const initializePeerConnection = async () => {
//     return new Peer();
//   };

//   // Function to handle the connection
// const handleConnection = (recipientId) => {
//     // Implement the logic to establish a connection with the recipient
//     // Update the connectionStatus state based on the result
//   };


// UserIdComponent.js
import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';
import './styles.css';

const UserIdComponent = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    // Function to initialize Peer connection
    const initializePeerConnection = async () => {
      const newPeer = new Peer(); // Create a new instance of Peer

      newPeer.on('open', (id) => {
        setUniqueId(id); // Set the generated ID to the state
      });

      setPeer(newPeer); // Set the Peer instance to the state
    };

    initializePeerConnection();

    return () => {
      if (peer) {
        peer.destroy(); // Cleanup Peer instance on component unmount
      }
    };
  }, []);

  const handleCopyToClipboard = () => {
    const uniqueIdElement = document.querySelector('.your-unique-id');
    
    if (uniqueIdElement) {
      const idToCopy = uniqueIdElement.textContent || uniqueIdElement.innerText;

      if (navigator.clipboard) {
        // Use Clipboard API if available
        navigator.clipboard.writeText(idToCopy)
          .then(() => showCopyStatus('ID copied to clipboard!'))
          .catch((err) => showCopyStatus(`Copying to clipboard failed: ${err}`));
      } else {
        // Fallback for browsers that do not support Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = idToCopy;
        document.body.appendChild(textArea);
        textArea.select();

        try {
          document.execCommand('copy');
          showCopyStatus('ID copied to clipboard!');
        } catch (err) {
          showCopyStatus(`Copying to clipboard failed: ${err}`);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    }
  };
  
  const showCopyStatus = (status) => {
    setCopyStatus(status);
    
    // Use requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
      const copyStatusBox = document.querySelector('.copy-status-box');
      
      copyStatusBox.classList.add('show'); // Apply show class for the in animation
    
      // Clear copy status after a delay
      setTimeout(() => {
        copyStatusBox.classList.add('outro'); // Apply outro class for the out animation
      }, 2000); // Set the delay time (adjust as needed)
      
      // Clear copy status and classes after the outro animation
      setTimeout(() => {
        setCopyStatus('');
        copyStatusBox.classList.remove('show', 'outro'); // Remove show and outro classes
      }, 2500); // Set the delay time to match the total duration of in + out animations
    });
  };

  return (
    <div className='user-id-container'>
      <div className='user-id-div'>
        <p className='your-id-label'>Your ID: </p>
        <p className='your-unique-id'>{uniqueId}</p>
        <div className='copy-svg-div' onClick={handleCopyToClipboard}>
          <svg width="26" height="30" viewBox="0 0 26 30" fill="none" className='copy-svg' xmlns="http://www.w3.org/2000/svg">
            <path d="M3.00073 5.21312L3 21.25C3 24.5637 5.57884 27.2751 8.83906 27.4867L9.25 27.5L20.286 27.5018C19.7707 28.9573 18.3821 30 16.75 30H8C3.85786 30 0.5 26.6421 0.5 22.5V8.75C0.5 7.11695 1.54386 5.72771 3.00073 5.21312ZM21.75 0C23.8211 0 25.5 1.67893 25.5 3.75V21.25C25.5 23.3211 23.8211 25 21.75 25H9.25C7.17893 25 5.5 23.3211 5.5 21.25V3.75C5.5 1.67893 7.17893 0 9.25 0H21.75ZM21.75 2.5H9.25C8.55964 2.5 8 3.05964 8 3.75V21.25C8 21.9404 8.55964 22.5 9.25 22.5H21.75C22.4404 22.5 23 21.9404 23 21.25V3.75C23 3.05964 22.4404 2.5 21.75 2.5Z" fill="#212121"/>
          </svg>
        </div>
        <div className={`copy-status-box${copyStatus ? ' show' : ''}`}>
          {copyStatus}
        </div>
        <div className='conn-input-div'>
          <div className='input-section-div'>
            <p className='conn-label'>Enter Recipient's ID</p>
            <div className='input-bar-div'>
              <input className='id-input-bar' type="text" placeholder='Paste it here!'/>
            </div>
            <div className='connect-button-div'>
              <button className='connect-button'>Connect</button>
            </div>
            <div className='conn-status-div'>
              <p className='conn-status'>You're in! Your files are now geared up for a <span className='sprint-span'>sprint</span>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserIdComponent;