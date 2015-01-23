var app = {};

app.util = {
  intersects: function(r1, r2) {
    return r1.left <= r2.right &&
      r2.left <= r1.right &&
      r1.top <= r2.bottom &&
      r2.top <= r1.bottom;
  },

  union: function(r1, r2) {
    var left = Math.min(r1.left, r2.left);
    var right = Math.max(r1.right, r2.right);
    var top = Math.min(r1.top, r2.top);
    var bottom = Math.max(r1.bottom, r2.bottom);
    var width = right - left;
    var height = bottom - top;
    var centerX = left + width / 2;
    var centerY = top + height / 2;

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
};
