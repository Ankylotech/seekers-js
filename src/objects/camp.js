class Camp {
    constructor(player) {
        this.player = player;
        this.pos = {
            x: player.side * (3 * width / 5) + width / 5,
            y: height / 2
        }
        this.color = player.color;
        this.size = 25;
    }

    draw() {
        rectMode(CENTER);
        stroke(this.color.red, this.color.green, this.color.blue);
        noFill();
        strokeWeight(2);
        rect(this.pos.x, this.pos.y, this.size, this.size, this.size / 5, this.size / 5, this.size / 5, this.size / 5);
    }

    withinBorders(v) {
        return (v.x > this.pos.x - this.size / 2 && v.x < this.pos.x + this.size / 2 && v.y > this.pos.y - this.size / 2 && v.y < this.pos.y + this.size / 2)
    }
}