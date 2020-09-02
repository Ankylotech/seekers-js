class bot extends AbstractBot {
    constructor(player) {
        super(player);
        this.addChunky();
        this.addChunky();
        this.addTank();
        this.addShield();
        this.addSpeedy();
    }

    update() {
        let seekers = this.seekers();
        let copy = this.goals();
        let collecting = [];
        for (let i = 0; i < 2; i++) {
            let near = this.getNearestList(this.ownCamp().pos,copy)[i];
            seekers[i].setTarget(near.pos);
            seekers[i].setMagnetDisabled();
            if(this.dist(seekers[i].pos,near.pos) < 20) {
                seekers[i].setTarget(this.ownCamp().pos);
                seekers[i].setMagnetActive();
            }
            collecting.push(near);
            copy.filter(value => !collecting.includes(value));
        }

        let fire = false;
        let target = null;
        this.enemys().forEach(seeker => {
            if(seeker.vel.mag() === 0) {
                target = seeker;
                fire = true;
            }
        })
        if(fire){
            seekers[2].shoot(target.pos,2);
        }else {
            seekers[2].shoot(this.getNearest(seekers[2].pos,this.enemys()).pos,0.5);
        }

        seekers[2].setTarget(this.p5.createVector(-50 + this.enemyCamp().pos.x,this.enemyCamp().pos.y))

        seekers[3].setTarget(this.enemyCamp().pos);
        if(this.dist(seekers[3].pos,this.enemyCamp().pos) < 10) {
            let allEnemys = [...this.enemys()].concat(this.allRockets());
            let nearest;
            if(allEnemys.length > 0) nearest = this.getNearest(seekers[3].pos,allEnemys).pos;
            if(!nearest ||  this.dist(nearest,seekers[3].pos) < 20) {
                seekers[3].shield(10);
            }else {
                seekers[3].disableShield();
            }
        }

        seekers[4].setTarget(this.getNearest(this.enemyCamp().pos,this.enemys()).pos)
    }

}
