

module.exports = class Room {

  constructor(name, { io, roomIO }) {
    this.name = name
    this.players = {}

    this.io = io
    this.roomIO = roomIO
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

  updatePlayerPosition(name, data) {
    if (this.players[name]) {
      this.players[name] = {
        ...this.players[name],
        ...data,
      }
    }

    this.broadcast('change-player-position', name, data.x, data.y)
  }

  updatePlayerScore(name, score) {
    if (this.players[name]) {
      this.players[name].score = score
    }

    this.broadcast('change-player-score', name, score)
  }

  getInfo() {
    return {
      name: this.name,
      players: Object.keys(this.players).length
    }
  }

  broadcast(...args) {
    this.roomIO.to(this.name).emit(...args)
  }

}