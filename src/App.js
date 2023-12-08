import React, { useState, useEffect } from 'react';
import Peer from 'peerjs'; // Import PeerJS library
import UserIdComponent from './UserIdComponent';
import './styles.css';


const MenuClosed = () => {
  return (
    <div>
      <div className='outline-div'>
        <div className='app-name-div'>
          <h1 className='app-name'>Sprintora</h1>
        </div>
        <div className='main-card-container'>
          <div className='main-card-div'>
          <UserIdComponent />
            <div className='separation-line-div'>
              <div className="separation-line"></div>
            </div>
            <div className='files-container'>
              <div className='send-files-label-div'>
                <p className='send-files-label'>Select Files</p>
              </div>
              <div className='select-files-button-div'>
                <button className='choose-files-button'>Choose Files</button>
              </div>
              <div className='send-button-div'>
                <button className='send-button'>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuClosed;

// // MenuClosed.js
// import React from 'react';
// import './styles.css';
// import UserIdComponent from './UserIdComponent';
// import SelectingFilesComponent from './SelectingFilesComponent';

// const MenuClosed = () => {
//   return (
//     <div>
//       <div className='outline-div'>
//         <div className='app-name-div'>
//           <h1 className='app-name'>Sprintora</h1>
//         </div>
//         <div className='main-card-container'>
//           <div className='main-card-div'>
//             <UserIdComponent />
//             <div className='separation-line-div'>
//               <div className="separation-line"></div>
//             </div>
//             <SelectingFilesComponent />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuClosed;
