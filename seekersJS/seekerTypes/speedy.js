class Speedy extends Seeker{
    constructor(player) {
        super(player);
        this.maxSpeed = 2.5;
        this.radius = 4;
        this.mass = 2;
        this.pullStrength = -0.66;
        this.pushStrength = 0.8;
        this.disabledTimer = 90;
        this.slowDownFactor = 4;
    }

    drawSpecial() {
        fill(255-this.color.red,255-this.color.green,255-this.color.blue);
        stroke(255-this.color.red,255-this.color.green,255-this.color.blue);
        let v1 = createVector(this.vel.x,this.vel.y);
        if(v1.mag() === 0) v1 = createVector(this.radius,0);
        else v1.setMag(this.radius);
        let v2 = v1.rotate(4*PI/9);
        let v3 = v2.rotate(PI/9);
        push();
        translate(this.pos.x,this.pos.y);
        triangle(v1.x,v1.y,v2.y,v2.y,v3.x,v3.y);
        pop();
    }
}