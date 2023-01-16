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
		this.dashPower = 2000;
		this.dashFriction = 0.88;
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
		this.isDashing = false;
		this.score = 0;
		this.mouseLock = false;

		// upate sprite
		this.setCollideWorldBounds(true);
		this.updateSize(this.size)
		this.goRandomMode()
		this.goRandomPosition()

		// set external helpers
		this.scene = scene;
		this.input = scene.input;
		// handle control inputs
		// - keyboard inputs
		this.cursors = this.input.keyboard.createCursorKeys();
		// - mouse inputs
		this.input.on('pointerdown', this.onMouseClick.bind(this));
		document.addEventListener('pointerlockchange', this.releaseMouseControl.bind(this));
		// - touch inputs
		this.input.addPointer(1) // add extra pointer
		this.touch1 = this.input.pointer1
		this.touch2 = this.input.pointer2

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
		if (!this.isDashing) {
			this.isDashing = true;
			this.dash = this.dashPower;
		}
	}

	goRight() {
		this.angularVelocity = this.angularSpeed * -1;
	}
	goLeft() {
		this.angularVelocity = this.angularSpeed;
	}

	update() {
		this.keyboardInputs()
		this.touchInputs()

		this.applyDashFriction()
		this.applyAngularFriction()

		// update alive/dead display
		this.setAlpha(this.player.alive ? 1 : 0.4)

		// update angular velocity		
		this.angle += this.angularVelocity
		// update linear velocity
		this.setVelocityX(Math.cos(Phaser.Math.DegToRad(this.angle)) * (this.linearSpeed + this.dash));
		this.setVelocityY(Math.sin(Phaser.Math.DegToRad(this.angle)) * (this.linearSpeed + this.dash));
	}

	applyDashFriction() {
		if (this.dash > 0) {
			this.dash *= this.dashFriction;
			if (this.dash <= 0.9) {
				this.dash = 0
				this.isDashing = false
			}
		}
	}

	applyAngularFriction() {
		if (Math.abs(this.angularVelocity) > 0) {
			this.angularVelocity *= this.angularFriction;
			if (Math.abs(this.angularVelocity) <= 0.9) {
				this.angularVelocity = 0;
			}
		}
	}

	keyboardInputs() {
		// rotate hero left and right
		if (this.cursors.left.isDown) {
			this.goRight()
		}
		else if (this.cursors.right.isDown) {
			this.goLeft()
		}
		// dash hero forward
		if (this.cursors.up.isDown) {
			this.goDash()
		}
	}

	touchInputs() {
		// mobile control
		if (this.touch2.isDown) {
			this.goDash()
		}
		else if (this.touch1.isDown) {
			// first third
			if (this.touch1.x < this.scene.scale.width / 3) {
				this.goRight()
			}
			// last third
			if (this.touch1.x > this.scene.scale.width / 3 * 2) {
				this.goLeft()
			}
		}
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