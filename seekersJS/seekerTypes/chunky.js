class Chunky extends Seeker{
    constructor(player) {
        super(player);
        this.maxSpeed = 0.875;
        this.radius = 6;
        this.mass = 5;
        this.pullStrength = -1.25;
        this.pushStrength = 1.75;
        this.disabledTimer = 45;
        this.slowDownFactor = 1.5;
        this.diams = []

        for (let i = 0; i < 4; i++) {
            this.diams.push(this.radius * 2 + 4 * i * this.radius / 2);
        }
    }
}