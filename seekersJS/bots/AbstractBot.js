class AbstractBot {
    constructor(player) {
        this.player = player;
        this.p5 = this.player.p5;
        this.seekers = function () {
            return this.player.seekers;
        }
        this.others = function () {
            return [...this.player.enemy.seekers];
        }
        this.goals = function () {
            return this.player.goals;
        }
        this.ownCamp = function () {
            return this.player.camp;
        }
        this.enemyCamp = function() {
            return this.player.enemy.camp;
        }
        this.allRockets = function () {
            return this.player.rockets.splice().concat(this.player.enemy.rockets)
        }
    }

    addChunky() {
        if(this.player.seekers.length < this.player.max){
            this.player.seekers.push(new Chunky(this.player));
        }
    }
    addSpeedy() {
        if(this.player.seekers.length < this.player.max){
            this.player.seekers.push(new Speedy(this.player));
        }
    }
    addShield() {
            if(this.player.seekers.length < this.player.max){
                this.player.seekers.push(new Shield(this.player));
            }

    }
    addTank() {
        if(this.player.seekers.length < this.player.max){
            this.player.seekers.push(new Tank(this.player));
        }
    }
    addSeeker() {
        if(this.player.seekers.length < this.player.max){
            this.player.seekers.push(new Seeker(this.player));
        }
    }

    dist(v1, v2) {
        let connect = this.subVector(v1, v2);
        connect = this.limitWithin(connect, -width/2, width/2, -height/2, height/2, 2);
        return Math.sqrt(connect.x * connect.x + connect.y * connect.y);
    }

    subVector(v1, v2) {
        return createVector(v1.x - v2.x, v1.y - v2.y);
    }

    getNearest(pos,list) {
        let nearest = list[0];
        let min = Infinity;
        list.forEach((obj) => {
            if (this.dist(pos, obj.pos) < min) {
                nearest = obj;
                min = this.dist(pos, obj.pos);
            }
        })
        return nearest;
    }


    getNearestList(pos, copy) {
        copy.sort((a,b) => {
            return this.dist(a.pos,pos) - this.dist(b.pos,pos);
        })
        return copy;
    }

    limitWithin(v, lowerX, upperX, lowerY, upperY, mult = 1) {
        if (v.x > upperX) v.x -= upperX*mult;
        if (v.x < lowerX) v.x += upperX*mult;

        if (v.y > upperY) v.y -= upperY*mult;
        if (v.y < lowerY) v.y += upperY*mult;
        return v;
    }
}