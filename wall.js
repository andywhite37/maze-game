(function(app) {
  function Wall(options) {
    if (!(this instanceof Wall)) {
      return new Wall(options);
    }

    this.input = options.input;

    this.graphics = options.graphics;

    this.points = [
      new app.Physics(options.points[0]),
      new app.Physics(options.points[1])
    ];

    this.movement = _.extend({
      speed: 500,
      displacement: 40
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
      _.each(this.points, function(point) {
        if ((this.input.up() && this.input.down()) || (!this.input.up() && !this.input.down())) {
          if (point.y < point.y0) {
            point.vy = this.movement.speed;
          } else if (point.y > point.y0) {
            point.vy = -this.movement.speed;
          } else {
            point.vy = 0;
          }

          if (Math.abs(point.y - point.y0) < 20) {
            point.vy = 0;
            point.y = point.y0;
          }
        } else if (this.input.up()) {
          point.vy = -this.movement.speed;
        } else if (this.input.down()) {
          point.vy = this.movement.speed;
        }

        point.tick(dt);

        if (point.y < (point.y0 - this.movement.displacement)) {
          point.y = point.y0 - this.movement.displacement;
        }

        if (point.y > (point.y0 + this.movement.displacement)) {
          point.y = point.y0 + this.movement.displacement;
        }



        if ((this.input.left() && this.input.right()) || (!this.input.left() && !this.input.right())) {
          if (point.x < point.x0) {
            point.vx = this.movement.speed;
          } else if (point.x > point.x0) {
            point.vx = -this.movement.speed;
          } else {
            point.vx = 0;
          }

          if (Math.abs(point.x - point.x0) < 20) {
            point.vx = 0;
            point.x = point.x0;
          }
        } else if (this.input.left()) {
          point.vx = -this.movement.speed;
        } else if (this.input.right()) {
          point.vx = this.movement.speed;
        }

        point.tick(dt);

        if (point.x < (point.x0 - this.movement.displacement)) {
          point.x = point.x0 - this.movement.displacement;
        }

        if (point.x > (point.x0 + this.movement.displacement)) {
          point.x = point.x0 + this.movement.displacement;
        }
      }, this);
    },

    render: function(dt) {
      this.graphics.setStrokeStyle(this.appearance.strokeStyle);

      /*
      if (this.collision.active) {
        this.graphics.setStrokeStyle("pink");
      }
      */

      this.graphics.line(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y);
    },

    isVertical: function() {
      return this.points[0].x === this.points[1].x;
    },

    isHorizontal: function() {
      return this.points[0].y === this.points[1].y;
    },

    getHitbox: function() {
      var left = Math.min(this.points[0].x, this.points[1].x);
      var right = Math.max(this.points[0].x, this.points[1].x);
      var top = Math.min(this.points[0].y, this.points[1].y);
      var bottom = Math.max(this.points[0].y, this.points[1].y);
      var width = Math.abs(this.points[0].x - this.points[1].x);
      var height = Math.abs(this.points[0].y - this.points[1].y);
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
