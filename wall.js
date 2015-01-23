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
      lineWidth: 3,
      strokeStyle: "red"
    }, options.appearance);
  }

  _.extend(Wall.prototype, {
    update: function(dt) {
      _.each(this.points, function(point) {
        if ((this.input.up() && this.input.down()) || (!this.input.up() && !this.input.down())) {
          // No keys pressed, or both up and down pressed
          if (point.y < point.y0) {
            // If maze is moved up, set velocity to move it back down to origin
            point.setVY(this.movement.speed);
          } else if (point.y > point.y0) {
            // If maze is moved down, set velocity to move it back up to origin
            point.setVY(-this.movement.speed);
          } else {
            // Maze currently at origin, set velocity to 0
            point.setVY(0);
          }

          // Maze jitters due to math errors.  If it is within 20 pixels of origin, move it to origin
          if (Math.abs(point.y - point.y0) < 10) {
            point.setVY(0);
            point.setY(point.y0);
          }
        } else if (this.input.up()) {
          point.setVY(-this.movement.speed);
        } else if (this.input.down()) {
          point.setVY(this.movement.speed);
        }

        point.tick(dt);

        // Prevent maze from moving more than displacement
        if (point.y < (point.y0 - this.movement.displacement)) {
          point.setY(point.y0 - this.movement.displacement);
        }

        if (point.y > (point.y0 + this.movement.displacement)) {
          point.setY(point.y0 + this.movement.displacement);
        }



        if ((this.input.left() && this.input.right()) || (!this.input.left() && !this.input.right())) {
          if (point.x < point.x0) {
            point.setVX(this.movement.speed);
          } else if (point.x > point.x0) {
            point.setVX(-this.movement.speed);
          } else {
            point.setVX(0);
          }

          if (Math.abs(point.x - point.x0) < 10) {
            point.setVX(0);
            point.setX(point.x0);
          }
        } else if (this.input.left()) {
          point.setVX(-this.movement.speed);
        } else if (this.input.right()) {
          point.setVX(this.movement.speed);
        }

        point.tick(dt);

        if (point.x < (point.x0 - this.movement.displacement)) {
          point.setX(point.x0 - this.movement.displacement);
        }

        if (point.x > (point.x0 + this.movement.displacement)) {
          point.setX(point.x0 + this.movement.displacement);
        }
      }, this);
    },

    render: function(dt) {
      this.graphics.context.save();
      this.graphics.setLineWidth(this.appearance.lineWidth);
      this.graphics.setStrokeStyle(this.appearance.strokeStyle);
      this.graphics.context.shadowBlur = 50;
      this.graphics.context.shadowColor = "red";
      this.graphics.line(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y);
      this.graphics.context.restore();
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
      var width = right - left;
      var height = bottom - top;
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
    },

    getHitboxLast: function() {
      var left = Math.min(this.points[0].xLast, this.points[1].xLast);
      var right = Math.max(this.points[0].xLast, this.points[1].xLast);
      var top = Math.min(this.points[0].yLast, this.points[1].yLast);
      var bottom = Math.max(this.points[0].yLast, this.points[1].yLast);
      var width = right - left;
      var height = bottom - top;
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
    },

    getHitboxUnion: function() {
      return app.util.union(this.getHitbox(), this.getHitboxLast());
    }
  });

  app.Wall = Wall;
}(app || {}));
