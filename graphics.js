(function() {
  var graphics = {
    init: function() {
      this.font();
      this.lineWidth();
      this.strokeStyle();
      this.strokeStyle();
    },

    font: function(font) {
      app.context.font = font || "10pt sans-serif";
    },

    lineWidth: function(width) {
      app.context.lineWidth = width || 1;
    },

    strokeStyle: function(style) {
      app.context.strokeStyle = style || "black";
    },

    fillStyle: function(style) {
      app.context.fillStyle = style || "orange";
    },

    clear: function() {
      app.context.clearRect(0, 0, app.width, app.height);
    },

    rect: function(x, y, w, h) {
      app.context.rect(x, y, w, h);
      app.context.stroke();
    },

    fillRect: function(x, y, w, h) {
      app.context.fillRect(x, y, w, h);
    },

    line: function(x1, y1, x2, y2) {
      app.context.beginPath();
      app.context.moveTo(x1, y1);
      app.context.lineTo(x2, y2);
      app.context.stroke();
    },

    circle: function() {
      throw new Error("not implemented");
    },

    fillCircle: function(centerX, centerY, radius) {
      app.context.beginPath();
      app.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      app.context.fill();
      app.context.stroke();
    },

    text: function(message, x, y) {
      app.context.fillText(message, x, y);
    }
  };

  app.graphics = graphics;
}());
