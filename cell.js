(function() {
  function Cell(options) {
    this.marginLeft = options.marginLeft;
    this.marginTop = options.marginTop;

    this.row = options.row;
    this.column = options.column;

    this.top = options.top;
    this.bottom = options.bottom;
    this.left = options.left;
    this.right = options.right;

    this.width = options.width;
    this.height = options.height;

    this.start = options.start;
    this.end = options.end;

    this.x = this.marginLeft + this.column * this.width;
    this.y = this.marginTop + this.row * this.height;
  }

  Cell.prototype.update = function(dt) {
  };

  Cell.prototype.render = function(dt) {
    if (this.top) {
      app.graphics.line(this.x, this.y, this.x + this.width, this.y);
    }

    if (this.bottom) {
      app.graphics.line(this.x, this.y + this.height, this.x + this.width, this.y + this.height);
    }

    if (this.left) {
      app.graphics.line(this.x, this.y, this.x, this.y + this.height);
    }

    if (this.right) {
      app.graphics.line(this.x + this.width, this.y, this.x + this.width, this.y + this.height);
    }
  };

  app.Cell = Cell;
}());
