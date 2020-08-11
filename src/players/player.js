export default class Player {
    constructor(file, p5, side, goals) {
        this.player = require('../bots/' + file.name);
        this.goals = goals;
        this.seekers = [];
        this.enemys = [];
        this.p5 = p5;
        this.side = side;
        this.color = this.p5.color(Math.random()*255,Math.random()*255,Math.random*255);
        this.player.create(this);
    }

    draw() {
        this.player.update();
        this.seekers.forEach((seeker) => {
            seeker.draw();
        })
        this.seekers[0].setTarget(this.p5.createVector(10,10).add(this.seekers[0].pos))
        this.seekers.forEach((seeker) => {
            this.seekers.forEach(ally => {
                console.log(ally);
                //seeker.seekerCollide(ally);
            });
            this.enemys.forEach(enemy => {
                console.log(enemy);
                //seeker.seekerCollide(enemy);
            });
            this.goals.forEach(goal => {
                console.log(seeker + "-" + goal);
                /*seeker.collide(goal);
                goal.collide(seeker);*/
            });

        })
    }
}