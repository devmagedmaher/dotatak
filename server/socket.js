const Room = require("./room");

module.exports = io => {

  let rooms = {}

  // Listen for new connections
  io.on('connection', (socket) => {
    console.log('A new player has connected!', socket.handshake.query);
    const { name, room: room_name } = socket.handshake.query

    // get room or create
    if (!rooms[room_name]) {
      rooms[room_name] = new Room(room_name, { io })
    }
    const room = rooms[room_name]
    room.join(name)
    socket.join(room_name)

    socket.emit('init', room.players)

    // listen to player position change
    socket.on('player-position-changed', (x, y) => {
      room.updatePlayer(name, { x, y })
      room.broadcast('change-player-position', name, x, y)
    })

    // Listen for a "disconnect" event
    socket.on('disconnect', () => {
      room.leave(name)
      console.log('A player has disconnected!', socket.handshake.query);
    });
  });

}