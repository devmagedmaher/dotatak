// Import the required modules
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors')

// Initialize the Express app
const app = express();

// Allow cors to express server
app.use(cors({
  origin: '*',
}));

// Create the HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketio(server, {
  cors: {
    origin: '*',
  }
});

require('./socket')(io)

// Start the server
server.listen(9001, () => {
    console.log('Server listening on port 9001');
});
