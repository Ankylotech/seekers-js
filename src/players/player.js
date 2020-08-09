export default class Player {
    constructor(file,p5,side){
        this.player = require('../bots/' + file.name);
        this.seekers = [];
        this.p5 = p5;
        this.side = side;
        this.player.create(this);
    }
    draw() {
        this.player.update(this);
        this.p5.ellipse(20 + this.side*200, this.p5.height/2 , 20, 20)
    }
}