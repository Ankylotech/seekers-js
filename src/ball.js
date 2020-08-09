export default class Ball {
    constructor(p5) {
        this.p5 = p5;
        this.reset();
        this.radius = 10;
    }

    reset() {
        this.posX = Math.random() * this.p5.width;
        this.posY = Math.random() * this.p5.height;
        this.velX = 0;
        this.velY = 0;
    }

    update() {
        this.posX += this.velX;
        this.posY += this.velY;
        this.p5.fill(255, 0, 100);
        this.p5.ellipse(this.posX, this.posY, this.radius, this.radius);
    }
}