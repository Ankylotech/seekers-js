export default class Basic {
    constructor(player,p5) {
        this.player = player;
        this.p5 = p5;
        this.pos = {
            x : Math.random() * this.p5.width / 2 + this.p5.width * this.side,
            y : Math.random() * this.p5.height,
        }
        this.vel = {
            x : 0,
            y : 0,
        }
        this.acc = {
            x : 0,
            y : 0,
        }
        this.radius = 20;
    }

    draw() {
        console.log('drawing basic seeker')
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.p5.fill(this.player.color.red,this.player.color.green,this.player.color.blue);
        this.p5.ellipse(this.pos.x,this.pos.y,this.radius,this.radius)
    }


}