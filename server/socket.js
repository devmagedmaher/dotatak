const Room = require("./room");
const { DEFAULT } = require('./config');
const { EVENTS } = require("../config");

module.exports = io => {
  // init rooms container
  let rooms = {}

  // create "/room" workspace
  const roomIO = io.of('/room')

  // Listen for new connections
  roomIO.on('connection', (socket) => {
    try {
      // get player information
      const { name, room: room_name } = socket.handshake.query
      console.log('A new player has connected!', name, room_name, socket.id);

      // Create room by name if not exists
      if (!rooms[room_name]) {
        // create & store room instance
        rooms[room_name] = new Room(room_name, { io, roomIO })
      }

      // Get room by name
      const room = rooms[room_name]

      // Check of room capacity
      if (room.getConnectedPlayers() >= DEFAULT.ROOM.MAX_PLAYERS) {
        // send error to player with message
        socket.emit(EVENTS.SOCKET.ROOM.ERROR, 'Room is full!')
        // disconnect payer
        socket.disconnect()
        // discontinue after disconnection
        return
      }

      // join player to room
      room.join(name, socket)
      // send player data to room
      room.broadcast(EVENTS.SOCKET.PLAYER.ADD, room.getPlayer(name))

      // send inital data to player
      socket.emit(EVENTS.SOCKET.ROOM.INIT, room.getPlayers(true))
      
      // socket.on('game-starting', () => {
      //   if (!room.isPlaying && !room.isStarting) {
      //     room.isStarting = true;
      //     let counter = 5;

      //     const interval = setInterval(() => {
      //       console.log({ room_name, counter })
      //       room.broadcast('count-down', counter)

      //       if (counter <= 0) {
      //         clearInterval(interval)
      //         room.startGame()
      //       }

      //       counter--
      //     }, 1000);
      //   }
      // })

      // Listen to change of player mode
      socket.on(EVENTS.SOCKET.PLAYER.MODE_CHANGED, (mode) => {
        // upate player position
        room.updatePlayerState(name, { mode})
        // send player position to room
        room.broadcast(EVENTS.SOCKET.PLAYER.CHANGE_MODE, name, mode)
      })

      // Listen to change of player position
      socket.on(EVENTS.SOCKET.PLAYER.POSITION_CHANGED, (x, y, angle) => {
        // upate player position
        room.updatePlayerState(name, { x, y, angle })
        // send player position to room
        room.broadcast(EVENTS.SOCKET.PLAYER.CHANGE_POISITION, name, x, y, angle)
      })

      // Listen to collision of two players
      socket.on(EVENTS.SOCKET.PLAYER.COLLIDED, (winner, loser) => {
        if (room.getPlayer(winner) && room.getPlayer(loser)?.alive) {
          // kill player who lost
          room.updatePlayerState(loser, { alive: false })
          // send killed player name to room
          room.broadcast(EVENTS.SOCKET.PLAYER.KILL, loser)

          // add score to player who won
          room.updatePlayerState(winner, { score: room.getPlayer(winner).score + 1})
          // send new score of player who won
          room.broadcast(EVENTS.SOCKET.PLAYER.CHANGE_SCORE, winner, room.getPlayer(winner).score)

          // wait for timeout to change loser's mode
          setTimeout(
            () => {
              // send change mode command to loser
              room.players[loser].socket.emit(EVENTS.SOCKET.PLAYER.SWITCH_MODE)
            },
            DEFAULT.GAME.TIMEOUT_TO_SWITCH_MODE_AFTER_KILLED
          )

          // wait for timeout to respawn loser
          setTimeout(
            () => {
              // respawn player who lost
              room.updatePlayerState(loser, { alive: true })
              // send respawned player name to room
              room.broadcast(EVENTS.SOCKET.PLAYER.RESPAWN, loser)
            },
            DEFAULT.GAME.TIMEOUT_TO_RESPAWN_AFTER_KILLED
          )
        }
      })

      // Listen to "disconnect" event
      socket.on(EVENTS.SOCKET.ROOM.DISCONNECT, () => {
        console.log('A player has disconnected!', name, room_name);
        // leave player the room
        const newAdmin = room.leave(name)
        // send player to remove from room
        room.broadcast(EVENTS.SOCKET.PLAYER.REMOVE, name)
        // send new admin if player left was admin
        if (newAdmin) {
          room.broadcast(EVENTS.SOCKET.PLAYER.CHANGE_ADMIN, newAdmin)
        }
      });
    }
    catch (e) {
      console.log('an error occured', socket.handshake.query, e);
      // send error to player
      socket.emit(EVENTS.SOCKET.ROOM.ERROR, e.toString())
      // disconnect player
      socket.disconnect()
    }

    // Listen to "ping <=> pong" event
    socket.on("ping", () => socket.emit("pong"));
  });

}