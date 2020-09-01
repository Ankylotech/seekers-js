class Splash {

    constructor(pos, zahl, c, dist, start, fin) {
        this.diams = [];
        for (let i = 0; i < zahl; i++) {
            this.diams.push(start + i * dist);
        }
        this.farbe = c;

        this.finish = fin;
        this.pos = pos;
        this.fertig = false;
    }

    update() {
        if (!this.fertig) {
            stroke(this.farbe.red, this.farbe.green, this.farbe.blue);
            noFill();
            strokeWeight(1);
            for (let i = 0; i < this.diams.length; i++) {
                if (this.diams[i] < this.finish) {
                    ellipse(this.pos.x, this.pos.y, this.diams[i], this.diams[i]);
                }
                this.diams[i] += 0.5;
            }
            if (this.diams[0] > this.finish) this.fertig = true;
        }
    }
}