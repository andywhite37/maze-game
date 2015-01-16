(function() {
  function Ball(options) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.radius = options.radius || 5;
  }

  Ball.prototype.update = function(dt) {
    this.x = this.x + this.vx * dt;
    this.y = this.y + this.vy * dt;
  };

  Ball.prototype.render = function(dt) {
    app.graphics.fillStyle("orange");
    app.graphics.fillCircle(this.x - this.radius, this.y - this.radius, this.radius);
  };

  app.Ball = Ball;
}());
