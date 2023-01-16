import { BOX } from "../../config"

export default class Button extends Phaser.GameObjects.Image {
  constructor(scene, x = 0, y = 0, text = '...', {
    padding = 5,
    origin: {
      x: originX = 0,
      y: originY = 0,
    },
    scrollFactor = 0,
  } = {}) {
    super(scene, x, y, BOX)
    scene.add.existing(this)
    this.group = scene.add.group()

    this.setOrigin(originX, originY)
    this.setScrollFactor(scrollFactor)
    this.setInteractive()
    this.group.add(this)

    this.text = scene.add.text(
      x + padding * (originX > 0.5 ? -1 : 1),
      y + padding * (originY > 0.5 ? -1 : 1),
      text,
      { font: '13px', fill: '#000000' }
    )
    this.text.setOrigin(originX, originY)
    this.text.setScrollFactor(scrollFactor)
    this.group.add(this.text)

    this.setDisplaySize(this.text.width + padding * 2, this.text.height + padding * 2)

    this.on('pointerup', this.onClick, this)

    scene.ui.add(this.group)
    this.scene = scene
  }

  onClick() {
    console.log(text, 'CLICKED')
  }
}