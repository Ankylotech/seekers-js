
class Rocket extends GameObject {
    constructor(pos, target,player,size) {
        super();
        this.radius = size*2;

        this.pos = createVector(pos.x, pos.y);
        this.vel = this.subVector(target, this.pos);
        this.maxSpeed = 5/(size*size);
        this.vel.setMag(this.maxSpeed);
        this.mass = size*12;
        this.color = {red: 255, green: 0, blue: 0}
        this.off = false;
        this.player = player;
        this.friction = 0;
        this.lifeTime = 1000/this.maxSpeed;
    }


    update() {
        if(this.lifeTime > 0)this.lifeTime--;
        else this.off = true;
        super.update();
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
            seeker2.disable(this.size,this);
            return true;
        }
        return false;
    }
}