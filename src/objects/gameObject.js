export default class GameObject {
    constructor(p5) {
        this.p5 = p5;
        this.vel = p5.createVector(0, 0);
        this.acc = p5.createVector(0, 0);
        this.mass = 1;
        this.maxSpeed = 5;
        this.color = this.p5.color(Math.random() * 255, Math.random() * 255, Math.random * 255);
        this.radius = 4;
    }


    draw() {
        this.vel.mult(0.98);

        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        if (this.vel.mag() > this.maxSpeed) this.vel.setMag(this.maxSpeed);

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.pos = this.boundBy(this.pos, 0, this.p5.width, 0, this.p5.height)


        this.p5.fill(this.color);
        this.p5.ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2)
    }

    boundBy(v, lowerX, upperX, lowerY, upperY, div = 1) {
        if (v.x > upperX / div) v.x -= upperX;
        if (v.x < lowerX / div) v.x += upperX;

        if (v.y > upperY / div) v.y -= upperY;
        if (v.y < lowerY / div) v.y += upperY;
        return v;
    }

    dist(v1, v2) {
        let connect = this.subVector(v1,v2)
        return Math.sqrt(connect.x*connect.x+connect.y*connect.y);
    }

    subVector(v1, v2) {
        return this.p5.createVector(v1.x - v2.x, v1.y - v2.y);
    }

    getRadius() {
        return this.radius;
    }

    collide(gameObject) {
        if (gameObject === this || (this.pos.x === gameObject.pos.x && this.pos.y === gameObject.pos.y)) return;
        if (this.dist(this.pos, gameObject.pos) <= this.radius + gameObject.getRadius(this)) {
            console.log('collision')
            console.log(gameObject)
            let zwischen = this.subVector(this.pos, gameObject.pos);
            if(zwischen.mag() === 0) return;
            console.log('connection: ' + zwischen.x + '-' + zwischen.y);

            let angle1 = zwischen.angleBetween(this.vel);
            console.log(angle1);
            this.vel.rotate(angle1);
            console.log('rotated');

            let angle2 = zwischen.angleBetween(gameObject.vel);
            gameObject.vel.rotate(angle2);

            let v1 = this.vel.y;
            let v2 = gameObject.vel.y;

            let m1 = this.mass;
            let m2 = gameObject.mass;

            this.vel.y = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
            gameObject.vel.y = ((m2 - m1) * v2 + 2 * m1 * v1) / (m2 + m1);

            this.vel.rotate(-angle1);
            gameObject.vel.rotate(-angle2);

            let dir = this.subVector(gameObject.pos, this.pos);
            dir.setMag(this.dist(gameObject.pos, this.pos) - this.radius - gameObject.getRadius(this));
            if (v1 + v2 <= 0.01) dir.mult(1.01);
            this.pos.add(dir);
            this.acc.setMag(0);
        }
    }
}