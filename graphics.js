(function(app) {
  function Graphics(options) {
    if (!(this instanceof Graphics)) {
      return new Graphics(options);
    }

    // Canvas/context
    this.canvas = options.canvas;
    this.canvas.width = options.width || 800;
    this.canvas.height = options.height || 600;
    this.context = this.canvas.getContext("2d");

    // Set defailts
    this.setFont(options.font || "10pt sans-serif");
    this.setLineWidth(options.lineWidth || 1);
    this.setStrokeStyle(options.strokeStyle || "black");
    this.setFillStyle(options.fillStyle || "gray");
  }

  _.extend(Graphics.prototype, {
    setFont: function(font) {
      this.context.font = font;
    },

    setLineWidth: function(lineWidth) {
      this.context.lineWidth = lineWidth;
    },

    setStrokeStyle: function(strokeStyle) {
      this.context.strokeStyle = strokeStyle;
    },

    setFillStyle: function(fillStyle) {
      this.context.fillStyle = fillStyle;
    },

    clear: function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    rect: function(x, y, w, h) {
      this.context.rect(x, y, w, h);
      this.context.stroke();
    },

    fillRect: function(x, y, w, h) {
      this.context.fillRect(x, y, w, h);
    },

    line: function(x1, y1, x2, y2) {
      this.context.beginPath();
      this.context.moveTo(x1, y1);
      this.context.lineTo(x2, y2);
      this.context.stroke();
    },

    circle: function() {
      throw new Error("not implemented");
    },

    fillCircle: function(centerX, centerY, radius) {
      this.context.beginPath();
      this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      this.context.fill();
      this.context.stroke();
    },

    text: function(message, x, y) {
      this.context.fillText(message, x, y);
    }
  });

  app.Graphics = Graphics;
}(app || {}));
