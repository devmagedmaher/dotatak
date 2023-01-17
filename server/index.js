// Import the required modules
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors')
const path = require('path');

// Initialize the Express app
const app = express();

// Allow cors to express server
app.use(cors({
  origin: '*',
}));

// Route ping
app.get('/health', (_, res) => res.send('ok'))
// Route get random username
app.get('/username', (_, res) => res.json({ username: require('./utils/get-meaningful-username')() }))

// serve public direcotry
app.use(express.static(path.join(__dirname, 'public')))

// Create the HTTP server
const server = http.createServer(app);

// Start the server
const PORT = process.env.PORT || 9001
server.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});


// Initialize Socket.IO
const io = socketio(server, {
  cors: {
    origin: '*',
  }
});

require('./socket')(io)