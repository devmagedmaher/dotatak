import DotHero from '../objects/hero/dot';
import DotHeroStatic from '../objects/hero/dot-static';
import addRandomBackgroundGeometries from '../utils/add-random-background-geometries';

export default class InGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InGameScene' });
  }

  emitCollision(winner, loser) {
    this.socket.emit('players-collided', { winner, loser })
  }

  emitPlayerRespawn() {
    this.socket.emit('player-respawn', this.myName)
  }

  onAddPlayer(player) {
    this.onRemovePlayer(player)

    const { name, x, y, score, mode } = player
    this.players[name] = new DotHeroStatic(this, { name, x, y, score, mode })
  }

  onRemovePlayer(player) {
    const { name } = player
    if (this.players[name]) {
      this.players[name].destroy()
      delete this.players[name]
    }
  }

  onChangePlayerPosition(name, data) {
    const player = this.players[name]
    if (player) {
      player.updateState(data)
    }
  }

  onChangePlayerScore(name, score) {
    const player = this.players[name]
    if (player) {
      player.score = score
    }

  }

  onKillPlayer(name) {
    const player = this.players[name]
    if (player) {
      player.alive = false;

      if (this.myName === name) {
        this.hero.goRandomPosition()
      }
    }

  }

  onRespawnPlayer(name) {
    const player = this.players[name]
    if (player) {
      player.alive = true;
    }
  }

  onChangeMode() {
    this.hero.goRandomMode()
  }

  onDisconnect() {
    this.scene.stop('InGameScene')
    this.scene.start('ConnectScene')
  }

  addInitPlayers() {
    for (let player in this.init_players) {
      const { name, x, y, score, mode } = this.init_players[player]
      this.players[player] = new DotHeroStatic(this, { name, x, y, score, mode })
    }

  }

  init(data) {
    this.myName = data.myName;
    this.room = data.room;
    this.init_players = data.init_players
    this.socket = data.socket;

    // setting maps
    this.map = {
      size: 1000,
    }
    this.minimap = {
      offset: 10,
      size: 120,
      zoom: 0.08,
    }

    // props
    this.players = {}
  }

  create() {
    // listen to
    this.socket.on('disconnect', this.onDisconnect.bind(this))
    this.socket.on('add-player', this.onAddPlayer.bind(this))
    this.socket.on('remove-player', this.onRemovePlayer.bind(this))
    this.socket.on('change-player-position', this.onChangePlayerPosition.bind(this))
    this.socket.on('change-player-score', this.onChangePlayerScore.bind(this))
    this.socket.on('kill-player', this.onKillPlayer.bind(this))
    this.socket.on('respawn-player', this.onRespawnPlayer.bind(this))
    this.socket.on('change-mode', this.onChangeMode.bind(this))

    // set world bounds
    this.physics.world.setBounds(0, 0, this.map.size, this.map.size);
    this.add.rectangle(this.map.size / 2, this.map.size / 2, this.map.size, this.map.size, 0x555555)

    // set main camera
    this.mainCamera = this.cameras.main.setBounds(0, 0, this.map.size, this.map.size).setName('main');

    // add random background
    addRandomBackgroundGeometries(this, 0.35)

    // set minimap
    this.minimapCamera = this.cameras.add(
      this.minimap.offset,
      this.minimap.offset,
      this.minimap.size,
      this.minimap.size
    ).setZoom(this.minimap.zoom)
      .setName('mini')
      .setBackgroundColor(0x002244)

    // add ui group
    this.ui = this.add.group()
    this.info_text = this.add.text(0, 0, `${this.room}`, { font: '14px', fill: '#ffffff', align: 'center' })
      .setScrollFactor(0)
      .setPosition(this.minimap.size + this.minimap.offset * 2, 10)
    this.ui.add(this.info_text)

    // add hero to scene
    this.hero = new DotHero(this);

    // initialize players
    this.collidable = this.add.group()
    // this.testSprite = this.physics.add.image(300, 300, 'hero', 0)
    // this.collidable.add(this.testSprite)
    this.addInitPlayers()

    this.minimapCamera.ignore(this.ui)

    this.physics.add.overlap(this.collidable, this.collidable, this.onCollision.bind(this))
  }

  onCollision(pA, pB) {
    const [a, b] = [ this.players[pA.name], this.players[pB.name] ]
    if (a && b && a.mode !== b.mode) {
      // get winner and loser between them
      const RPS_RULES = [[[], [b, a], [a, b]], [[a, b], [], [b, a]], [[b, a], [a, b], []]];
      const [winner, loser] = RPS_RULES[a.mode][b.mode];

      if (winner && loser && loser.alive) {
        loser.alive = false
        this.emitCollision.call(this, winner.name, loser.name)
      }
    }
  }

  update() {
    // update hero
    this.hero.update()

    // send hero location to room
    this.socket.emit('player-position-changed', {
      x: this.hero.x,
      y: this.hero.y,
      angle: this.hero.angle,
      mode: this.hero.mode,
    })

    // update all players
    for (let player in this.players) {
      this.players[player].update()
    }

    // update info
    const myPlayer = this.players[this.myName]
    this.info_text.setText(`${this.room} - ${this.myName}: ${myPlayer?.score||0} (${myPlayer?.alive ? 'alive' : 'dead'}) [${['rock', 'paper', 'scissors'][myPlayer?.mode]}]`)
  }
}