

module.exports = class Room {

  constructor(name, { io }) {
    this.name = name
    this.players = {}

    this.io = io
  }

  join(name) {
    if (!this.players[name]) {
      this.players[name] = {
        connected: true,
        name,
        x: 0,
        y: 0,
        angle: 0,
        score: 0,
      }
    }

    this.players[name].connected = true

    this.broadcast('add-player', this.players[name])
  }

  leave(name) {
    if (this.players[name]) {
      this.players[name].connected = false;
    }

    this.broadcast('remove-player', this.players[name])
  }

  getPlayer(name) {
    return this.players[name]
  }

  updatePlayer(name, data) {
    if (this.players[name]) {
      this.players[name] = {
        ...this.players[name],
        ...data,
      }
    }
  }

  broadcast(...args) {
    this.io.to(this.name).emit(...args)
  }

}