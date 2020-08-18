import AbstractBot from "@/bots/AbstractBot";

export default class bot extends AbstractBot {
    constructor(player) {
        super(player);
        for(let i = 0; i < 2; i++) {
            this.addSeeker();
        }
        for(let i = 2; i < this.player.max; i++){
            this.addSpeedy();
        }
    }

    update() {
        for(let i = 0; i < this.player.seekers.length; i++){
            let seeker = this.player.seekers[i];
            seeker.setTarget(this.player.goals[i].pos);
            seeker.setMagnetDisabled();
            if(seeker.dist(seeker.getNearest(this.player.goals).pos,seeker.pos) < 20){
                seeker.setTarget(this.player.camp.pos);
                seeker.setMagnetActive();
            }
        }
    }
}
