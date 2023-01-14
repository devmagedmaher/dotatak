
export default class DotHero {
	constructor(scene) {
		this.scene = scene;
		// hero props
		this.angular_speed = 0.1;
		this.linear_speed = 250;
		this.dash_power = 900;
		this.dash = 0;
		this.is_dashing = false;
		// score
		this.score = 0;

		// draw circle
		this.circle = this.scene.physics.add.image(
			Phaser.Math.Between(0, this.scene.map.size),
			Phaser.Math.Between(0, this.scene.map.size),
			'hero'
		);
		this.circle.angle = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
		this.circle.setCircle(25);
		this.circle.setBounce(0.2);
		this.circle.setCollideWorldBounds(true);
		this.cursors = this.scene.input.keyboard.createCursorKeys();

		// follow circle
		this.scene.main_camera.startFollow(this.circle, false, 0.5, 0.5);
		this.scene.minimap_camera.startFollow(this.circle, false, 0.2, 0.2);

		// constant speed
		this.circle.setVelocity(this.linear_speed, this.linear_speed);
	}

	update() {
		// rotate hero left and right
		if (this.cursors.left.isDown) {
			this.circle.angle -= this.angular_speed;
		}
		if (this.cursors.right.isDown) {
			this.circle.angle += this.angular_speed;
		}

		// dash hero forward
		if (this.cursors.up.isDown) {
			if (!this.is_dashing) {
				this.is_dashing = true;
				this.dash = this.dash_power;
				this.scene.emitIncreaseScore(1)
			}
		}

		// decrease dash speed
		if (this.dash > 0) {
			this.dash -= this.dash_power / 20;
		}

		// reset dash flag
		if (this.cursors.up.isUp && this.dash <= 0) {
			this.is_dashing = false
		}

		// update linear/angular velocity
		this.circle.setVelocityX(Math.cos(this.circle.angle) * (this.linear_speed + this.dash));
		this.circle.setVelocityY(Math.sin(this.circle.angle) * (this.linear_speed + this.dash));
	}
}