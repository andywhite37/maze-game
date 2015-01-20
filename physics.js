(function() {
  function Physics(options) {
    if (!(this instanceof Physics)) {
      return new Physics(options);
    }

    options = _.extend({}, this.defaultOptions, options);

    this.x = this.x0 = options.x;
    this.y = this.y0 = options.y;
    this.z = this.z0 = options.z;

    this.vx = this.vx0 = options.vx;
    this.vy = this.vy0 = options.vy;
    this.vz = this.vz0 = options.vz;

    this.ax = thisax0 = options.ax;
    this.ay = thisay0 = options.ay;
    this.az = thisaz0 = options.az;
  }

  _.extend(Physics.prototype, {
    defaultOptions: {
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      ax: 0,
      ay: 0,
      az: 0
    },

    tick: function(dt) {
      this.vx += this.ax * dt;
      this.vy += this.ay * dt;
      this.vz += this.az * dt;

      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.z += this.vz * dt;
    },

    isMovingLeft: function() {
      return this.vx < 0;
    },

    isMovingRight: function() {
      return this.vx > 0;
    },

    isMovingUp: function() {
      return this.vy < 0;
    },

    isMovingDown: function() {
      return this.vy > 0;
    },

    isMovingAway: function() {
      return this.vz < 0;
    },

    isMovingTowards: function() {
      return this.vz > 0;
    }
  });

  app.Physics = Physics;
}());
