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

  /**
   * Join new player to the room
   * 
   */
  join(name, socket) {
    // if user is new to the room create one
    if (!this.getPlayer(name)) {
      this.players[name] = new Player(socket, { name })
    }
    // else: update socket instance and connectivity
    else {
      this.updatePlayerState(name, {
        socket,
        isConnected: true
      })
    }

    // anyway, if he is first to connect, make him admin
    if (this.getConnectedPlayers() === 1) {
      this.updatePlayerState(name, { isAdmin: true })
    }
    
    // join socket to the room
    socket.join(this.name)
  }

  /**
   * Leave existing player from the room
   * 
   */
  leave(name) {
    if (this.getPlayer(name)) {
      // change turn off player
      this.updatePlayerState(name, { isConnected: false })

      // if leavin player was an admin
      if (this.getPlayer(name).isAdmin) {
        // revoke his admin
        this.updatePlayerState(name, { isAdmin: false })
        // get new player in the room to be an admin
        return this.setRandomAdmin()
      }
    }

    return null
  }

  /**
   * Get all players data
   * 
   */
  getPlayers(connectedOnly = false) {
    const players = {}

    // loop all players
    for (let name in this.players) {
      // get each player data
      const player = this.getPlayer(name)
      // get connected only players in case flag is true
      if (connectedOnly && !player.isConnected) {
        continue
      }

      // store player data
      players[name] = player
    }

    return players
  }

  /**
   * Get single player data
   * 
   */
  getPlayer(name) {
    if (this.players[name]) {
      const { socket, ...player } = this.players[name]
      return player
    }

    return null
  }

  /**
   * Update player data
   * 
   */
  updatePlayerState(name, data) {
    if (this.getPlayer(name)) {
      for (let key in data) {
        if (data[key] !== undefined) {
          this.players[name][key] = data[key]
        }
      }
    }

    return this.getPlayer(name)
  }

  /**
   * Get number of connectd players
   * 
   */
  getConnectedPlayers() {
    return Object.values(this.players).filter(p => p.isConnected).length;
  }

  /**
   * Set first connected player as admin
   * 
   */
  setRandomAdmin() {
    // if there are any connected players
    if (this.getConnectedPlayers() > 0) {
      // get first connected player
      const newAdmin = Object.values(this.players).find(p => p.isConnected)
      if (newAdmin) {
        // make the player an admin
        this.updatePlayerState(newAdmin.name, { isAdmin: true })
        // return admin name
        return newAdmin.name
      }
    }

    return null
  }

  /**
   * Get room data
   * 
   */
  getInfo() {
    const { io, roomIO, players, ...room } = this
    return {
      ...room,
      players: Object.keys(players).length
    }
  }

  /**
   * Broadcase to room sockets
   * 
   */
  broadcast(...args) {
    this.roomIO.to(this.name).emit(...args)
  }

}