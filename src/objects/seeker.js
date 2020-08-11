import GameObject from "@/objects/gameObject";

export default class Seeker extends GameObject {
    constructor(player, p5) {
        super(p5);
        this.player = player;
        this.color = this.player.color;
        this.pos = p5.createVector(Math.random() * this.p5.width / 2 + this.p5.width * this.player.side,
            Math.random() * this.p5.height);

        this.target = p5.createVector(this.pos.x + 10, this.pos.y + 10);
        this.magnetStatus = 0;
        this.radius = 5;
        this.acceleration = 0.5;
        this.maxSpeed = 5;
        this.disabled = false;
        this.disabledTime = 0;
        this.mass = 3;
    }

    draw() {
        if(this.disabledTime > 0) this.disabledTime--;
        if(this.disabledTime === 0) this.disabled = false;
        this.setAcc();
        if(this.disabled) this.acc.setMag(0);
        super.draw();
    }

    setTarget(v) {
        this.target = v;
    }


    setAcc() {
        this.acc = this.subVector(this.target, this.pos);
        this.acc = this.boundBy(this.acc, -this.p5.width, this.p5.width, -this.p5.height, this.p5.height, 2)
        this.acc.setMag(this.acceleration);
    }

    seekerCollide(seeker2) {
        console.log('player')
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
            //super.collide(seeker2);
        }
    }
}