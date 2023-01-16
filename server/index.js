// Import the required modules
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors')
const path = require('path')

// Initialize the Express app
const app = express();

// Allow cors to express server
app.use(cors({
  origin: '*',
}));

// ping route
app.get('/ping', (_, res) => res.send('ping!'))

// handle public direcotry
app.use(express.static(path.join(__dirname, 'public')))

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
const PORT = process.env.PORT || 9001
server.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});
