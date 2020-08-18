import Seeker from "@/seekerTypes/seeker";
export default class Speedy extends Seeker{
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
}