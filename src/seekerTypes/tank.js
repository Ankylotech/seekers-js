import Seeker from "@/seekerTypes/seeker";
import Rocket from "@/seekerTypes/rocket";

export default class Tank extends Seeker {
    constructor(player) {
        super(player);
        this.maxSpeed = 0.5;
        this.radius = 4;
        this.mass = 2;
        this.disabledTimer = 120;
        this.slowDownFactor = 1.25;
        this.rockets = [];
        this.cooldown = 100;
        this.shotCooldown = 200;
        this.maxRockets = 1;
        this.magazine = 6;
        this.total = 0;
    }

    update() {
        if (this.cooldown > 0) this.cooldown--;
        super.update();
        this.rockets.forEach(rocket => {
            rocket.update();
        })
        let copy = [...this.rockets];
        this.rockets = [];
        copy.forEach(rocket => {
            if(!rocket.off){
                this.rockets.push(rocket);
            }
        })
    }

    draw() {
        this.rockets.forEach(rocket => {
            rocket.draw();
        })
        super.draw();
    }

    collide(gameObject) {
        if(gameObject !== this) {
            this.rockets.forEach(rocket => {
                rocket.collide(gameObject);
            })
        }
        return super.collide(gameObject);
    }

    seekerCollide(seeker2) {
        if(seeker2 !== this) {
            this.rockets.forEach(rocket => {
                rocket.seekerCollide(seeker2);
            })
        }
        return super.seekerCollide(seeker2);
    }

    shoot(target,size) {
        if (this.cooldown <= 0 && this.rockets.length <= this.maxRockets && !this.disabled ) {
            this.cooldown = this.shotCooldown;
            this.total ++;
            if(this.total % this.magazine === 0) this.cooldown = 5*this.shotCooldown;
            this.rockets.push(new Rocket(this.p5, this.pos, target,this.player,size));
        }
    }
}