import AbstractBot from "@/bots/AbstractBot";

export default class bot extends AbstractBot {
    constructor(player) {
        super(player)
        this.player = player;
        for (let i = 0; i < 2; i++) {
            this.addSeeker();
        }
        for (let i = 2; i < player.max; i++) {
            this.addTank();
        }
    }

    update() {
        for (let i = 0; i < 2; i++) {
            let seeker = this.player.seekers[i];
            seeker.setTarget(this.player.goals[i].pos);
            seeker.setMagnetDisabled();
            if (seeker.dist(seeker.getNearest(this.player.goals).pos, seeker.pos) < 20) {
                seeker.setTarget(this.player.camp.pos);
                seeker.setMagnetActive();
            }
        }
        for (let i = 2; i < this.player.seekers.length; i++) {
            let seeker = this.player.seekers[i];
            seeker.shoot(this.player.enemy.seekers[i].pos, i / 2);
        }
    }
}
