import {Seeker} from "@/seekerTypes";

export function create(player) {
    this.player = player;
    for(let i = 0; i < player.max; i++) {
        player.seekers.push(new Seeker(player, player.p5))
    }
}

export function update() {

}