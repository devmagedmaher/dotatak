import io from 'socket.io-client';
import heroPNG from '../assets/images/hero.png';
import getRoomNameFromURL from '../utils/get-room-name-from-url';

export default class Connect extends Phaser.Scene {
  constructor() {
    super({ key: 'ConnectScene' });
  }

  onInit(players) {
    // go to InGame scene
    this.scene.start('InGameScene', {
      myName: this.myName,
      room: this.room,
      init_players: players,
      socket: this.socket,
    })
  }

  async connectIO() {
    return new Promise((resolve, reject) => {
      try {
        if (!this.room) {
          reject(new Error('No room was specified!'))
          return
        }
        this.socket = io('http://localhost:8081/room', { query: { name: this.myName, room: this.room } })  
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
    // get room if exists
    this.room = getRoomNameFromURL()
  }

  async preload() {
    // preload game assets
    this.load.image('hero', heroPNG);
  }

  create() {
    // add connecting title text
    this.title = this.add.text(0, 0, 'Connecting..', { font: '50px', fill: '#ffffff', align: 'center', wordWrap: { width: this.cameras.main.width - 50 } })
    // centerize title
    this.title.setOrigin(0.5, 0.5)
    this.title.setPosition(
      this.cameras.main.midPoint.x,
      this.cameras.main.midPoint.y,
    )

    this.connectIO()
    .then(() => {
      this.title.setText('Loading..')
    })
    .catch(e => {
      this.title.setText(e?.toString() || 'Something went wrong!')
    })
  }
}