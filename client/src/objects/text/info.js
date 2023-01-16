import Text from "."

export default class InfoText extends Text {
  constructor(scene, x, y, text, options = {}) {
    super(scene, x, y, text, options)

    this.setScrollFactor(0)
  }

  update() {
    if (this.scene.hero?.player) {
      const player = this.scene.hero.player
      this.setText(
        `${this.scene.room}`
        + `- ${player.isAdmin ? '($) ' : ''}`
        + `${player.name}: `
        + `${player?.score||0} `
        + `(${player.alive ? 'alive' : 'dead'}) `
        + `[${['rock', 'paper', 'scissors'][player.mode]}]`
      )
    }
  }
}