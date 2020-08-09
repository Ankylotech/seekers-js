export function create(player)  {
    player.seekers = [];
}

export function update(player) {
    player.seekers.forEach((seeker) => {
        console.log(seeker);
    })
}