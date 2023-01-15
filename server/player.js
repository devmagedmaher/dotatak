
module.exports = class Player {

  constructor(socket, { connected = true, name, x = 0, y = 0, angle = 0, score = 0, alive = true }) {
    this.socket = socket

    this.connected = connected
    this.name = name
    this.x = x
    this.y = y
    this.angle = angle
    this.score = score
    this.alive = alive
  }
}