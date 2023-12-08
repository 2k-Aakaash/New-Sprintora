// index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import App from './App';

// Use createRoot instead of ReactDOM.render
const root = document.getElementById('root');
const reactRoot = createRoot(root);

reactRoot.render(<App />);
