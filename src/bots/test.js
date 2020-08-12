import Seeker from "@/objects/seeker";

export function create(player) {
    this.player = player;
    for(let i = 0; i < player.max; i++) {
        player.seekers.push(new Seeker(player, player.p5))
    }
}

export function update() {
    for(let i = 0; i < this.player.seekers.length; i++){
        let seeker = this.player.seekers[i];
        seeker.setTarget(this.player.goals[i]);
        seeker.setMagnetDisabled();
        if(seeker.dist(seeker.getNearest(this.player.goals)) < 40){
            seeker.setTarget(this.player.camp.pos);
            seeker.setMagnetActive();
        }
    }
}