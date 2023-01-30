
module.exports.SERVER_URL = '',
// module.exports.SERVER_URL = 'http://192.168.1.97:9001',
module.exports.SERVER_URL = 'https://af33-197-46-99-130.eu.ngrok.io',
module.exports.SOCKET_URL = module.exports.SERVER_URL,

module.exports.EVENTS = {
  SOCKET: {
    ROOM: {
      INIT: 'room-initialize', // send inital data to player
      ERROR: 'error', // send error message when error occurs on the server
      DISCONNECT: 'disconnect', // when player disconnects (DO NOT CHANGE THIS EVENT)
    },
    PLAYER: {
      // event sent to the server
      MODE_CHANGED: 'player-mode-changed', // get new player mode when changes
      POSITION_CHANGED: 'player-position-changed', // get new player position when player moves
      COLLIDED: 'players-collided', // get 2 players when collide
      DASHED: 'player-dashed', // get player that dashed

      // event sent to the client
      ADD: 'add-player', // send new player who joined the room
      REMOVE: 'remove-player', // send player name leaved the room
      CHANGE_MODE: 'change-player-mode', // send mode of a player
      CHANGE_POISITION: 'change-player-position', // send position of a player
      DASH: 'dash-player', // send player dash
      KILL: 'kill-player', // send to kill a player lost
      RESPAWN: 'respawn-player', // send to respawn a player
      CHANGE_SCORE: 'change-player-score', // send score of a player
      CHANGE_ADMIN: 'change-player-admin', // send name of new room admin
      SWITCH_MODE: 'switch-mode', // send player to change his mode
    },
    PING: 'ping',
    PONG: 'pong',
  },
}

module.exports.GAME = {
  MAP: {
    SIZE: 1300, // width and height of map
  },
  PLAYER: {
    MODES: [ // player modes
      0, // rock
      1, // paper
      2, // scissors
    ],
    TINTS: [
      0xFF9800, // Tangerine Orange
      0x8BC34A, // Lime Green
      0x00ffff, // Cyan
      0xFF00FF, // Magenta 
      0xFFEB3B, // Daffodil Yellow
      0x9E9E9E, // Gray
      0xF44336, // Scarlet Red
      0x00FF00, // Chartreuse Green
      0x2196F3, // Ultramarine Blue
      0x9C27B0, // Plum Purple
      0xEEEEEE, // Light Gray
      0xE91E63, // Bubble gum Pink
    ]
  },
}
