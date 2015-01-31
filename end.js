(function() {
  function End(options) {
    this.x = options.x;
    this.y = options.y;
    this.radius = options.radius || 500;
    this.currentRadius = 0;
    this.graphics = options.graphics;
  }

  _.extend(End.prototype, {
    update: function(dt) {
      if (!this.isExploding) {
        this.currentRadius += dt * 50;
        if (this.currentRadius > this.radius) {
          this.currentRadius = 0;
        }
      } else {
        if (!this.particles) {
          this.particles = _.map(_.range(1000), function() {
            return {
              x: this.x,
              y: this.y,
              angle: Math.random() * Math.PI * 2,
              radius: Math.random() * 20 + 5,
              r: Math.floor(Math.random() * 255),
              g: Math.floor(Math.random() * 255),
              b: Math.floor(Math.random() * 255),
              a: Math.random(),
              speed: Math.random() * 10 + 5
            };
          }, this);
        }

        _.each(this.particles, function(particle) {
          particle.x += Math.cos(particle.angle) * Math.random() * particle.speed;
          particle.y += Math.sin(particle.angle) * Math.random() * particle.speed;
          particle.radius = Math.random() * 20 + 5;
          particle.r = Math.floor(Math.random() * 255);
          particle.g = Math.floor(Math.random() * 255);
          particle.b = Math.floor(Math.random() * 255);
          particle.a = Math.random();
        }, this);

        if (this.currentRadius < 40000) {
          this.currentRadius += dt * 1000;
        }
      }
    },

    render: function(dt) {
      this.graphics.save();

      var gradient = this.graphics.context.createRadialGradient(this.x, this.y, this.currentRadius, this.x, this.y, 0);

      if (this.isExploding) {
        gradient.addColorStop(0, "red");
        gradient.addColorStop(0.1, "orange");
        gradient.addColorStop(0.2, "yellow");
        gradient.addColorStop(0.3, "green");
        gradient.addColorStop(0.4, "blue");
        gradient.addColorStop(0.5, "purple");
        gradient.addColorStop(0.6, "purple");
        gradient.addColorStop(0.7, "red");
        gradient.addColorStop(0.8, "orange");
        gradient.addColorStop(0.9, "yellow");
      } else {
        gradient.addColorStop(0, "green");
      }

      gradient.addColorStop(1, "transparent");

      this.graphics.setFillStyle(gradient);
      this.graphics.setStrokeStyle("transparent");

      this.graphics.fillCircle(this.x, this.y, this.currentRadius);
      this.graphics.fillCircle(this.x, this.y, this.currentRadius / 2);

      if (this.particles) {
        _.each(this.particles, function(particle) {
          this.graphics.setFillStyle("rgba(" + particle.r + "," + particle.g + "," + particle.b + "," + particle.a + ")");
          this.graphics.setStrokeStyle("white");
          this.graphics.fillCircle(particle.x, particle.y, particle.radius);
        }, this);
      }

      this.graphics.restore();
    },

    getHitbox: function() {
      var left = this.x - this.currentRadius;
      var right = this.x + this.currentRadius;
      var top = this.y - this.currentRadius;
      var bottom = this.y + this.currentRadius;
      var width = right - left;
      var height = bottom - top;
      var centerX = this.x;
      var centerY = this.y;

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

  app.End = End;
}());
