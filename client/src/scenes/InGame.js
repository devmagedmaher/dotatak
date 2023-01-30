import { EVENTS, GAME, PING_INTERVAL_TIME } from '../config';
import heroPNG from '../assets/images/hero.png';
import FullscreenButton from '../objects/buttons/fullscreen';
import DotHero from '../objects/hero/dot';
import DotHeroStatic from '../objects/hero/dot-static';
import addRandomBackgroundGeometries from '../utils/add-random-background-geometries';
import InfoText from '../objects/text/info';

export default class InGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InGameScene' });
  }

  init(data) {
    // setting passed data
    this.myName = data.myName;
    this.room = data.room;
    this.init_player = data.init_player
    this.init_players = data.init_players
    this.socket = data.socket;
    this.ping = null;
    this.pingDate = null;
    this.time = 0;

    // setting scene props
    this.players = {}
    this.isReady = true
    this.isAdmin = false
    this.map = {
      name: 'main',
      size: GAME.MAP.SIZE,
      color: 0x111111,
    }
    this.minimap = {
      name: 'mini',
      offset: 10,
      size: 120,
      zoom: 0.08,
      color: 0x002244,
    }
  }

  preload() {
    // preload game assets
    this.load.spritesheet('hero', heroPNG, {
      frameWidth: 100,
      frameHeight: 100
    });
  }

  create() {
    // create random background

    this.addPingEmitter()
    this.setWorldBounds()
    this.setupCamera()
    this.setUIGroup()
    this.setPlayers()
    this.listenToEvents()

    // ignore ui elements in the minimap camera
    this.minimapCamera.ignore(this.ui)
  }

  update(_, delta) {
    // update hero state
    this.hero.update()
    // send player position
    this.time += delta;
    if (this.time >= 100) {
      this.time = 0;
    }
    // console.log(Math.floor(this.hero.body.speed))
    if (this.hero.body.speed < 5) {
      this.emitPosition()
    }
    // this.emitPosition()
    // update hero
    this.updatePlayers()
    // update ui
    this.updateUIGroup()
  }




  /**
   * Set phyisical world bounds
   * 
   */
  setWorldBounds() {
    // set physical world bounds
    this.physics.world.setBounds(0, 0, this.map.size, this.map.size);
    // set background for physical world bounds
    this.add.rectangle(
      this.map.size / 2,
      this.map.size / 2,
      this.map.size,
      this.map.size,
      this.map.color,
    )
    addRandomBackgroundGeometries(this, 0.35)
  }

  /**
   * Setup main and minimap cameras
   * 
   */
  setupCamera() {
    // setup bounds of main camera to world bounds
    this.mainCamera = this.cameras.main.setBounds(
      0,
      0,
      this.map.size,
      this.map.size
    ).setName(this.map.name);
    // setup minimap camera
    this.minimapCamera = this.cameras.add(
      this.minimap.offset,
      this.minimap.offset,
      this.minimap.size,
      this.minimap.size
    ).setZoom(this.minimap.zoom)
    .setName(this.minimap.name)
    .setBackgroundColor(this.minimap.color)    
  }

  /**
   * Add UI text and buttons
   * and igronre elements in the minimap camera
   */
  setUIGroup() {
    // create group for UI elements
    this.ui = this.add.group()
    // add UI Text
    // - add info text (room - name: score (alive|dead) [weapon] #rank)
    this.infoText = new InfoText(this, this.minimap.size + this.minimap.offset * 2, 10, `${this.room}`)
    // - add players list text

    // add UI buttons
    // - add full screen button
    this.fullscreenButton = new FullscreenButton(this, this.scale.width - 10, 10, undefined, { origin: { x: 1 } })
    // - add ready button

    // add to ui group
    this.ui.addMultiple([
      this.infoText,
      this.fullscreenButton,
    ])
  }

  /**
   * Add players to the scene
   * and add the collission detection between them
   * 
   */
  setPlayers() {
    // create collision group
    this.collidable = this.add.group()
    // add hero (in random position)
    this.hero = new DotHero(this, this.init_player);
    // console.log('HERO', this.hero)
    // // emit hero mode/position to other players
    // this.emitMode(this.hero.mode)
    // add existing other players
    this.setAllPlayers()
    // add other players to collidable group
    this.collidable.addMultiple(Object.values(this.players))
    // add overlap (insted of collision) for collision detection between this player and others
    this.physics.add.overlap(
      this.hero,
      this.collidable,
      this.onCollision.bind(this)
    )
  }

  /**
   * Add existing other players
   * 
   */
  setAllPlayers() {
    console.log('init', this.init_players)
    for (let player in this.init_players) {
      // console.log('INIT', player, this.init_players[player])
      this.players[player] = new DotHero(this, this.init_players[player], false)

      // check if this is hero's player
      if (player === this.myName) {
        // add player mimic to hero object (for easier accissibility)
        // this.hero.player = this.players[player]
      }
    }
  }




  /**
   * update all players including hero
   * 
   */
  updatePlayers() {
    // update all players
    for (let player in this.players) {
      this.players[player].update()
    }
    // update self
    // - is admin prop
    // this.isAdmin = this.hero.player.isAdmin
  }

  /**
   * Update UI components (text/buttons)
   * 
   */
  updateUIGroup() {
    // update buttons
    this.fullscreenButton.update()
    // update text
    this.infoText.update()
  }





  /**
   * Handle players collision when detected
   * 
   */
  onCollision(a, b) {
    // const [a, b] = [ this.players[pA.name], this.players[pB.name] ]
    console.log('onCollision', { a, b })
    if (a && b && a.mode !== b.mode) {
      // get winner and loser between them
      const RPS_RULES = [[[], [b, a], [a, b]], [[a, b], [], [b, a]], [[b, a], [a, b], []]];
      const [winner, loser] = RPS_RULES[a.mode][b.mode];
      
      if (winner && loser && loser.alive) {
        loser.updateState({ alive: false })
        this.emitCollision.call(this, winner.name, loser.name)
      }
    }

  }

  /**
   * check players collision when detected
   * 
   */
  processCollission(a, b) {
    return a.alive && b.alive && a.name !== b.name
  }




  /**
   * add intervale for ping emitter
   * 
   */
  addPingEmitter() {
    this.pingInterval = setInterval(
      () => {
        this.pingDate = Date.now()
        this.emitPing.call(this)
      },
      PING_INTERVAL_TIME
    );
  }

  /**
   * Add event listeners for socket.io/hero events
   * 
   */
   listenToEvents() {
    // socket events
    this.socket.on(EVENTS.SOCKET.ROOM.DISCONNECT, this.onDisconnect.bind(this))
    this.socket.on(EVENTS.SOCKET.ROOM.ERROR, this.onError.bind(this))
    this.socket.on(EVENTS.SOCKET.PONG, this.onPong.bind(this))
    this.socket.on(EVENTS.SOCKET.PLAYER.CHANGE_ADMIN, this.onChangeAdmin.bind(this))
    this.socket.on(EVENTS.SOCKET.PLAYER.SWITCH_MODE, this.onSwitchMode.bind(this))
    this.socket.on(EVENTS.SOCKET.PLAYER.ADD, this.onAddPlayer.bind(this))
    this.socket.on(EVENTS.SOCKET.PLAYER.REMOVE, this.onRemovePlayer.bind(this))
    this.socket.on(EVENTS.SOCKET.PLAYER.CHANGE_MODE, this.onChangePlayerMode.bind(this))
    this.socket.on(EVENTS.SOCKET.PLAYER.CHANGE_POISITION, this.onChangePlayerPosition.bind(this))
    this.socket.on(EVENTS.SOCKET.PLAYER.DASH, this.onDashPlayer.bind(this))
    this.socket.on(EVENTS.SOCKET.PLAYER.CHANGE_SCORE, this.onChangePlayerScore.bind(this))
    this.socket.on(EVENTS.SOCKET.PLAYER.KILL, this.onKillPlayer.bind(this))
    this.socket.on(EVENTS.SOCKET.PLAYER.RESPAWN, this.onRespawnPlayer.bind(this))
    // hero events
    this.hero.on(EVENTS.HERO.DASH, this.emitDash.bind(this))
    this.hero.on(EVENTS.HERO.DASH_ENDED, this.emitPosition.bind(this))
  }

  onPong() {
    this.ping = Date.now() - this.pingDate
  }

  onDisconnect() {
    this.scene.start('ConnectScene')
  }

  onError(errorMessage) {
    this.scene.start('ConnectScene', { errorMessage })
  }

  onCountDown(counter) {
    // console.log({ counter })
  }

  onAddPlayer(player) {
    // remove if exists
    this.onRemovePlayer(player.name)
    // add player
    // console.log('ADD', player)
    this.players[player.name] = new DotHero(this, player, false)
    // add to collidable group
    this.collidable.add(this.players[player.name])
  }

  onRemovePlayer(name) {
    // check if player exists
    if (this.players[name]) {
      // destroy player
      this.players[name].destroy()
      // delete player
      delete this.players[name]
    }
  }

  onChangePlayerMode(name, mode) {
    // if player exists
    if (this.players[name]) {
      // update player position
      this.players[name].updateState({ mode })
    }
  }

  onDashPlayer(name, angle) {
    // if player exists
    if (this.players[name]) {
      console.log('onDashPlayer', name, angle)
      // update player position
      this.players[name].updateState({ angle })
      this.players[name].goDash()
    }
  }

  onChangePlayerPosition(name, x, y, angle) {
    // if player exists
    if (this.players[name]) {
      // console.log('POSITION', name, x, y, angle)
      // update player position
      if (this.players[name].body.speed < 1) {
      }
      this.players[name].updateState({ x, y, angle })
    }
  }

  onChangePlayerScore(name, score) {
    // console.log('onChangePlayerScore', name, score)
    // if player exists
    if (this.players[name]) {
      // update player score
      this.players[name].updateState({ score })
    }
  }

  onKillPlayer(name) {
    // if player exists
    if (this.players[name]) {
      // kill player
      this.players[name].updateState({ alive: false });

    }
    // if player is self
    if (this.myName === name) {
      // respawn to random position
      this.hero.updateState({ alive: false })
      this.hero.goRandomPosition()
    }
  }

  onRespawnPlayer(name) {
    // if player exists
    if (this.players[name]) {
      // resurrect player
      this.players[name].updateState({ alive: true });
    }
    // if player is self
    if (this.myName === name) {
      // respawn to random position
      this.hero.updateState({ alive: true })
    }
  }

  onSwitchMode() {
    // set hero to random mode
    this.hero.goRandomMode()
    // emit new mode
    this.emitMode(this.hero.mode)
  }

  onChangeAdmin(name) {
    // if player exists
    if (this.players[name]) {
      // set player to admin
      this.players[name].updateState({ isAdmin: true });
    }
  }


  /**
   * Send ping to socket server
   * 
   */
  emitPing() {
    this.socket.emit(EVENTS.SOCKET.PING)
  }

  /**
   * Send collision between collided players
   * (winner/loser players)
   * 
   */
  emitCollision(winner, loser) {
    this.socket.emit(EVENTS.SOCKET.PLAYER.COLLIDED,
      winner,
      loser
    )
  }

  /**
   * Send player dash
   * 
   */
  emitDash() {
    this.socket.emit(EVENTS.SOCKET.PLAYER.DASHED, this.hero.angle)
  }

  /**
   * Send new mode of the player
   * 
   */
  emitMode() {
    this.socket.emit(
      EVENTS.SOCKET.PLAYER.MODE_CHANGED,
      this.hero.mode
    )
  }

  /**
   * Send new position of the player
   * 
   */
  emitPosition() {
    this.socket.emit(EVENTS.SOCKET.PLAYER.POSITION_CHANGED,
      Math.round(this.hero.x),
      Math.round(this.hero.y),
      Math.round(this.hero.angle)
    )
  }
}