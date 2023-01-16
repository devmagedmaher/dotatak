const Player = require("./player")


module.exports = class Room {

  constructor(name, { io, roomIO }) {
    this.name = name
    this.isPlaying = false;
    this.isStarting = false;
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
      this.players[name].isConnected = true
    }

    if (this.getConnectedPlayers() === 1) {
      this.players[name].isAdmin = true
    }
    
    socket.join(this.name)
    this.broadcast('add-player', this.getPlayer(name))
  }

  leave(name) {
    if (this.players[name]) {
      this.players[name].isConnected = false;
      if (this.players[name].isAdmin) {
        this.players[name].isAdmin = false
        this.setRandomAdmin()
      }
    }

    this.broadcast('remove-player', this.getPlayer(name))
  }

  startGame(connectedOnly = true) {
    for (let p in this.players) {
      const player = this.players[p]
      if (connectedOnly && !player.isConnected) {
        continue
      }
      player.alive = true;
    }

    this.isPlaying = true;
    this.isStarting = false;

    this.broadcast('update-players-state', this.getPlayers(true))
  }

  getPlayers(connectedOnly = false) {
    const players = {}
    for (let p in this.players) {
      const { socket, ...data } = this.players[p]
      if (connectedOnly && !data.isConnected) {
        continue
      }
      players[p] = data
    }
    return players
  }

  getPlayer(name) {
    const { socket, ...player } = this.players[name]
    return player
  }

  getConnectedPlayers() {
    return Object.values(this.players).filter(p => p.isConnected).length;
  }

  updatePlayerPosition(name, data) {
    if (this.players[name]) {
      this.players[name] = {
        ...this.players[name],
        ...data,
      }
    }

    this.broadcast('change-player-position', name, data)
  }

  addPlayerScore(name, score) {
    if (this.players[name]) {
      this.players[name].score += score

      this.broadcast('change-player-score', name, this.players[name].score)
    }
  }

  setRandomAdmin() {
    if (this.getConnectedPlayers() > 0) {
      const firstPlayer = Object.values(this.players).find(p => p.isConnected)
      if (firstPlayer) {
        firstPlayer.isAdmin = true
        this.broadcast('set-new-admin', firstPlayer.name)
      }
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