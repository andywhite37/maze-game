(function() {
  function Ball(options) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.radius = options.radius || 5;
  }

  Ball.prototype.update = function(dt) {
    this.addXY(this.vx * dt, this.vy * dt);
  };

  Ball.prototype.addX = function(dx) {
    this.x += dx;
  };

  Ball.prototype.addY = function(dy) {
    this.y += dy;
  };

  Ball.prototype.addXY = function(dx, dy) {
    this.addX(dx);
    this.addY(dy);
  };

  Ball.prototype.moveLeft = function() {
    this.vx = Math.abs(this.vx) * -1;
  };

  Ball.prototype.moveRight = function() {
    this.vx = Math.abs(this.vx);
  };

  Ball.prototype.moveUp = function() {
    this.vy = Math.abs(this.vy) * -1;
  };

  Ball.prototype.moveDown = function() {
    this.vy = Math.abs(this.vy);
  };

  Ball.prototype.hitbox = function() {
    var size = 2 * this.radius;
    return {
      top: this.y,
      bottom: this.y + size,
      left: this.x,
      right: this.x + size,
      size: size
    };
  };

  Ball.prototype.render = function(dt) {
    var color  = "orange";
    if (app.input.down()) {
      color = "blue";
    } else if (app.input.up()) {
      color = "green";
    } else if (app.input.left()) {
      color = "pink";
    } else if (app.input.right()) {
      color = "purple";
    }
    app.graphics.fillStyle(color);
    app.graphics.fillCircle(this.x + this.radius, this.y + this.radius, this.radius);
  };

  app.Ball = Ball;
}());
