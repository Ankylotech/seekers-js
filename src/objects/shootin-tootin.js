import Seeker from "@/objects/seeker";
import Rocket from "@/objects/Rocket";

export default class Tank extends Seeker {
    constructor(player, p5) {
        super(player, p5);
        this.maxSpeed = 1;
        this.radius = 4;
        this.mass = 2;
        this.pullStrength = 0;
        this.pushStrength = 0;
        this.disabledTimer = 120;
        this.slowDownFactor = 1;
        this.rockets = [];
        this.cooldown = 100;
        this.shotCooldown = 200;
        this.maxRockets = 5;
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

    shoot(target) {
        if (this.cooldown <= 0 && this.rockets.length <= this.maxRockets && !this.disabled) {
            this.cooldown = this.shotCooldown;
            this.rockets.push(new Rocket(this.p5, this.pos, target,this.player));
        }
    }
}