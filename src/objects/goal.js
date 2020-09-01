
class Goal extends GameObject {
    constructor() {
        super();
        this.reset();
        this.radius = 3;
        this.maxSpeed = 2.5;
        this.mass = 1;
        this.color = {red: 225, green: 0, blue: 125};
    }

    reset() {
        this.pos = createVector(Math.random() * width, Math.random() * height);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.timer = 40;
    }

    update() {
        super.update();
        this.acc.setMag(0);
    }

    draw() {
        super.draw();
    }
}