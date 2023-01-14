import io from 'socket.io-client';
import heroPNG from '../assets/images/hero.png';
import DotHero from '../objects/hero/dot';
import DotHeroStatic from '../objects/hero/dot-static';
import addRandomBackgroundGeometries from '../utils/add-random-background-geometries';

export default class InGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InGameScene' });
  }

  updateScoreTextPositions() {
    for (let p in this.players) {
      this.players[p].updateScoreTextPosition()
    }
  }

  emitIncreaseScore(amount) {
    this.socket.emit('player-score-increased', this.myName, amount)
  }

  onAddPlayer(player) {
    const { name, x, y } = player
    if (this.players[name]) {
      this.players[name].destroy()
    }
    this.players[name] = new DotHeroStatic(this, { name, x, y })

    if (name === this.myName) {
      this.players[name].circle.alpha = 0;
    }

    this.updateScoreTextPositions()
  }

  onRemovePlayer(player) {
    const { name } = player
    if (this.players[name]) {
      this.players[name].destroy()
    }
    delete this.players[name]

    this.updateScoreTextPositions()
  }

  onChangePlayerPosition(name, x, y) {
    const player = this.players[name]
    if (player) {
      player.circle.x = x;
      player.circle.y = y;
    }
  }

  onChangePlayerScore(name, score) {
    const player = this.players[name]
    if (player) {
      player.score = score
      player.updateScoreText()
    }

    this.updateScoreTextPositions()
  }

  addInitPlayers() {
    for (let player in this.init_players) {
      const { name, x, y, score } = this.init_players[player]
      this.players[player] = new DotHeroStatic(this, { name, x, y, score })
    }

    this.updateScoreTextPositions()
  }

  init(data) {
    this.socket = data.socket;
    this.myName = data.myName;
    this.init_players = data.init_players

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
    this.socket.on('add-player', this.onAddPlayer.bind(this))
    this.socket.on('remove-player', this.onRemovePlayer.bind(this))
    this.socket.on('change-player-position', this.onChangePlayerPosition.bind(this))
    this.socket.on('change-player-score', this.onChangePlayerScore.bind(this))

    // set world bounds
    this.physics.world.setBounds(0, 0, this.map.size, this.map.size);
    this.add.rectangle(this.map.size / 2, this.map.size / 2, this.map.size, this.map.size, 0x111111)

    // set main camera
    this.main_camera = this.cameras.main.setBounds(0, 0, this.map.size, this.map.size).setName('main');

    // add random background
    addRandomBackgroundGeometries(this, 0.35)

    // add ui group
    this.ui = this.add.group()

    // set minimap
    this.minimap_camera = this.cameras.add(
      this.minimap.offset,
      this.minimap.offset,
      this.minimap.size,
      this.minimap.size
    ).setZoom(this.minimap.zoom)
    .setName('mini')
    .setBackgroundColor(0x002244)

    // add hero to scene
    this.hero = new DotHero(this);
    
    // initialize players
    this.addInitPlayers()
  }

  update() {
    // update hero frame
    this.hero.update()

    // update hero mimics
    for (let player in this.players) {
      this.players[player].update()
    }

    this.socket.emit('player-position-changed', this.hero.circle.x, this.hero.circle.y)
  }
}