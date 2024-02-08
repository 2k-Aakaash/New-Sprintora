// server.js
const express = require('express');
const { ExpressPeerServer } = require('peer');
const path = require('path');

const app = express();

const server = app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use('/peerjs', peerServer);

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
