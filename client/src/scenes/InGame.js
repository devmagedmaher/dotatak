import io from 'socket.io-client';
import heroPNG from '../assets/images/hero.png';
import DotHero, { DotHeroStatic } from '../objects/hero/dot';
import addRandomBackgroundGeometries from '../utils/add-random-background-geometries';

export default class InGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InGameScene' });
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
  }

  onRemovePlayer(player) {
    const { name } = player
    if (this.players[name]) {
      this.players[name].destroy()
    }
    delete this.players[name]
  }

  onChangePlayerPosition(name, x, y) {
    const player = this.players[name]
    if (player) {
      player.circle.x = x;
      player.circle.y = y;
    }
  }

  createPlayers() {
    console.log('INIT PLAYERS', this.init_players)
    for (let player in this.init_players) {
      const { name, x, y } = this.init_players[player]
      this.players[player] = new DotHeroStatic(this, { name, x, y })
    }
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

    // set world bounds
    this.physics.world.setBounds(0, 0, this.map.size, this.map.size);
    this.add.rectangle(this.map.size / 2, this.map.size / 2, this.map.size, this.map.size, 0x111111)

    // set main camera
    this.camera = this.cameras.main.setBounds(0, 0, this.map.size, this.map.size).setName('main');

    // add random background
    addRandomBackgroundGeometries(this, 0.35)

    // add ui group
    this.ui = this.add.group()

    // set minimap
    this.minimap = this.cameras.add(
      10,
      10,
      this.minimap.size,
      this.minimap.size
    ).setZoom(this.minimap.zoom)
    .setName('mini')
    .setBackgroundColor(0x002244)
    this.minimap.ignore(this.ui)
    this.minimap.scrollX = 500;
    this.minimap.scrollY = 500;
    this.minimap.alpha = 0.7;

    // add hero to scene
    this.hero = new DotHero(this);
    
    // initialize players
    this.createPlayers()
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