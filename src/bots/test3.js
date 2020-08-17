import Seeker from "@/objects/seeker";
import Speedy from "@/objects/Speedy";

export function create(player) {
    this.player = player;
    for(let i = 0; i < 2; i++) {
        player.seekers.push(new Seeker(player, player.p5))
    }
    for(let i = 2; i < this.player.max; i++){
        player.seekers.push(new Speedy(player, player.p5))
    }
}

export function update() {
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