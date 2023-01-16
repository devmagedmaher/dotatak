import { HERO } from "../../config";

export default class DotHeroStatic extends Phaser.Physics.Arcade.Image {
  constructor(scene, { name, x = 0, y = 0, mode = 0, score = 0, alive = false, isAdmin = false } = {}) {
    super(scene, x, y, HERO, mode)
		scene.add.existing(this)
		scene.physics.add.existing(this)

    // static props
    this.name = name;
    const [fname, lname] = this.name.split('-')
    this.name_label = `${fname}\n${lname}`
		this.size = 50;
		this.modes = [
			0, // rock
			1, // paper
			2, // scissors
		]

    // state
    this.isAdmin = isAdmin;
		this.mode = mode;
    this.alive = alive;
    this.score = score;

    // update sprite
    this.updateSize(this.size)

    // hide self player for self
    if (scene.myName === name) {
      this.visible = false;
    }

    // add labels
    this.addNameText()
    this.addScoreText()
    scene.ui.add(this.name_text)
    scene.ui.add(this.score_text)
    // ignore labels in minimap
    scene.minimapCamera.ignore(scene.ui)

    // set scene
    this.scene = scene
  }

  updateSize(size) {
    this.setDisplaySize(size, size);
		this.setCircle(this.width / 2);
  }

  addNameText() {
    this.name_text = this.scene.add.text(this.x, this.y, `${this.name_label}`, {
      font: '12px',
      fill: '#00ff00',
      align: 'center'
    })
  }

  updateNameText() {
    this.name_text.setPosition(
      this.x - (this.name_text.width / 2),
      this.y - this.height - this.name_text.height
    )
    .setText(this.alive
      ? `${this.name_label}`
      : `${this.name_label}\n(dead)`
    )
  }

  addScoreText() {
    this.score_text = this.scene.add.text(0, 0, `${this.name}: ${this.score}`, {
      font: '12px',
      fill: '#ffffff',
      align: 'right',
    })
    this.score_text.setOrigin(1, 0);
    this.score_text.setScrollFactor(0);
    this.scene.ui.add(this.score_text)
  }

  updateScoreText() {
    this.score_text.setPosition(
      this.scene.mainCamera.width - 10,
      this._getScoreTextPositionY()
    )
    .setText(`${this.isAdmin ? '($) ' : ''}${this.name}: ${this.score}`)
  }

  update() {
    // update alpha
    this.setAlpha(this.alive ? 1 : 0.4)

    // score text follow sprite
    this.updateNameText()

    // update score list order
    this.updateScoreText()
  }

  updateState(data) {
    const { x, y, angle, mode, alive } = data
    this.x = x !== undefined ? x : this.x;
    this.y = y !== undefined ? y : this.y;
    this.angle = angle !== undefined ? angle : this.angle;
    this.mode = mode !== undefined ? mode : this.mode;
    this.alive = alive !== undefined ? alive : this.alive;
    this.refreshTexture()
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
    this.name_text?.destroy()
    this.score_text?.destroy()
    super.destroy()
  }
}