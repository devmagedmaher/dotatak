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
    if (!this.getPlayer(name)) {
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
  }

  leave(name) {
    if (this.getPlayer(name)) {
      this.players[name].isConnected = false;
      if (this.getPlayer(name).isAdmin) {
        this.players[name].isAdmin = false
        this.setRandomAdmin()
      }
    }
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
    for (let name in this.players) {
      const player = this.getPlayer(name)
      if (connectedOnly && !player.isConnected) {
        continue
      }
      players[name] = player
    }
    return players
  }

  getPlayer(name) {
    if (this.players[name]) {
      const { socket, ...player } = this.players[name]
      return player
    }
    return null
  }

  getConnectedPlayers() {
    return Object.values(this.players).filter(p => p.isConnected).length;
  }

  updatePlayerPosition(name, { x, y, angle }) {
    if (this.players[name]) {
      this.players[name].x = x
      this.players[name].y = y
      this.players[name].angle = angle
    }
    return this.getPlayer(name)
  }

  addPlayerScore(name, score) {
    if (this.getPlayer(name)) {
      this.players[name].score += score
    }
    return this.getPlayer(name)
  }

  killPlayer(name) {
    if (room.getPlayer(name)) {
      room.players[name].alive = false
    }
    return this.getPlayer(name)
  }

  respawnPlayer(name) {
    if (room.getPlayer(name)) {
      room.players[name].alive = true
    }
    return this.getPlayer(name)
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
    const { io, roomIO, players, ...room } = this
    return {
      ...room,
      players: Object.keys(players).length
    }
  }

  broadcast(...args) {
    this.roomIO.to(this.name).emit(...args)
  }

}