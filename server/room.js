const Player = require("./player")


module.exports = class Room {

  constructor(name, { io, roomIO }) {
    this.name = name
    this.players = {}

    this.io = io
    this.roomIO = roomIO
  }

  join(name, socket) {
    if (!this.players[name]) {
      this.players[name] = new Player(socket, { name })
    }
    else {
      this.players[name].socket = socket
      this.players[name].connected = true
    }

    this.broadcast('add-player', this.getPlayer(name))
  }

  leave(name) {
    if (this.players[name]) {
      this.players[name].connected = false;
    }

    this.broadcast('remove-player', this.getPlayer(name))
  }

  getPlayers() {
    const players = {}
    for (let p in this.players) {
      const { socket, ...data } = this.players[p]
      players[p] = data
    }
    return players
  }

  getPlayer(name) {
    const { socket, ...player } = this.players[name]
    return player
  }

  getConnectedPlayers() {
    return Object.values(this.players).filter(p => p.connected).length
  }

  updatePlayerPosition(name, data) {
    if (this.players[name]) {
      this.players[name] = {
        ...this.players[name],
        ...data,
      }
    }

    this.broadcast('change-player-position', name, {
      x: data.x,
      y: data.y,
      angle: data.angle,
      mode: data.mode,
    })
  }

  addPlayerScore(name, score) {
    if (this.players[name]) {
      this.players[name].score += score

      this.broadcast('change-player-score', name, this.players[name].score)
    }
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