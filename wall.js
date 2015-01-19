(function(app) {
  function Wall(options) {
    if (!(this instanceof Wall)) {
      return new Wall(options);
    }

    this.physics = new app.Physics(options.physics);

    this.input = options.input;

    this.graphics = options.graphics;

    this.movement = _.extend({
      speed: 10
    }, options.movement);

    this.collision = _.extend({
      horizontal: false,
      vertical: false,
      active: false
    }, options.collision);

    this.appearance = _.extend({
      width: 0,
      height: 0,
      strokeStyle: "black",
      fillStyle: "black"
    }, options.appearance);
  }

  _.extend(Wall.prototype, {
    update: function(dt) {
      if (this.input.up() && this.input.down()) {
        this.physics.vy = 0;
      } else {
        if (this.input.up()) {
          this.physics.vy = -this.movement.speed;
        }

        if (this.input.down()) {
          this.physics.vy = this.movement.speed;
        }
      }

      this.physics.tick(dt);
    },

    render: function(dt) {
      this.graphics.setStrokeStyle(this.appearance.strokeStyle);
      this.graphics.setFillStyle(this.appearance.fillStyle);

      if (this.collision.active) {
        this.graphics.setStrokeStyle("pink");
        this.graphics.setFillStyle("pink");
      }

      this.graphics.fillRect(this.physics.x, this.physics.y, this.appearance.width, this.appearance.height);
    },

    getHitbox: function() {
      return {
        left: this.physics.x,
        right: this.physics.x + this.appearance.width,
        top: this.physics.y,
        bottom: this.physics.y + this.appearance.height,
        width: this.appearance.width,
        height: this.appearance.height
      };
    }
  });

  app.Wall = Wall;
}(app || {}));
