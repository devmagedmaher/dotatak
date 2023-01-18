import io from 'socket.io-client';
import { EVENTS } from '../../../config';
import boxPNG from '../assets/images/box.png';
import { SOCKET_WORKSPACES } from '../config';
// import { SERVER_URL } from '../config';
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
        this.socket = io(SOCKET_WORKSPACES.ROOM, { query: { name: this.myName, room: this.room } })  

        // on init = no erros
        this.socket.on(EVENTS.SOCKET.ROOM.INIT, players => {
          this.players = players
          resolve()
        })

        // on error
        this.socket.on(EVENTS.SOCKET.ROOM.ERROR, message => {
          reject(new Error(message))
        })
      }
      catch(e) {
        reject(e)
      }
    })
  }

  init(data) {
    // get player name
    this.myName = localStorage.getItem('_name')
    // get room if exists
    this.room = getRoomNameFromURL()
    // get error message
    this.errorMessage = data.errorMessage
  }

  preload() {
    // preload game assets
    this.load.image('box', boxPNG);
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

    if (this.errorMessage) {
      this.title.setText(this.errorMessage)
      return
    }

    this.connectIO()
    .then(() => {
      this.enterRoom()
    })
    .catch(e => {
      this.title.setText(e?.toString() || 'Something went wrong!')
    })
  }
}