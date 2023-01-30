const { GAME } = require("./config")
const { randomHexColor } = require('./utils/randomHexColor')

module.exports = class Player {

  constructor(socket, {isConnected = true,
    name,
    x = Math.round(Math.random() * GAME.MAP.SIZE),
    y = Math.round(Math.random() * GAME.MAP.SIZE),
    angle = Math.round(Math.random() * 360),
    mode = GAME.PLAYER.MODES[Math.floor(Math.random() * GAME.PLAYER.MODES.length)],
    tint = 0xFFFFFF,
    score = 0,
    alive = true,
    isAdmin = false
  }) {
    this.socket = socket

    this.name = name
    this.isAdmin = isAdmin
    this.isConnected = isConnected
    this.isReady = false
    this.x = x
    this.y = y
    this.angle = angle
    this.score = score
    this.mode = mode
    this.tint = tint
    this.alive = alive
  }
}