import Button from "."

export default class FullscreenButton extends Button {
  constructor(scene, x = 0, y = 0, text = 'Fullscreen (F)', options) {
    super(scene, x, y, text, options)

    this.keyF = scene.input.keyboard.addKey('F')
    this.keyF.on('up', this.onClick, this)
  }

  onClick() {
    this.openFullscreen()
  }

  update() {
    this.group.setVisible(!this.scene.scale.isFullscreen)
  }


  openFullscreen() {
    if (!this.scene.scale.isFullscreen) {
      this.scene.scale.startFullscreen();
      if (window.screen) {
        window.screen.orientation.lock('landscape').catch(e => console.error(e));
      }
    }
  }
}