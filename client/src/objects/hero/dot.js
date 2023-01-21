import { TEXTURES } from "../../config";

export default class DotHero extends Phaser.Physics.Arcade.Image {
	constructor(scene) {
		super(scene, 0, 0, TEXTURES.HERO, 0)
		scene.add.existing(this)
		scene.physics.add.existing(this)

		// static props
		this.size = 50;
		this.angularSpeed = 4;
		this.angularFriction = 0.77;
		this.linearSpeed = 0;
		this.dashPower = 2000;
		this.dashCharge = 200;
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
		this.isDashing = 0;
		this.score = 0;
		this.mouseLock = false;

		// set physics
		this.setDamping(true)
		this.setDrag(0.02)
		// upate sprite
		this.setCollideWorldBounds(true);
		this.setBounce(1, 1)
		this.setDisplaySize(this.size, this.size);
		this.setCircle(this.width / 2);
		this.goRandomMode()
		this.goRandomPosition()

		// create bars
		this.createDashBar()		

		// set external helpers
		this.scene = scene;
		this.input = scene.input;
		// handle control inputs
		// - keyboard inputs
		this.cursors = this.input.keyboard.createCursorKeys();
		// - mouse inputs
		this.mouse = this.input.mousePointer
		// - touch inputs
		this.input.addPointer(1) // add extra pointer
		this.touch = this.input.pointer1
		this.touch2 = this.input.pointer2

		// follow sprite
		scene.mainCamera.startFollow(this, false, 0.5, 0.5);
		scene.minimapCamera.startFollow(this, false, 0.2, 0.2);
	}

	update() {
		this.keyboardInputs()
		this.touchInputs()
		this.mouseInputs()

		this.recharge()
		this.applyAngularFriction()

		// update alive/dead display
		this.setAlpha(this.player.alive ? 1 : 0.4)

		// update angular velocity
		this.setAngle(this.angle + this.angularVelocity)
		
		// update bars
		this.updateDashBar()
	}

	createDashBar() {
		this.dashBar = this.scene.add.rectangle(0, 0, 100, 4, 0xbb0000, 0.7)
		this.dashBar.setOrigin(0.5, 0.5)
	}

	updateDashBar() {
		this.dashBar.setPosition(this.x, this.y - this.size - 30)
		this.dashBar.setScale(this.isDashing / this.dashCharge, 1)
	}

	goRandomMode() {
		this.mode = this.modes[Math.floor(Math.random() * this.modes.length)]
		this.setFrame(this.mode)
	}

	goRandomPosition() {
		this.setAngle(Phaser.Math.Angle.RandomDegrees())
		this.setRandomPosition(0, 0, this.scene.map.size, this.scene.map.size)
	}

	goDash() {
		if (this.isDashing === 0) {
			this.isDashing = this.dashCharge;
			this.setVelocity(
				Math.cos(this.rotation) * (this.dashPower),
				Math.sin(this.rotation) * (this.dashPower)
			);
		}
	}

	goRight() {
		this.angularVelocity = this.angularSpeed;
	}
	goLeft() {
		this.angularVelocity = this.angularSpeed * -1;
	}

	recharge() {
		if (this.isDashing > 0) {
			this.isDashing--
			if (this.isDashing < 0) {
				this.isDashing = 0
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
		// left key down
		if (this.cursors.left.isDown) {
			this.goLeft()
		}
		// right key down
		else if (this.cursors.right.isDown) {
			this.goRight()
		}
		// up key down
		if (this.cursors.up.isDown) {
			this.goDash()
		}
	}

	touchInputs() {
		// touch is down
		if (this.touch.isDown) {
			const onLeftSide = this.isPointrOnLeftSide(this.touch)
			if (onLeftSide !== null) {
				// in case of left side
				if (onLeftSide) {
					this.goLeft()
				}
				// in case of right side
				else {
					this.goRight()
				}
			}
			// on second touch tap
			if (this.touch2.isDown) {
				this.goDash()
			}
		}
	}

	mouseInputs() {
		// mouse is inside game canvas
		if (this.input.isOver && this.mouse.camera) {
			const onLeftSide = this.isPointrOnLeftSide(this.mouse)
			if (onLeftSide !== null) {
				// in case of left side
				if (onLeftSide) {
					this.goLeft()
				}
				// in case of right side
				else {
					this.goRight()
				}
			}
			// on mouse click
			if (this.mouse.isDown) {
				this.goDash()
			}
		}
	}

	isPointrOnLeftSide(pointer) {
		// get normalized angle between this hero and pointer
		const angleToPointer = Phaser.Math.Angle.Normalize(Phaser.Math.Angle.Between(
			this.x - this.scene.mainCamera.scrollX,
			this.y - this.scene.mainCamera.scrollY,
			pointer.x,
			pointer.y
		))
		// get normalized angle of this hero
		const angleHero = Phaser.Math.Angle.Normalize(this.rotation)
		// get angle difference
		const angleDiff = angleToPointer - angleHero
		// check if angle differenc is not significant to fix and round
		if (Math.abs(angleDiff) < Phaser.Math.DegToRad(this.angularSpeed + 1)) {
			if (angleDiff === 0) {
				return null
			}
			this.setRotation(angleToPointer)
			return null
		} 
		// get which side the mouse is from this hero
		/**
		 * 1) diff > 0 => d0
		 * 2) abs(diff) > Math.PI => dpi
		 * IF d>0 & d>pi 		<= Left
		 * IF !d>0 & d>pi 	=> Right
		 * IF d>0 & !d>pi 	=> Right
		 * IF !d>0 & !d>pi 	<= Left
		 */
		const onLeftSide = (
			(angleDiff > 0 && Math.abs(angleDiff) > Math.PI)
			||
			(angleDiff < 0 && Math.abs(angleDiff) < Math.PI)
		)

		return onLeftSide
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