import Text from "."

export default class InfoText extends Text {
  constructor(scene, x, y, text, options = {}) {
    super(scene, x, y, text, options)

    this.setScrollFactor(0)
  }

  update() {
    if (this.scene.hero) {
      const hero = this.scene.hero
      // const player = hero.player
      this.setText(
        `${this.scene.room}`
        + `- ${hero.isAdmin ? '($) ' : ''}`
        + `${this.scene.myName}: `
        + `${hero.score||0} `
        + `(${hero.alive ? 'alive' : 'dead'}) `
        + `[${['rock', 'paper', 'scissors'][hero.mode]}] `
        + `\n\n`
        + `ping: ${this.scene.ping || 0}ms`
        + `\n\n`
        + `DEBUG: ${hero.body.speed}`
      )
    }
  }
}