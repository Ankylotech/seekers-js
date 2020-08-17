import Seeker from "@/seekerTypes/seeker";

export default class Chunky extends Seeker{
    constructor(player,p5) {
        super(player,p5);
        this.maxSpeed = 0.875;
        this.radius = 6;
        this.mass = 5;
        this.pullStrength = -1;
        this.pushStrength = 1.5;
        this.disabledTimer = 45;
        this.slowDownFactor = 1.5;
        this.diams = []

        for (let i = 0; i < 4; i++) {
            this.diams.push(this.radius * 2 + 4 * i * this.radius / 2);
        }
    }
}