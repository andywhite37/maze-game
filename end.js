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
        if (this.currentRadius < 20000) {
          this.currentRadius += dt * 2000;
        }
      }
    },

    render: function(dt) {
      this.graphics.save();
      this.graphics.setFillStyle(this.fillStyle);
      //this.graphics.setStrokeStyle(this.strokeStyle);
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
      this.graphics.setStrokeStyle("none");
      this.graphics.setFillStyle(gradient);
      this.graphics.fillCircle(this.x, this.y, this.currentRadius);
      this.graphics.fillCircle(this.x, this.y, this.currentRadius / 2);

      if (this.isExploding) {
        _.each(_.range(1000), function(i) {
          var x = this.x + (2 * Math.random() - 1) * 3 * this.currentRadius;
          var y = this.y + (2 * Math.random() - 1) * 3 * this.currentRadius;
          this.graphics.setFillStyle("rgba(0, 0, 0, 0.5)");
          this.graphics.fillCircle(x, y, Math.random() * 10);
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
