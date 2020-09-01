class Shield extends Seeker {
    constructor(player) {
        super(player);
        this.maxSpeed = 2;
        this.radius = 4;
        this.mass = 2;
        this.pullStrength /= 2;
        this.pushStrength = this.pullStrength;
        this.magnetStatus = this.pullStrength;
        this.disabledTimer = 120;
        this.slowDownFactor = 1;
        this.shieldTime = 75;
        this.maxShieldTime = 150;
        this.maxShieldRadius = 16;
        this.shieldRadius = 0;
        this.recovery = 4;
    }

    update() {
        this.magnetStatus = this.pullStrength;
        if (this.shieldTime <= 0) {
            this.shieldRadius = 0;
            this.magnetStatus = 0;
        }
        this.shieldTime += this.recovery - Math.sqrt(this.shieldRadius) - this.magnetStatus;
        if (this.shieldTime <= 0) {
            this.shieldTime = -20;
            this.shieldRadius = 0;
        } else if (this.shieldTime >= this.maxShieldTime) {
            this.shieldTime = this.maxShieldTime;
        }

        super.update();
    }

    setMagnetDisabled() {
        this.magnetStatus = this.pullStrength;
    }

    draw() {
        fill(0, 0, 255, 100);
        stroke(0, 0, 255);
        ellipse(this.pos.x, this.pos.y, this.shieldRadius * 2, this.shieldRadius * 2);
        super.draw();
    }

    shield(radius) {
        if (radius <= this.maxShieldRadius - this.radius && this.shieldTime > 0 && !this.disabled) this.shieldRadius = radius + this.radius;
        else this.shieldRadius = 0;
    }

    disableShield() {
        this.shieldRadius = 0;
    }

    disable(factor, enemy) {
        if (this.shieldRadius <= this.radius || enemy.player === this.player)
            super.disable(factor);
    }

    getRadius(obj) {
        if (obj === undefined || obj.player === undefined || obj.player === this.player || this.shieldTime <= 0)
            return super.getRadius();
        else {
            return Math.max(this.shieldRadius, this.radius);
        }
    }
}