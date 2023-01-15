const Room = require("./room");

const MAX_ROOM_PLAYERS = 5;

module.exports = io => {

  let rooms = {}
  // const getRooms = () => Object.values(rooms).map(room => room.getInfo())

  const roomIO = io.of('/room')

  // Listen for new connections
  roomIO.on('connection', (socket) => {
    try {
      const { name, room: room_name } = socket.handshake.query
      console.log('A new player has connected!', name, room_name, socket.id);

      // get room or create
      if (!rooms[room_name]) {
        rooms[room_name] = new Room(room_name, { io, roomIO })
      }
      const room = rooms[room_name]

      // check room capacity
      if (room.getConnectedPlayers() >= MAX_ROOM_PLAYERS) {
        socket.emit('error', 'Room is full!')
        socket.disconnect()
        return
      }

      // join player to room
      room.join(name, socket)
      socket.join(room_name)

      // send inital data
      socket.emit('init', room.getPlayers())

      // listen to player position change
      socket.on('player-position-changed', data => {
        room.updatePlayerPosition(name, data)
      })

      // listen to player score change
      socket.on('players-collided', ({ winner, loser }) => {
        if (room.players[winner] && room.players[loser]?.alive) {
          room.players[loser].alive = false
          room.addPlayerScore(winner, 1)

          room.broadcast('kill-player', loser)

          setTimeout(() => {
            room.players[loser].socket.emit('change-mode')
          }, 5000)
        
          setTimeout(() => {
            room.players[loser].alive = true
            room.broadcast('respawn-player', loser)
          }, 10000)
        }
      })

      // Listen for a "disconnect" event
      socket.on('disconnect', () => {
        console.log('A player has disconnected!', name, room_name);
        room.leave(name)
      });
    }
    catch (e) {
      console.log('an error occured', socket.handshake.query, e);
      socket.emit('error', e.toString())
      socket.disconnect()
    }
  });

}