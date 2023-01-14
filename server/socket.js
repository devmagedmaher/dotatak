const Room = require("./room");

const MAX_ROOM_PLAYERS = 5;

module.exports = io => {

  let rooms = {}
  // const getRooms = () => Object.values(rooms).map(room => room.getInfo())

  const roomIO = io.of('/room')

  // Listen for new connections
  roomIO.on('connection', (socket) => {
    try {
      console.log('A new player has connected!', socket.handshake.query);
      const { name, room: room_name } = socket.handshake.query
  
      // get room or create
      if (!rooms[room_name]) {
        rooms[room_name] = new Room(room_name, { io, roomIO })
      }
      const room = rooms[room_name]
  
      // check room capacity
      console.log(name, room.getConnectedPlayers(), MAX_ROOM_PLAYERS)
      if (room.getConnectedPlayers() >= MAX_ROOM_PLAYERS) {
        socket.emit('error', 'Room is full!')      
        socket.disconnect()
        return
      }
  
      // join player to room
      room.join(name)
      socket.join(room_name)
  
      // send inital data
      socket.emit('init', room.players)
  
      // listen to player position change
      socket.on('player-position-changed', data => {
        room.updatePlayerPosition(name, data)
      })
  
      // listen to player position change
      socket.on('player-score-increased', (name, amount) => {
        if (room.players[name]) {
          room.updatePlayerScore(name, room.players[name].score + amount)
        }
      })
  
      // Listen for a "disconnect" event
      socket.on('disconnect', () => {
        console.log('A player has disconnected!', socket.handshake.query);
        room.leave(name)
      });
    }
    catch(e) {
      console.log('an error occured', socket.handshake.query, e);
      socket.emit('error', e.toString())
      socket.disconnect()
    }
  });

}