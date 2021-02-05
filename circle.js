class Circle {
    constructor(game, x, y, velocity, mass, maxSpeed) {
        Object.assign(this, { game, x, y, velocity, mass, maxSpeed });

        this.points = [{ x: this.x, y: this.y }];
        this.radius = Math.ceil(Math.sqrt(this.mass / Math.PI));

        this.testSpeed();
    };

    testSpeed() {
        var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (this.maxSpeed !== false && speed > this.maxSpeed) {
            var ratio = this.maxSpeed / speed;
            this.velocity.x *= ratio;
            this.velocity.y *= ratio;
        }
    };

    collide(other) {
        return distance(this, other) < this.radius + other.radius;
    };

    move() {
        // move
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    };

    update() {
        this.points.push({ x: this.x, y: this.y });
        // collision with other circles
        for (var i = 0; i < this.game.entities.length && this.game.entities[i] !== this; i++) {
            var ent = this.game.entities[i];
            if (this.collide(ent)) {

                // push away from each other
                //var dist = distance(this, ent);
                //var delta = this.radius + ent.radius - dist;
                //var difX = (this.x - ent.x) / dist;
                //var difY = (this.y - ent.y) / dist;

                //this.x += difX * delta / 2;
                //this.y += difY * delta / 2;
                //ent.x -= difX * delta / 2;
                //ent.y -= difY * delta / 2;

                // swap velocities
                var totalMass = this.mass + ent.mass;

                var temp = { x: this.velocity.x, y: this.velocity.y };
                this.velocity.x = ((this.mass - ent.mass) * this.velocity.x + 2 * ent.mass * ent.velocity.x) / totalMass * PARAMS.FRICTION;
                this.velocity.y = ((this.mass - ent.mass) * this.velocity.y + 2 * ent.mass * ent.velocity.y) / totalMass * PARAMS.FRICTION;
                ent.velocity.x = (2 * this.mass * temp.x + (ent.mass - this.mass) * ent.velocity.x) / totalMass * PARAMS.FRICTION;
                ent.velocity.y = (2 * this.mass * temp.y + (ent.mass - this.mass) * ent.velocity.y) / totalMass * PARAMS.FRICTION;
            }
        }

        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent !== this && !(ent instanceof Center)) {
                var dist = distance(this, ent);
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x += difX * PARAMS.ACCELERATION / (dist * dist) * ent.mass;
                this.velocity.y += difY * PARAMS.ACCELERATION / (dist * dist) * ent.mass;
            }
        }
        this.testSpeed();

        this.velocity.x -= (1 - PARAMS.FRICTION) * this.game.clockTick * this.velocity.x;
        this.velocity.y -= (1 - PARAMS.FRICTION) * this.game.clockTick * this.velocity.y;

    };

    draw(ctx) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.fillStyle = "White";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        if (document.getElementById("visual").checked) {
            var max = 1000;

            if (this.points.length > max) this.points.splice(0,1);
            for (var i = 0; i < this.points.length; i++) {
                ctx.beginPath();
                ctx.fillStyle = "Red";
                var point = this.points[this.points.length - 1 - i];
                ctx.arc(point.x, point.y, 1, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.closePath();
            }
        }
    };

};

class Center {
    constructor(game) {
        Object.assign(this, { game });

        this.x = 0;
        this.y = 0;

        this.size = 25;
    };

    move() { };

    update() {
        var point = { x: 0, y: 0 };
        var total = 0;
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (this !== ent) {
                total += ent.mass;
                point.x += ent.x * ent.mass;
                point.y += ent.y * ent.mass;
            }
        }
        this.x = point.x / total;
        this.y = point.y / total;
    };

    draw(ctx) {
        ctx.beginPath()
        ctx.strokeStyle = "LightBlue";
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.moveTo(this.x - this.size, this.y);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.stroke();
    };
};
