
module.exports.SERVER_URL = 'http://localhost:9001',

module.exports.EVENTS = {
  SOCKET: {
    ROOM: {
      INIT: 'room-initialize', // send inital data to player
      ERROR: 'error', // send error message when error occurs on the server
      DISCONNECT: 'disconnect', // when player disconnects (DO NOT CHANGE THIS EVENT)
    },
    PLAYER: {
      // event sent to the server
      POSITION_CHANGED: 'player-position-changed', // get new player position when player moves
      COLLIDED: 'players-collided', // get 2 players when collide

      // event sent to the client
      ADD: 'add-player', // send new player who joined the room
      REMOVE: 'remove-player', // send player name leaved the room
      CHANGE_POISITION: 'change-player-position', // send position of a player
      KILL: 'kill-player', // send to kill a player lost
      RESPAWN: 'respawn-player', // send to respawn a player
      CHANGE_SCORE: 'change-player-score', // send score of a player
      CHANGE_MODE: 'change-mode', // send player to change his mode
    },
    PING: 'ping',
    PONG: 'pong',
  }
}