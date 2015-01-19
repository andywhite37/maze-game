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

      if (this.collision.active) {
        this.graphics.setFillStyle("blue");
      }

      this.graphics.fillCircle(
        this.physics.x + this.appearance.radius,
        this.physics.y + this.appearance.radius,
        this.appearance.radius);
    },

    getHitbox: function() {
      var diameter = 2 * this.appearance.radius;
      return {
        left: this.physics.x,
        right: this.physics.x + diameter,
        top: this.physics.y,
        bottom: this.physics.y + diameter,
        width: diameter,
        height: diameter
      };
    }
  });

  app.Ball = Ball;
}(app || {}));
