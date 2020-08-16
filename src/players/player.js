import Camp from "@/objects/camp";

export default class Player {
    enemy;

    constructor(file, p5, side, goals, max) {
        this.player = require('../bots/' + file.name);
        this.name = file.name.substring(0, file.name.length - 3);
        this.goals = goals;
        this.seekers = [];
        this.max = max;
        this.p5 = p5;
        this.side = side;
        let r = Math.random() * 255;
        let g = Math.random() * 255;
        let b = Math.random() * 255
        this.color = {red: r, green: g, blue: b};
        this.player.create(this);
        this.score = 0;
        this.camp = new Camp(this, p5);
    }

    draw() {
        this.p5.fill(this.color.red, this.color.green, this.color.blue);
        this.p5.textSize(20);
        this.p5.strokeWeight(1);
        this.p5.noStroke();
        this.p5.textAlign(this.p5.LEFT, this.p5.TOP);
        this.p5.text(this.name + ' score: ' + this.score, 10, 10 + this.side * 20);
        if (this.seekers.length > this.max) console.error(this.name + " has too many seekers")
        if (this.enemy.seekers.length > this.max) console.error(this.enemy.name + "'s has too many seekers")
        this.camp.draw();
        this.seekers.forEach((seeker) => {
            this.seekers.forEach(ally => {
                seeker.seekerCollide(ally);
            });
            this.enemy.seekers.forEach(enemy => {
                seeker.seekerCollide(enemy);
            });
            this.goals.forEach(goal => {
                seeker.influence(goal);
                seeker.collide(goal);
                goal.collide(seeker);
            });

        })
        this.player.update();
        this.seekers.forEach((seeker) => {
            seeker.draw();
        })
    }
}