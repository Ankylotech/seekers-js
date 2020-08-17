import GameObject from "@/objects/gameObject";

export default class Rocket extends GameObject {
    constructor(p5, pos, target,player) {
        super(p5);
        this.radius = 1.5;

        this.pos = p5.createVector(pos.x, pos.y);
        this.target = target;
        this.maxSpeed = 3;
        this.mass = 20;
        this.color = {red: 255, green: 0, blue: 0}
        this.off = false;
        this.player = player;
    }

    setAcc() {
        this.acc = this.subVector(this.target.pos, this.pos);
        this.acc = this.boundBy(this.acc, -this.p5.width, this.p5.width, -this.p5.height, this.p5.height, 2)
        this.acc.setMag(this.maxSpeed);
    }

    update() {
        this.setAcc();
        super.update();

    }

    draw() {
        super.draw();
    }

    collide(gameObject) {
        if (super.collide(gameObject)) {
            this.off = true;
            return true;
        }
        return false;
    }

    seekerCollide(seeker2) {
        if (this.collide(seeker2)) {
            seeker2.disable(2,this);
            return true;
        }
        return false;
    }
}