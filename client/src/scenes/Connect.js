import io from 'socket.io-client';
import heroPNG from '../assets/images/hero.png';

export default class Connect extends Phaser.Scene {
  constructor() {
    super({ key: 'ConnectScene' });
  }

  onInit(players) {
    // go to InGame scene
    this.scene.start('InGameScene', {
      init_players: players,
      myName: this.myName,
      socket: this.socket,
    })
  }

  async connectIO() {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io('http://localhost:8081', { query: { name: this.myName, room: 'main' } })  
        // listen to server events
        this.socket.on("connect", resolve);
        this.socket.on('init', this.onInit.bind(this))
      }
      catch(e) {
        reject(e)
      }
    })
  }

  init() {
    // get player name
    this.myName = localStorage.getItem('_name')
  }

  async preload() {
    // preload game assets
    this.load.image('hero', heroPNG);
  }

  create() {
    // add connecting title text
    this.title = this.add.text(0, 0, 'Connecting..', { font: '50px', fill: '#ffffff' })
    // centerize title
    this.title.setOrigin(0.5, 0.5)
    this.title.setPosition(
      this.cameras.main.midPoint.x,
      this.cameras.main.midPoint.y,
    )

    this.connectIO().then(() => {
      this.title.setText('Loading..')
    })
  }
}