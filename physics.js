(function() {
  function Physics(options) {
    if (!(this instanceof Physics)) {
      return new Physics(options);
    }

    options = _.extend({}, this.defaultOptions, options);

    this.setPosition(options.x, options.y, options.z);
    this.x0 = this.x;
    this.y0 = this.y;
    this.z0 = this.z;

    this.setVelocity(options.vx, options.vy, options.vz);
    this.vx0 = this.vx;
    this.vy0 = this.vy;
    this.vz0 = this.vz;

    this.setAcceleration(options.ax, options.ay, options.az);
    this.ax0 = this.ax;
    this.ay0 = this.ay;
    this.az0 = this.az;
  }

  _.each(["x", "y", "z"], function(dim) {
    var Dim = dim.toUpperCase();

    Physics.prototype["set" + Dim] = function(val) {
      this[dim + "Last"] = this[dim];
      this[dim] = val;
    };

    Physics.prototype["setV" + Dim] = function(val) {
      this["v" + dim + "Last"] = this["v" + dim];
      this["v" + dim] = val;
    };

    Physics.prototype["setA" + Dim] = function(val) {
      this["a" + dim + "Last"] = this["a" + dim];
      this["a" + dim] = val;
    };
  });

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

    setPosition: function(x, y, z) {
      this.setX(x);
      this.setY(y);
      this.setZ(z);
    },

    setVelocity: function(vx, vy, vz) {
      this.setVX(vx);
      this.setVY(vy);
      this.setVZ(vz);
    },

    setAcceleration: function(ax, ay, az) {
      this.setAX(ax);
      this.setAY(ay);
      this.setAZ(az);
    },

    tick: function(dt) {
      this.setVelocity(
        this.vx + this.ax * dt,
        this.vy + this.ay * dt,
        this.vz + this.az * dt
      );

      this.setPosition(
        this.x + this.vx * dt,
        this.y + this.vy * dt,
        this.z + this.vz * dt
      );
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
