const _ = require('lodash')
const baseConfig = require('../config')


module.exports.DEFAULT = {
  ROOM: {
    MAX_PLAYERS: 5,
  },
  GAME: {
    TIMEOUT_TO_CHANGE_MODE_AFTER_KILLED: 9000, // 9 seconds,
    TIMEOUT_TO_RESPAWN_AFTER_KILLED: 10000, // 10 seconds,
  }
}


module.exports = _.merge(baseConfig, module.exports)