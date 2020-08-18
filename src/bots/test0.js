import AbstractBot from "@/bots/AbstractBot";

export default class bot extends AbstractBot {
    constructor(player) {
        super(player);
        for(let i = 0; i < this.player.max; i++) {
            this.addSeeker();
        }
    }

    update() {
    }
}
