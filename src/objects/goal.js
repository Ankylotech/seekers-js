import GameObject from "@/objects/gameObject";

export default class Goal extends GameObject {
    constructor(p5) {
        super(p5);
        this.reset();
        this.radius = 3;
        this.maxSpeed = 10;
        this.mass = 1;
        this.color = {red: 225, green: 0, blue: 125};
    }

    reset() {
        this.pos = this.p5.createVector(Math.random() * this.p5.width, Math.random() * this.p5.height);
        this.vel = this.p5.createVector(0, 0);
        this.acc = this.p5.createVector(0, 0);
        this.timer = 20;
    }

    update() {
        super.draw();
    }
}