import Text from "."

export default class InfoText extends Text {
  constructor(scene, x, y, text, options = {}) {
    super(scene, x, y, text, options)

    this.setScrollFactor(0)
  }

  update() {
    if (this.scene.hero?.player) {
      const hero = this.scene.hero
      const player = hero.player
      this.setText(
        `${this.scene.room}`
        + `- ${player.isAdmin ? '($) ' : ''}`
        + `${player.name}: `
        + `${player?.score||0} `
        + `(${player.alive ? 'alive' : 'dead'}) `
        + `[${['rock', 'paper', 'scissors'][player.mode]}] `
        + `\n\n`
        + `ping: ${this.scene.ping || 0}ms`
        + `\n\n`
        + `dash charge: ${100 - Math.ceil(hero.dash / (hero.dashPower - hero.linearSpeed) * 100)}%`
      )
    }
  }
}