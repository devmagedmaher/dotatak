
export default class DotHeroStatic {
  constructor(scene, { name, x = 100, y = 100, mode = 0, score = 0 } = {}) {
    this.scene = scene;
		this.modes = [
			0, // rock
			1, // paper
			2, // scissors
		]
		this.mode = mode
    this.name = name;
    this.score = score;
		this.size = 50;

    // add circle
		this.sprite = this.scene.physics.add.image(x, y, 'hero', this.mode);
		this.sprite.setDisplaySize(this.size, this.size);
		this.sprite.setCircle(this.sprite.width / 2);

    if (this.scene.myName === name) {
      this.sprite.alpha = 0;
    }

    // add name label
    const [fname, lname] = this.name.split('-')
    this.label = this.scene.add.text(this.sprite.x, this.sprite.y, `${fname}\n${lname}`, { font: '12px', fill: '#00ff00', align: 'center' })

    // add player score label
    this.score_text = this.scene.add.text(0, 0, `${this.name}: ${this.score}`, { font: '12px', fill: '#ffffff' })
    this.score_text.setScrollFactor(0);
    this.score_text.setAlign('right');
    this.score_text.setOrigin(1, 0);

    // ignore text in minimap
    this.scene.minimap_camera.ignore(this.score_text)
    this.scene.minimap_camera.ignore(this.label)
  }

  update() {
    // label follow circle
    this.label.x = this.sprite.x - (this.label.width / 2)
    this.label.y = this.sprite.y - this.sprite.height - this.label.height
  }

  updateState(data) {
    const { x, y, angle, mode } = data
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.angle = angle;
    if (mode && this.mode !== mode) {
      this.mode = mode,
      this.sprite.setTexture('hero', this.mode)
    }
  }

  updateScoreTextPosition() {
    this.score_text.setPosition(this.scene.main_camera.width - 10, this.getScoreTextPosition())
  }
  
  updateScoreText() {
    this.score_text.setText(`${this.name}: ${this.score}`);
  }

  getOrder() {
    return Object.values(this.scene.players).sort((a, b) => b.score - a.score).findIndex(p => p.name === this.name)
  }

  getScoreTextPosition() {
    const order = this.getOrder()
    return 10 + (order * 15)
  }

  destroy() {
    this.sprite.destroy()
    this.label.destroy()
    this.score_text.destroy()
  }
}