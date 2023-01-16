
export default class Text extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text, { font = '14px', fill = '#ffffff', ...options } = {}) {
    super(scene, x, y, text, { font, fill, options })
    scene.add.existing(this)

    this.scene = scene
  }
}