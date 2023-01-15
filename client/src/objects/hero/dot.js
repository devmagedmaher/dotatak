import { HERO } from "../../config";

export default class DotHero extends Phaser.Physics.Arcade.Image {
	constructor(scene) {
		super(scene, 0, 0, HERO, 0)
		scene.add.existing(this)
		scene.physics.add.existing(this)

		// static props
		this.size = 50;
		this.angularSpeed = 7;
		this.angularFriction = 0.77;
		this.linearSpeed = 250;
		this.dashPower = 900;
		this.modes = [
			0, // rock
			1, // paper
			2, // scissors
		]

		// state
		this.mode = 0
    this.alive = true
		this.angularVelocity = 0;
		this.dash = 0;
		this.dashing = false;
		this.score = 0;
		this.mouseLock = false;

		// upate sprite
		this.setCollideWorldBounds(true);
		this.updateSize(this.size)
		this.goRandomMode()
		this.goRandomPosition()

		// set external helpers
		this.scene = scene;
		// handle control inputs
		// - keyboard inputs
		this.cursors = scene.input.keyboard.createCursorKeys();
		// - mouse inputs
		this.input = scene.input;
		// - lock pointer on click
		this.input.on('pointerdown', this.onMouseClick.bind(this));
		document.addEventListener('pointerlockchange', this.releaseMouseControl.bind(this));

		// follow sprite
		scene.mainCamera.startFollow(this, false, 0.5, 0.5);
		scene.minimapCamera.startFollow(this, false, 0.2, 0.2);
	}

	updateSize(size) {
		this.setDisplaySize(size, size);
		this.setCircle(this.width / 2);
	}

	goRandomMode() {
		this.mode = this.modes[Math.floor(Math.random() * this.modes.length)]
		this.setFrame(this.mode)
	}

	goRandomPosition() {
		this.setAngle(Phaser.Math.Between(0, 360))
		this.setRandomPosition(0, 0, this.scene.map.size, this.scene.map.size)
	}

	goDash() {
		if (!this.dashing) {
			this.dashing = true;
			this.dash = this.dashPower;
		}
	}

	update() {
		// rotate hero left and right
		// - with arrows
		if (this.cursors.left.isDown) {
			this.angularVelocity = this.angularSpeed * -1;
		}
		else if (this.cursors.right.isDown) {
			this.angularVelocity = this.angularSpeed;
		}

		// add friction to angular velocity
		this.angularVelocity *= this.angularFriction;

		// dash hero forward
		if (this.cursors.up.isDown) {
			this.goDash()
		}

		// reset dash flag on dash complete
		if (this.cursors.up.isUp && this.dash <= 0) {
			this.dashing = false
		}

		// add friction to dash velocity
		if (this.dash > 0) {
			this.dash -= this.dashPower / 20;
		}

		// update angular velocity		
		this.angle += this.angularVelocity
		// update linear velocity
		this.setVelocityX(Math.cos(Phaser.Math.DegToRad(this.angle)) * (this.linearSpeed + this.dash));
		this.setVelocityY(Math.sin(Phaser.Math.DegToRad(this.angle)) * (this.linearSpeed + this.dash));
	}

	onMouseClick() {
		if (!this.mouseLock) {
			this.input.mouse.requestPointerLock();
			return
		}
		
		this.goDash()
	}

	onMouseMove({ movementX }) {
		if (this.mouseLock) {
			if (movementX > 0) {
				this.angularVelocity = this.angularSpeed
			}
			else if (movementX < 0) {
				this.angularVelocity = this.angularSpeed * -1
			}
		}
	}

	lockMouse() {
		this.mouseLock = true
		this.input.on('pointermove', this.onMouseMove.bind(this))
	}

	releaseMouseLock() {
		this.input.off('pointermove', this.onMouseMove.bind(this))
		this.mouseLock = false
	}

	releaseMouseControl() {
		if (document.pointerLockElement === null) {
			this.releaseMouseLock()
		}
		else {
			this.lockMouse()
		}
	}
}