export default class GameObject {
    constructor(p5) {
        this.p5 = p5;
        this.vel = p5.createVector(0, 0);
        this.acc = p5.createVector(0, 0);
        this.mass = 1;
        this.maxSpeed = 1.25;
        this.color = {red: Math.random() * 255, green: Math.random() * 255, blue: Math.random * 255};
        this.radius = 4;
        this.acceleration = 0.2;
        this.disabled = false;
        this.pos = p5.createVector(Math.random() * p5.width, Math.random() * p5.height);
        this.slowDown = 1;
    }

    update() {
        this.acc.limit(this.acceleration);
        this.vel.mult(0.98);

        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        if (this.vel.mag() > this.maxSpeed/this.slowDown) this.vel.setMag(this.maxSpeed/this.slowDown);

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.pos = this.boundBy(this.pos, 0, this.p5.width, 0, this.p5.height)

    }

    draw() {
        this.p5.stroke(255);
        this.p5.strokeWeight(1);
        let schwanz = this.copy(this.vel);
        schwanz.setMag(this.radius).mult(-1).add(this.pos);
        let end = this.copy(schwanz).add(this.copy(this.vel).mult(-5));
        this.p5.line(schwanz.x, schwanz.y, end.x, end.y);
        this.p5.stroke(this.color.red, this.color.green, this.color.blue);
        if (!this.disabled) this.p5.fill(this.color.red, this.color.green, this.color.blue);
        else this.p5.noFill();
        this.p5.ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2)
    }

    boundBy(v, lowerX, upperX, lowerY, upperY, div = 1) {
        if (v.x > upperX / div) v.x -= upperX;
        if (v.x < lowerX / div) v.x += upperX;

        if (v.y > upperY / div) v.y -= upperY;
        if (v.y < lowerY / div) v.y += upperY;
        return v;
    }

    copy(v) {
        return this.p5.createVector(v.x, v.y);
    }

    dist(v1, v2) {
        let connect = this.subVector(v1, v2);
        connect = this.boundBy(connect, -this.p5.width, this.p5.width, -this.p5.height, this.p5.height, 2);
        return Math.sqrt(connect.x * connect.x + connect.y * connect.y);
    }

    subVector(v1, v2) {
        return this.p5.createVector(v1.x - v2.x, v1.y - v2.y);
    }

    getRadius() {
        return this.radius + 0.5;
    }

    getNearest(list) {
        let nearest = list[0];
        let min = Infinity;
        list.forEach((obj) => {
            if (this.dist(this.pos, obj.pos) < min) {
                nearest = obj;
                min = this.dist(this.pos, obj.pos);
            }
        })
        return nearest;
    }

    collide(gameObject) {
        if (gameObject === this || (this.pos.x === gameObject.pos.x && this.pos.y === gameObject.pos.y)) return;
        let overlap = (this.getRadius() + gameObject.getRadius(this)) - this.dist(this.pos, gameObject.pos);
        if (overlap > 0) {
            let zwischen = this.subVector(this.pos, gameObject.pos);
            if (zwischen.mag() === 0) return;
            zwischen.setMag(overlap / 2);
            this.pos.add(zwischen);
            gameObject.pos.add(zwischen.mult(-1));

            let xDist = this.pos.x - gameObject.pos.x;
            let yDist = this.pos.y - gameObject.pos.y;
            let distSquared = xDist * xDist + yDist * yDist;

            let xVelocity = gameObject.vel.x - this.vel.x;
            let yVelocity = gameObject.vel.y - this.vel.y;
            let dotProduct = xDist * xVelocity + yDist * yVelocity;
            //Neat vector maths, used for checking if the objects moves towards one another.
            if (dotProduct > 0) {
                let collisionScale = dotProduct / distSquared;
                let xCollision = xDist * collisionScale;
                let yCollision = yDist * collisionScale;
                //The Collision vector is the speed difference projected on the Dist vector,
                //thus it is the component of the speed difference needed for the collision.
                let combinedMass = this.mass + gameObject.mass;
                let collisionWeightA = 2 * gameObject.mass / combinedMass;
                let collisionWeightB = 2 * this.mass / combinedMass;
                this.vel.x += collisionWeightA * xCollision;
                this.vel.y += collisionWeightA * yCollision;
                gameObject.vel.x -= collisionWeightB * xCollision;
                gameObject.vel.y -= collisionWeightB * yCollision;
            }
        }
    }
}