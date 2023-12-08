// FileTransfer.js
import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

const FileTransfer = () => {
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    // Create a new Peer instance
    const newPeer = new Peer();

    newPeer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });

    setPeer(newPeer);

    return () => {
      // Cleanup peer on component unmount
      newPeer.destroy();
    };
  }, []);

  return (
    <div>
      {/* Your FileTransfer component UI */}
    </div>
  );
};

export default FileTransfer;
