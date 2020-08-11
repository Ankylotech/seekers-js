export default class Seeker {
    constructor(player, p5) {
        this.player = player;
        this.p5 = p5;
        this.pos = p5.createVector(Math.random() * this.p5.width / 2 + this.p5.width * this.player.side,
            Math.random() * this.p5.height);

        this.vel = p5.createVector(0, 0);

        this.acc = p5.createVector(0, 0);
        this.target = p5.createVector(this.pos.x + 10, this.pos.y + 10);
        this.magnetStatus = 0;
        this.radius = 20;
        this.acceleration = 0.5;
        this.maxSpeed = 5;
    }

    draw() {
        this.setAcc();
        console.log(this.target);

        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        if (this.vel.mag() > this.maxSpeed) this.vel.setMag(this.maxSpeed);

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.pos = this.boundBy(this.pos,0,this.p5.width,0,this.p5.height)


        this.p5.fill(this.player.color.red, this.player.color.green, this.player.color.blue);
        this.p5.ellipse(this.pos.x, this.pos.y, this.radius, this.radius)
    }

    boundBy(v, lowerX, upperX,lowerY,upperY, div = 1) {
        if (v.x > upperX/div) v.x -= upperX;
        if (v.x < lowerX/div) v.x += upperX;

        if (v.y > upperY/div) v.y -= upperY;
        if (v.y < lowerY/div) v.y += upperY;
        return v;
    }

    setAcc() {
        this.acc = this.subVector(this.target, this.pos);
        this.acc = this.boundBy(this.acc,-this.p5.width,this.p5.width,-this.p5.height,this.p5.height,2)
        this.acc.setMag(this.acceleration);
    }

    subVector(v1, v2) {
        return this.p5.createVector(v1.x - v2.x, v1.y - v2.y);
    }
}