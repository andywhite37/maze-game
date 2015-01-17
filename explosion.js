(function() {
  function Explosion(options) {
    this.centerX = options.centerX;
    this.centerY = options.centerY;
    this.radius = options.radius || 0;
    this.endRadius = options.radius || 100;
    this.velocity = options.velocity || 10;
  }

  Explosion.prototype.update = function(dt) {
    this.radius += this.velocity * dt;
  };

  Explosion.prototype.render = function(dt) {
    if (this.radius > 0.75 * this.endRadius) {
    }
    if (this.radius > 0.5 * this.endRa

  };

  app.Explosion = Explosion;
}());
