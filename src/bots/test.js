import Basic from "@/objects/basic";

export function create(player) {
    this.player = player;
    console.log('adding players')
    player.seekers.push(new Basic(player, player.p5))
}

export function update() {
}