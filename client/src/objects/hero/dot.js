
export default class DotHero {
  constructor(scene) {
      this.scene = scene;
      this.circle = this.scene.physics.add.image(100, 100, 'hero');
      this.circle.setCircle(25);
      this.circle.setBounce(0.2);
      this.circle.setCollideWorldBounds(true);
      this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  update() {
      if (this.cursors.left.isDown) {
          this.circle.setVelocityX(-160);
      }
      else if (this.cursors.right.isDown) {
          this.circle.setVelocityX(160);
      }
      else {
          this.circle.setVelocityX(0);
      }

      if (this.cursors.up.isDown) {
          this.circle.setVelocityY(-160);
      }
      else if (this.cursors.down.isDown) {
          this.circle.setVelocityY(160);
      }
      else {
          this.circle.setVelocityY(0);
      }
  }
}