export default class Player {
    constructor(file){
        this.player = require('../bots/' + file.name);
        this.seekers = [];
        this.player.create();
    }
    draw() {
        this.player.update();
    }
}