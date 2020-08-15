export default class Splash {

    constructor(pos, zahl, c, dist, start, fin, p5) {
        this.diams = [];
        for (let i = 0; i < zahl; i++) {
            this.diams.push(start + i * dist);
        }
        this.farbe = c;

        this.finish = fin;
        this.pos = pos;
        this.fertig = false;
        this.p5 = p5;
    }

    update() {
        if (!this.fertig) {
            this.p5.stroke(this.farbe.red, this.farbe.green, this.farbe.blue);
            this.p5.noFill();
            this.p5.strokeWeight(1);
            for (let i = 0; i < this.diams.length; i++) {
                if (this.diams[i] < this.finish) {
                    this.p5.ellipse(this.pos.x, this.pos.y, this.diams[i], this.diams[i]);
                }
                this.diams[i] += 0.5;
            }
            if (this.diams[0] > this.finish) this.fertig = true;
        }
    }
}