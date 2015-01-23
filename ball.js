(function(app) {
  function Ball(options) {
    if (!(this instanceof Ball)) {
      return new Ball(options);
    }

    this.physics = new app.Physics(options.physics);

    this.input = options.input;

    this.graphics = options.graphics;

    this.collision = _.extend({
      active: false
    }, options.collision);

    this.appearance = _.extend({
      radius: 5,
      strokeStyle: "black",
      fillStyle: "orange"
    }, options.appearance);
  }

  _.extend(Ball.prototype, {
    update: function(dt) {
      this.physics.tick(dt);
    },

    render: function(dt) {
      this.graphics.setStrokeStyle(this.appearance.strokeStyle);

      this.graphics.setFillStyle(this.appearance.fillStyle);

      this.graphics.fillCircle(
        this.physics.x + this.appearance.radius,
        this.physics.y + this.appearance.radius,
        this.appearance.radius);
    },

    getHitbox: function() {
      var radius = this.appearance.radius;
      var diameter = 2 * radius;
      var x = this.physics.x;
      var y = this.physics.y;
      var left = x;
      var right = x + diameter;
      var top = y;
      var bottom = y + diameter;
      var width = diameter;
      var height = diameter;
      var centerX = left + radius;
      var centerY = top + radius;

      return {
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        width: width,
        height: height,
        centerX: centerX,
        centerY: centerY
      };
    },

    getHitboxLast: function() {
      var radius = this.appearance.radius;
      var diameter = 2 * radius;
      var x = this.physics.xLast;
      var y = this.physics.yLast;
      var left = x;
      var right = x + diameter;
      var top = y;
      var bottom = y + diameter;
      var width = diameter;
      var height = diameter;
      var centerX = left + radius;
      var centerY = top + radius;

      return {
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        width: width,
        height: height,
        centerX: centerX,
        centerY: centerY
      };
    },

    getHitboxUnion: function() {
      return app.util.union(this.getHitbox(), this.getHitboxLast());
    }
  });

  app.Ball = Ball;
}(app || {}));
