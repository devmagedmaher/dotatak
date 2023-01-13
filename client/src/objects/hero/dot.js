
export default class DotHero {
    constructor(scene, { x = 100, y = 100, angle = 0 } = {}) {
        this.scene = scene;
        this.circle = this.scene.physics.add.image(x, y, 'hero');
        this.circle.angle = angle;
        this.circle.setCircle(25);
        this.circle.setBounce(0.2);
        this.circle.setCollideWorldBounds(true);
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.angular_speed = 0.1;
        this.linear_speed = 250;
        this.dash_power = 900;
        this.dash = 0;
        this.is_dashing = false;

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
            }
        }
        // if (this.cursors.down.isDown) {
        //     this.circle.angle += this.angular_speed;
        // }

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

export class DotHeroStatic {
    constructor(scene, { name, x = 100, y = 100 } = {}) {
        this.scene = scene;
        this.name = name;
        this.circle = this.scene.physics.add.image(x, y, 'hero');
        this.circle.setCircle(25);

        const [fname, lname] = this.name.split('-')
        this.label = this.scene.add.text(this.circle.x, this.circle.y, `${fname}\n${lname}`, { font: '12px', fill: '#00ff00' }).setAlign('center')
        // this.label.setScrollFactor(0);
        // this.scene.cameras.main.startFollow(this.circle, true, 0.5, 0.5);
        
    }

    update() {
        this.label.x = this.circle.x - (this.label.width / 2)
        this.label.y = this.circle.y - this.circle.height - this.label.height
    }

    destroy() {
        this.circle.destroy()
        this.label.destroy()
    }
}