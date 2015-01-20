(function(app) {
  function Wall(options) {
    if (!(this instanceof Wall)) {
      return new Wall(options);
    }

    this.input = options.input;

    this.graphics = options.graphics;

    this.physics1 = new app.Physics(options.physics1);

    this.physics2 = new app.Physics(options.physics2);

    this.movement = _.extend({
      speed: 10
    }, options.movement);

    this.collision = _.extend({
      horizontal: false,
      vertical: false,
      active: false
    }, options.collision);

    this.appearance = _.extend({
      strokeStyle: "black"
    }, options.appearance);
  }

  _.extend(Wall.prototype, {
    update: function(dt) {
      this.physics1.tick(dt);
      this.physics2.tick(dt);
    },

    render: function(dt) {
      this.graphics.setStrokeStyle(this.appearance.strokeStyle);

      /*
      if (this.collision.active) {
        this.graphics.setStrokeStyle("pink");
      }
      */

      this.graphics.line(this.physics1.x, this.physics1.y, this.physics2.x, this.physics2.y);
    },

    isVertical: function() {
      return this.physics1.x === this.physics2.x;
    },

    isHorizontal: function() {
      return this.physics1.y === this.physics2.y;
    },

    getHitbox: function() {
      var left = Math.min(this.physics1.x, this.physics2.x);
      var right = Math.max(this.physics1.x, this.physics2.x);
      var top = Math.min(this.physics1.y, this.physics2.y);
      var bottom = Math.max(this.physics1.y, this.physics2.y);
      var width = Math.abs(this.physics1.x - this.physics2.x);
      var height = Math.abs(this.physics1.y - this.physics2.y);
      var centerX = left + 0.5 * width;
      var centerY = top + 0.5 * height;

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
    }
  });

  app.Wall = Wall;
}(app || {}));
