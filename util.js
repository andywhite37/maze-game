var app = {};

app.util = {
  intersects: function(r1, r2) {
    return r1.left <= r2.right &&
      r2.left <= r1.right &&
      r1.top <= r2.bottom &&
      r2.top <= r1.bottom;
  }
};
