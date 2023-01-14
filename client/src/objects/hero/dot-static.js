
export default class DotHeroStatic {
  constructor(scene, { name, x = 100, y = 100, score = 0 } = {}) {
    this.scene = scene;
    this.name = name;
    this.score = score;

    // add circle
    this.circle = this.scene.physics.add.image(x, y, 'hero');
    this.circle.setCircle(25);

    if (this.scene.myName === name) {
      this.circle.alpha = 0;
    }

    // add name label
    const [fname, lname] = this.name.split('-')
    this.label = this.scene.add.text(this.circle.x, this.circle.y, `${fname}\n${lname}`, { font: '12px', fill: '#00ff00', align: 'center' })

    // add player score label
    this.score_text = this.scene.add.text(0, 0, `${this.name}: ${this.score}`, { font: '12px', fill: '#ffffff' })
    this.score_text.setScrollFactor(0);
    this.score_text.setAlign('right');
    this.score_text.setOrigin(1, 0);
    // ignore text in minimap
    this.scene.minimap_camera.ignore(this.score_text)
  }

  update() {
    // label follow circle
    this.label.x = this.circle.x - (this.label.width / 2)
    this.label.y = this.circle.y - this.circle.height - this.label.height
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
    this.circle.destroy()
    this.label.destroy()
    this.score_text.destroy()
  }
}