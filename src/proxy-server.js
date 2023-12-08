const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();

app.all('/peerjs/*', (req, res) => {
  // Forward the request to the actual PeerJS server
  proxy.web(req, res, { target: 'https://0.peerjs.com', changeOrigin: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
