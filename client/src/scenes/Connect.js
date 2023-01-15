import io from 'socket.io-client';
import heroPNG from '../assets/images/hero.png';
import { SOCKET_IO } from '../config';
import getRoomNameFromURL from '../utils/get-room-name-from-url';

export default class Connect extends Phaser.Scene {
  constructor() {
    super({ key: 'ConnectScene' });
  }

  enterRoom(players) {
    // go to InGame scene
    this.scene.start('InGameScene', {
      myName: this.myName,
      room: this.room,
      init_players: this.players,
      socket: this.socket,
    })
  }

  onError(message) {
    console.error(message)
    this.title.setText(message || 'Something went wrong!')
  }

  async connectIO() {
    return new Promise((resolve, reject) => {
      try {
        if (!this.room) {
          reject(new Error('No room was specified!'))
          return
        }
        this.socket = io(SOCKET_IO.ROOM_WORKSPACE, { query: { name: this.myName, room: this.room } })  

        // on init = no erros
        this.socket.on('init', players => {
          this.players = players
          resolve()
        })

        // on error
        this.socket.on('error', message => {
          reject(new Error(message))
        })
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
    this.load.spritesheet('hero', heroPNG, { frameWidth: 100, frameHeight: 100 });
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
      this.enterRoom()
    })
    .catch(e => {
      this.title.setText(e?.toString() || 'Something went wrong!')
    })
  }
}