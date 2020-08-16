import GameObject from "@/objects/gameObject";

export default class Seeker extends GameObject {
    constructor(player, p5) {
        super(p5);
        this.player = player;
        this.color = this.player.color;
        this.pos = p5.createVector(Math.random() * this.p5.width / 2 + this.p5.width / 2 * this.player.side,
            Math.random() * this.p5.height);
        this.maxSpeed = 5 / 4.0;

        this.target = p5.createVector(this.pos.x, this.pos.y);

        this.magnetStatus = 0;
        this.pullStrength = -0.75;
        this.pushStrength = 1;

        this.radius = 5;
        this.mass = 3;
        this.diams = []

        for (let i = 0; i < 2; i++) {
            this.diams.push(this.radius * 2 + 4 * i * this.radius / 2);
        }

        this.disabled = false;
        this.disabledTime = 0;

    }

    update() {if (this.disabledTime > 0) this.disabledTime--;
        if (this.disabledTime === 0) this.disabled = false;
        this.setAcc();
        if (this.disabled) this.acc.setMag(0);

        super.update();
    }

    draw() {
        this.p5.noFill();
        this.p5.stroke(this.color.red, this.color.green, this.color.blue);
        this.p5.strokeWeight(0.5);
        if (this.magnetStatus !== 0 && !this.disabled) {
            for (let i = 0; i < this.diams.length; i++) {
                this.p5.ellipse(this.pos.x, this.pos.y, this.diams[i], this.diams[i]);
                this.diams[i] += this.magnetStatus * 0.2;
                if (this.diams[i] > 6 * this.radius) this.diams[i] = this.radius * 2;
                if (this.diams[i] < 2 * this.radius) this.diams[i] = 6 * this.radius;
            }
        }


        super.draw();
    }

    setTarget(v) {
        this.target = v;
    }

    influence(goal) {
        if (this.magnetStatus !== 0 && !this.disabled) {
            let accVec = this.subVector(goal.pos, this.pos);
            accVec = this.boundBy(accVec, -this.p5.width, this.p5.width, -this.p5.height, this.p5.height, 2)
            let d = this.dist(goal.pos, this.pos) - (this.radius + goal.radius);
            accVec.mult(this.magnetStatus * goal.acceleration / (d * d));
            goal.acc.add(accVec);
        }
    }

    setMagnetActive() {
        this.magnetStatus = this.pullStrength;
    }

    setMagnetDisabled() {
        this.magnetStatus = 0;
    }

    setMagnetRepulsive() {
        this.magnetStatus = this.pushStrength;
    }

    setAcc() {
        this.acc = this.subVector(this.target, this.pos);
        this.acc = this.boundBy(this.acc, -this.p5.width, this.p5.width, -this.p5.height, this.p5.height, 2)
        this.acc.setMag(this.acceleration);
    }

    seekerCollide(seeker2) {
        if (seeker2 === this) return false;
        if (this.dist(this.pos, seeker2.pos) <= this.radius + seeker2.getRadius(this)) {
            if (this.magnetStatus === seeker2.magnetStatus) {
                this.disabled = true;
                seeker2.disabled = true;
                this.magnetStatus = 0;
                seeker2.magnetStatus = 0;
                this.disabledTime = 60;
                seeker2.disabledTime = 60;
            } else {
                if (this.magnetStatus === 0) {
                    seeker2.disabled = true;
                    seeker2.magnetStatus = 0;
                    seeker2.disabledTime = 120;
                } else if (seeker2.magnetStatus === 0) {
                    this.disabled = true;
                    this.magnetStatus = 0;
                    this.disabledTime = 120;
                } else {
                    this.disabled = true;
                    seeker2.disabled = true;
                    this.magnetStatus = 0;
                    seeker2.magnetStatus = 0;
                    this.disabledTime = 90;
                    seeker2.disabledTime = 90;
                }
            }
            super.collide(seeker2);
        }
    }
}