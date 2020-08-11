export default class Player {
    constructor(file,p5,side,balls){
        this.player = require('../bots/' + file.name);
        this.balls = balls;
        this.seekers = [];
        this.enemys = [];
        this.p5 = p5;
        this.side = side;
        this.color = {
            red: Math.random()*255,
            green: Math.random()*255,
            blue: Math.random()*255,
        }
        this.player.create(this);
    }
    draw() {
        this.player.update();
        this.seekers.forEach((seeker) => {
            seeker.draw();
        })
    }
}