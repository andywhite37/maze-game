(function() {
  function motion(v, a, dt) {
    return v * dt + 0.5 * a * dt * dt;
  }

  function PhysicsComponent(options) {
    this.location(options.x || 0, options.y || 0, options.z || 0);
    this.velocity(options.vx || 0, options.vy || 0, options.vz || 0);
    this.acceleration(options.ax || 0, options.ay || 0, options.az || 0);
  }

  PhysicsComponent.prototype.name = "physics";

  PhysicsComponent.prototype.location = function(x, y, z) {
    this.x = _.isNumber(x) ? x : this.x;
    this.y = _.isNumber(y) ? y : this.y;
    this.z = _.isNumber(z) ? z : this.z;
  };

  PhysicsComponent.prototype.move = function(dx, dy, dz) {
    this.x += _.isNumber(dx) ? dx : 0;
    this.y += _.isNumber(dy) ? dy : 0;
    this.z += _.isNumber(dz) ? dz : 0;
  };

  PhysicsComponent.prototype.tick = function(dt) {
    this.move(
      motion(this.vx, this.ax, dt),
      motion(this.vy, this.ay, dt),
      motion(this.vz, this.az, dt)
    );
  };

  PhysicsComponent.prototype.velocity = function(vx, vy, vz) {
    this.vx = _.isNumber(vx) ? vx : this.vx;
    this.vy = _.isNumber(vy) ? vy : this.vy;
    this.vz = _.isNumber(vz) ? vz : this.vz;
  };

  PhysicsComponent.prototype.acceleration = function(ax, ay, az) {
    this.ax = _.isNumber(ax) ? ax : this.ax;
    this.ay = _.isNumber(ay) ? ay : this.ay;
    this.az = _.isNumber(az) ? az : this.az;
  };

  app.PhysicsComponent = PhysicsComponent;
}());
