import Camp from "@/objects/camp";

export default class Player {
    enemy;

    constructor(file, p5, side, goals, max) {
        this.bot = require('../bots/' + file.name);
        this.name = file.name.substring(0, file.name.length - 3);
        this.goals = goals;
        this.max = max;
        this.p5 = p5;
        let r = Math.random() * 205 + 50;
        let g = Math.random() * 205 + 50;
        let b = Math.random() * 205 + 50;
        this.rockets = [];
        this.color = {red: r, green: g, blue: b};
        this.reset(side);
    }

    reset(side) {
        this.seekers = [];
        this.side = side;
        this.player = new this.bot.default(this);
        this.score = 0;
        this.camp = new Camp(this, this.p5);
    }

    setSide(side) {
        this.reset(side);
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
        this.seekers.forEach((seeker) => {
            seeker.draw();
        })

    }

    logic() {
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
            seeker.update();
        })
        this.rockets = [];

        this.seekers.forEach((seeker) => {
            if(seeker.rockets !== undefined){
                this.rockets.push.apply(this.rockets,seeker.rockets);
            }
        })
        this.enemy.seekers.forEach((seeker) => {
            if(seeker.rockets !== undefined){
                this.rockets.push.apply(this.rockets,seeker.rockets);
            }
        })
    }
}