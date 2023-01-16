
module.exports = class Player {

  constructor(socket, {isConnected = true,
    name,
    x = 0,
    y = 0,
    angle = 0,
    mode = 0,
    score = 0,
    alive = false,
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
    this.alive = alive
  }
}