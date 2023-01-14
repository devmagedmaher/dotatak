
export default class DotHero {
	constructor(scene) {
		this.scene = scene;
		// hero props
		this.modes = [
			0, // rock
			1, // paper
			2, // scissors
		]
		this.mode = this.modes[Math.floor(Math.random() * this.modes.length)]
    this.alive = true
		this.size = 50;
		this.angularSpeed = 3.14;
		this.linearSpeed = 250;
		this.dashPower = 900;
		this.dash = 0;
		this.isDashing = false;
		// score
		this.score = 0;

		// draw circle
		this.sprite = this.scene.physics.add.image(
			Phaser.Math.Between(0, this.scene.map.size),
			Phaser.Math.Between(0, this.scene.map.size),
			'hero',
			this.mode
		);
		this.sprite.setDisplaySize(this.size, this.size);
		this.sprite.setCircle(this.sprite.width / 2);
		this.sprite.setAngle(Phaser.Math.Between(0, 360))
		this.sprite.setBounce(1, 1);
		this.sprite.setCollideWorldBounds(true);
		this.cursors = this.scene.input.keyboard.createCursorKeys();

		// follow circle
		this.scene.main_camera.startFollow(this.sprite, false, 0.5, 0.5);
		this.scene.minimap_camera.startFollow(this.sprite, false, 0.2, 0.2);
	}

	relocate() {
		this.sprite.x = Phaser.Math.Between(0, this.scene.map.size);
		this.sprite.y = Phaser.Math.Between(0, this.scene.map.size)		
		this.sprite.setAngle(Phaser.Math.Between(0, 360))
	}
	
	switchMode() {
		this.mode = this.modes[Math.floor(Math.random() * this.modes.length)]
		this.refreshTexture()
	}

	refreshTexture() {
    this.sprite.setTexture('hero', this.mode)
  }

	update() {
		// rotate hero left and right
		if (this.cursors.left.isDown) {
			this.sprite.angle -= this.angularSpeed;
		}
		if (this.cursors.right.isDown) {
			this.sprite.angle += this.angularSpeed;
		}

		// dash hero forward
		if (this.cursors.up.isDown) {
			if (!this.isDashing) {
				this.isDashing = true;
				this.dash = this.dashPower;
			}
		}

		// decrease dash speed
		if (this.dash > 0) {
			this.dash -= this.dashPower / 20;
		}

		// reset dash flag
		if (this.cursors.up.isUp && this.dash <= 0) {
			this.isDashing = false
		}

		// update linear/angular velocity
		this.sprite.setVelocityX(Math.cos(Phaser.Math.DegToRad(this.sprite.angle)) * (this.linearSpeed + this.dash));
		this.sprite.setVelocityY(Math.sin(Phaser.Math.DegToRad(this.sprite.angle)) * (this.linearSpeed + this.dash));
	}
}