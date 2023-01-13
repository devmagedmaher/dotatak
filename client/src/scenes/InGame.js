import io from 'socket.io-client';
import heroPNG from '../assets/images/hero.png';
import DotHero, { DotHeroStatic } from '../objects/hero/dot';
import addRandomBackgroundGeometries from '../utils/add-random-background-geometries';

export default class InGameScene extends Phaser.Scene {
  constructor() {
    super();
  }

  onInit(players) {
    for (let player in players) {
      const { name, x, y } = players[player]
      this.players[player] = new DotHeroStatic(this, { name, x, y })

      if (name === this.myname) {
        this.players[player].circle.alpha = 0;
      }
    }
  }

  onAddPlayer(player) {
    const { name, x, y } = player
    if (this.players[name]) {
      this.players[name].destroy()
    }
    this.players[name] = new DotHeroStatic(this, { name, x, y })

    if (name === this.myname) {
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

  async preload() {
    // preload scene assets
    this.load.image('hero', heroPNG);

    // setting maps
    this.map = {
      size: 1000,
    }
    this.minimap = {
      size: 120,
      zoom: 0.08,
    }

    this.players = {}
    this.myname = localStorage.getItem('_name')

    await new Promise((resolve, reject) => {
      try {
        this.socket = io('http://localhost:8081', { query: { name: this.myname, room: 'main' } })  
        this.socket.on("connect", resolve);

        // listen to server events
        this.socket.on('init', this.onInit.bind(this))
        this.socket.on('add-player', this.onAddPlayer.bind(this))
        this.socket.on('remove-player', this.onRemovePlayer.bind(this))
        this.socket.on('change-player-position', this.onChangePlayerPosition.bind(this))
      }
      catch(e) {
        reject(e)
      }
    })
  }

  create() {
    // set world bounds
    this.physics.world.setBounds(0, 0, this.map.size, this.map.size);
    this.add.rectangle(this.map.size / 2, this.map.size / 2, this.map.size, this.map.size, 0x111111)

    // set main camera
    this.cameras.main.setBounds(0, 0, this.map.size, this.map.size).setName('main');

    // add random background
    addRandomBackgroundGeometries(this, 0.35)

    // set minimap
    this.minimap = this.cameras.add(
      10,
      10,
      this.minimap.size,
      this.minimap.size
    )
      .setZoom(this.minimap.zoom)
      .setName('mini')
      .setBackgroundColor(0x002244);
    this.minimap.scrollX = 500;
    this.minimap.scrollY = 500;
    this.minimap.alpha = 0.7;

    // add hero to scene
    this.hero = new DotHero(this, {
      x: Phaser.Math.Between(0, this.map.size),
      y: Phaser.Math.Between(0, this.map.size),
      angle: Phaser.Math.DegToRad(Phaser.Math.Between(0, 360)),
    });
    this.cameras.main.startFollow(this.hero.circle, false, 1, 1);
    this.minimap.startFollow(this.hero.circle, false, 0.2, 0.2);
  }

  update() {
    // update hero frame
    this.hero.update()

    for (let player in this.players) {
      this.players[player].update()
    }

    this.socket.emit('player-position-changed', this.hero.circle.x, this.hero.circle.y)
  }
}