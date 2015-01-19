(function() {
  function Physics(options) {
    if (!(this instanceof Physics)) {
      return new Physics(options);
    }

    this.setPosition(options.x || 0, options.y || 0, options.z || 0);
    this.setVelocity(options.vx || 0, options.vy || 0, options.vz || 0);
    this.setAcceleration(options.ax || 0, options.ay || 0, options.az || 0);
    this.setInitialValues();
  }

  _.extend(Physics.prototype, {
    setInitialValues: function() {
      this.x0 = this.x;
      this.y0 = this.y;
      this.z0 = this.z;

      this.vx0 = this.vx;
      this.vy0 = this.vy;
      this.vz0 = this.vz;

      this.ax0 = this.ax;
      this.ay0 = this.ay;
      this.az0 = this.az;
    },

    setPosition: function(x, y, z) {
      this.x = _.isNumber(x) ? x : this.x;
      this.y = _.isNumber(y) ? y : this.y;
      this.z = _.isNumber(z) ? z : this.z;
    },

    addPosition: function(dx, dy, dz) {
      this.x += _.isNumber(dx) ? dx : 0;
      this.y += _.isNumber(dy) ? dy : 0;
      this.z += _.isNumber(dz) ? dz : 0;
    },

    setVelocity: function(vx, vy, vz) {
      this.vx = _.isNumber(vx) ? vx : this.vx;
      this.vy = _.isNumber(vy) ? vy : this.vy;
      this.vz = _.isNumber(vz) ? vz : this.vz;
    },

    addVelocity: function(dvx, dvy, dvz) {
      this.vx += _.isNumber(dvx) ? dvx : 0;
      this.vy += _.isNumber(dvy) ? dvy : 0;
      this.vz += _.isNumber(dvz) ? dvz : 0;
    },

    setAcceleration: function(ax, ay, az) {
      this.ax = _.isNumber(ax) ? ax : this.ax;
      this.ay = _.isNumber(ay) ? ay : this.ay;
      this.az = _.isNumber(az) ? az : this.az;
    },

    addAcceleration: function(dax, day, daz) {
      this.ax += _.isNumber(dax) ? dax : 0;
      this.ay += _.isNumber(day) ? day : 0;
      this.az += _.isNumber(daz) ? daz : 0;
    },

    direct: function(options) {
      options = options || {};

      // TODO: not sure what to do with acceleration when "bouncing" off a wall

      if (options.left) {
        this.vx = Math.abs(this.vx) * -1;
        this.ax = Math.abs(this.ax) * -1;
      }

      if (options.right) {
        this.vx = Math.abs(this.vx);
        this.ax = Math.abs(this.ax);
      }

      if (options.up) {
        this.vy = Math.abs(this.vy) * -1;
        this.ay = Math.abs(this.ay) * -1;
      }

      if (options.down) {
        this.vy = Math.abs(this.vy);
        this.ay = Math.abs(this.ay);
      }

      if (options.away) {
        this.vz = Math.abs(this.vz) * -1;
        this.az = Math.abs(this.az) * -1;
      }

      if (options.towards) {
        this.vz = Math.abs(this.vz);
        this.az = Math.abs(this.az);
      }
    },

    tick: function(dt) {
      this.addVelocity(this.ax * dt, this.ay * dt, this.az * dt);
      this.addPosition(this.vx * dt, this.vy * dt, this.vz * dt);
    }
  });

  app.Physics = Physics;
}());
