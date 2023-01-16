import Button from "."

export default class StartButton extends Button {
  constructor(scene, x = 0, y = 0, text = 'Start Game (S)', paddig = 5) {
    super(scene, x, y, text, paddig)
  }

  onClick() {
    this.scene.emitStart()
  }
}