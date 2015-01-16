(function() {
  var mazes = {
    easy: [
      "tlre t    t    t    t    t    t    t    t    tr   ",
      "lr   -    -    -    -    -    -    -    -    r    ",
      "lr   -    -    -    -    -    -    -    -    r    ",
      "lb   r    b    -    -    -    -    -    -    r    ",
      "l    -    -    -    -    -    -    -    -    r    ",
      "l    -    -    -    -    tblr -    -    -    r    ",
      "l    -    -    -    -    -    -    -    -    r    ",
      "l    -    -    -    -    -    -    -    -    r    ",
      "l    -    -    -    -    -    -    -    -    r    ",
      "l    -    -    -    -    -    -    -    -    r    ",
      "lb   b    b    b    b    b    b    b    b    brs  "
    ]
  };

  function Maze(options) {
    this.width = options.width;
    this.height = options.height;

    this.marginLeft = (app.width - this.width) / 2;
    this.marginTop = (app.height - this.height) / 2;

    this.x = this.marginLeft;
    this.y = this.marginTop;

    this.bumpOffset = 0;

    this.type = options.type;

    this.load();
  }

  Maze.prototype.update = function(dt) {
    // Update the maze

    // Update the cells
    this.rows.forEach(function(columns) {
      columns.forEach(function(cell) {
        cell.update(dt);
      });
    });
  };

  Maze.prototype.render = function(dt) {
    app.graphics.fillStyle("red");
    app.graphics.rect(this.x, this.y, this.width, this.height);

    // Render the cells
    this.rows.forEach(function(columns) {
      columns.forEach(function(cell) {
        cell.render(dt);
      });
    });
  };

  Maze.prototype.hitbox = function() {
    return {
      top: this.y,
      bottom: this.y + this.height,
      left: this.x,
      right: this.x + this.width,
      width: this.width,
      height: this.height
    };
  };

  Maze.prototype.load = function() {
    this.rows = [];

    var rowStrings = mazes[this.type];
    this.rowCount = rowStrings.length;

    rowStrings.forEach(function(rowString, rowIndex) {

      var cellStrings = rowString.split(" ")
        .filter(function(str) {
          return str.length > 0;
        });

      var columns = [];
      this.columnCount = cellStrings.length;

      cellStrings.forEach(function(cellString, columnIndex) {
        var top = cellString.indexOf("t") >= 0;
        var bottom = cellString.indexOf("b") >= 0;
        var left = cellString.indexOf("l") >= 0;
        var right = cellString.indexOf("r") >= 0;

        var width = this.width / this.columnCount;
        var height = this.height / this.rowCount;

        var start = cellString.indexOf("s") >= 0;
        var end = cellString.indexOf("e") >= 0;

        var cell = new app.Cell({
          marginLeft: this.marginLeft,
          marginTop: this.marginTop,

          row: rowIndex,
          column: columnIndex,

          top: top,
          bottom: bottom,
          left: left,
          right: right,

          width: width,
          height: height,

          start: start,
          end: end
        });

        columns.push(cell);
      }, this); // end each cell

      this.rows.push(columns);
    }, this); // end each row

    console.log("Loaded maze: ", this.type, this.rows);
  };

  app.Maze = Maze;
}());
