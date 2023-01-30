import { EVENTS, GAME, TEXTURES } from "../../config";

export default class DotHero extends Phaser.Physics.Arcade.Image {
	constructor(scene, { name, x = 0, y = 0, mode = 0, angle = 0, score = 0, alive = false, tint = 0xffffff}, isControlled = true) {
		super(scene, x, y, TEXTURES.HERO, mode)
		console.log('DotHero', { mode })
		scene.add.existing(this)
		scene.physics.add.existing(this)

		// static props
		this.isControlled = isControlled
		this.name = name
		this.size = 50;
		this.angularSpeed = 4;
		this.angularFriction = 0.77;
		this.linearSpeed = 0;
		this.dashPower = 2000;
		this.dashCharge = 100;
		this.dashFriction = 0.88;
		this.modes = GAME.PLAYER.MODES

		// state
		this.mode = mode
    this.alive = alive
		this.score = score;
		this.angularVelocity = 0;
		this.isDashing = 0;

		// set physics
		this.setDamping(true)
		this.setDrag(0.02)
		// upate sprite
		this.setCollideWorldBounds(true);
		this.setBounce(0.5, 0.5)
		this.setCircle(this.width / 2);
		this.setAngle(angle)
		console.log(tint)
		this.setTint(tint)
		// this.goRandomMode()
		// this.goRandomPosition()

		// create bars
		this.createDashBar()		

		// set external helpers
		this.scene = scene;
		this.input = scene.input;
		// handle control inputs
		// follow sprite
		if (this.isControlled) {
			// - keyboard inputs
			this.cursors = this.input.keyboard.createCursorKeys();
			// - mouse inputs
			this.mouse = this.input.mousePointer
			// - touch inputs
			this.input.addPointer(1) // add extra pointer
			this.touch = this.input.pointer1
			this.touch2 = this.input.pointer2
	
			scene.mainCamera.startFollow(this, false, 0.5, 0.5);
			scene.minimapCamera.startFollow(this, false, 0.2, 0.2);
		}
	}

	update() {
		if (this.isControlled) {
			// input controls
			this.keyboardInputs()
			this.touchInputs()
			this.mouseInputs()
			// update angular velocity
			this.setAngle(this.angle + this.angularVelocity)			
			// add friction to angular veloctity
			this.applyAngularFriction()
			// update bars
			this.updateDashBar()
		}

		// recharge dash bar
		this.rechargeDash()

		// update alive/dead display
		this.setAlpha(this.alive ? 1 : 0.4)
	}

	createDashBar() {
		this.dashBar = this.scene.add.rectangle(0, 0, 100, 4, this.tint, 0.7)
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
			if (this.isControlled) {
				this.emit(EVENTS.HERO.DASH)
			}
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

	rechargeDash() {
		if (this.isDashing > 0) {
			this.isDashing--
			if (this.isDashing < 0) {
				this.isDashing = 0
				// this.emit(EVENTS.HERO.DASH_ENDED)
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

  updateState(data) {
    for (let key in data) {
      if (data[key] !== undefined) {
        this[key] = data[key]

        if (key === 'mode') {
          console.log(this.name, data)
					this.setFrame(this.mode)
        }
      }
    }
  }
}