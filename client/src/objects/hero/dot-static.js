import { TEXTURES } from "../../config";
import DotHero from "./dot";

export default class DotHeroStatic extends DotHero {
  constructor(scene, { name, x = 0, y = 0, mode = 0, score = 0, alive = false, isAdmin = false } = {}) {
    super(scene, { x, y, mode }, false)
    console.log('constructor', name, {mode})
    this.components = scene.add.group()

    // static props
    this.name = name;
    const [fname, lname] = this.name.split('-')
    this.name_label = `${fname}\n${lname}`

    // state
    this.isAdmin = isAdmin;
		this.mode = mode;
    this.alive = alive;
    this.score = score;

    // hide self player for self
    if (scene.myName === name) {
      this.visible = false;
    }

    // add labels
    this.addNameText()
    this.addScoreText()
    scene.ui.addMultiple([this.nameText, this.scoreText])
    // ignore labels in minimap
    scene.minimapCamera.ignore(scene.ui)

    // add components to single group
    this.components.addMultiple([this.nameText, this.scoreText])

    // set scene
    this.scene = scene
  }

  addNameText() {
    this.nameText = this.scene.add.text(this.x, this.y, `${this.name_label}`, {
      font: '12px',
      fill: '#00ff00',
      align: 'center'
    })
  }

  updateNameText() {
    this.nameText.setPosition(
      this.x - (this.nameText.width / 2),
      this.y - this.height - this.nameText.height
    )
    .setText(this.alive
      ? `${this.name_label}`
      : `${this.name_label}\n(dead)`
    )
  }

  addScoreText() {
    this.scoreText = this.scene.add.text(0, 0, `${this.name}: ${this.score}`, {
      font: '12px',
      fill: '#ffffff',
      align: 'right',
    })
    this.scoreText.setOrigin(1, 0);
    this.scoreText.setScrollFactor(0);
    this.scene.ui.add(this.scoreText)
  }

  updateScoreText() {
    this.scoreText.setPosition(
      this.scene.mainCamera.width - 10,
      this._getScoreTextPositionY()
    )
    .setText(`${this.isAdmin ? '($) ' : ''}${this.name}: ${this.score}`)
  }

  update() {
    super.update()

    // score text follow sprite
    this.updateNameText()

    // update score list order
    this.updateScoreText()
  }

  updateState(data) {
    for (let key in data) {
      if (data[key] !== undefined) {
        this[key] = data[key]

        if (key === 'mode') {
          console.log(this.name, data)
          this.refreshTexture()
        }
      }
    }
  }

  refreshTexture() {
    this.setFrame(this.mode)
  }

  _getOrder() {
    return Object.values(this.scene.players).sort((a, b) => b.score - a.score).findIndex(p => p.name === this.name)
  }

  _getScoreTextPositionY() {
    const order = this._getOrder()
    return 50 + (order * 15)
  }

  destroy() {
    this.components.destroy(true)
    super.destroy()
  }
}