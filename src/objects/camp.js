export default class Camp {
    constructor(player, p5) {
        this.player = player;
        this.p5 = p5;
        this.pos = {
            x: player.side * (3 * p5.width / 5) + p5.width / 5,
            y: p5.height / 2
        }
        this.color = player.color;
        this.size = 20;
    }

    draw() {
        this.p5.rectMode(this.p5.CENTER);
        this.p5.stroke(this.color.red, this.color.green, this.color.blue);
        this.p5.noFill();
        this.p5.strokeWeight(2);
        this.p5.rect(this.pos.x, this.pos.y, this.size, this.size, this.size / 5, this.size / 5, this.size / 5, this.size / 5);
    }

    withinBorders(v) {
        return (v.x > this.pos.x - this.size / 2 && v.x < this.pos.x + this.size / 2 && v.y > this.pos.y - this.size / 2 && v.y < this.pos.y + this.size / 2)
    }
}