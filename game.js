(function(app) {
  // Global settings
  var width = 800; // canvas width
  var height = 800; // canvas height
  var mazeScaleFactor = 0.75;
  var mazeWidth = width * mazeScaleFactor;
  var mazeHeight = height * mazeScaleFactor;
  var mazeX = (width - mazeWidth) / 2;
  var mazeY = (height - mazeHeight) / 2;

  // Game loop variables
  var fps = 60;
  var step = 1 / fps;
  var now;
  var last;
  var dt;

  // Game objects
  var ball;
  var walls;

  // Other/utilities
  var fpsMeter;
  var canvas;
  var graphics;
  var input;

  function timestamp() {
    return performance.now();
  }

  function loop() {
    fpsMeter.tickStart();
    now = timestamp();

    dt += ((now - last) / 1000);

    while (dt > step) {
      dt -= step;
      update(step);
    }

    render(dt);

    last = now;
    fpsMeter.tick();
    requestAnimationFrame(loop);
  }

  function update(dt) {
    ball.update(dt);

    _.each(walls, function(wall) {
      wall.update(dt);
    });

    checkCollisions(dt);
  }

  function checkCollisions(dt) {
    var bh = ball.getHitbox();

    var isBallMovingLeft = ball.physics.vx < 0;
    var isBallMovingRight = ball.physics.vx > 0;
    var isBallMovingUp = ball.physics.vy < 0;
    var isBallMovingDown = ball.physics.vy > 0;
    var radius = ball.appearance.radius;

    var direct = _.reduce(walls, function(directAcc, wall) {
      var wh = wall.getHitbox();

      var isBallVerticallyAlignedWithWall = wh.top <= bh.top + radius && bh.top + radius <= wh.bottom;
      var isBallCollidingOnLeft = wh.left <= bh.left && bh.left <= wh.right;
      var isBallCollidingOnRight = wh.left <= bh.right && bh.right <= wh.right;

      var isBallHorizontallyAlignedWithWall = wh.left <= bh.left + radius && bh.left + radius <= wh.right;
      var isBallCollidingOnTop = wh.top <= bh.top && bh.top <= wh.bottom;
      var isBallCollidingOnBottom = wh.top <= bh.bottom && bh.bottom <= wh.bottom;

      var isColliding = false;

      // Ball moving left (-vx)
      if (isBallMovingLeft && isBallVerticallyAlignedWithWall && isBallCollidingOnLeft) {
        isColliding = true;
        directAcc.right = true;
      }

      // Ball moving right (+vx)
      if (isBallMovingRight && isBallVerticallyAlignedWithWall && isBallCollidingOnRight) {
        isColliding = true;
        directAcc.left = true;
      }

      // Ball moving up (-vy)
      if (isBallMovingUp && isBallHorizontallyAlignedWithWall && isBallCollidingOnTop) {
        isColliding = true;
        directAcc.down = true;
      }

      // Ball moving down (+vy)
      if (isBallMovingDown && isBallHorizontallyAlignedWithWall && isBallCollidingOnBottom) {
        isColliding = true;
        directAcc.up = true;
      }

      wall.collision.active = isColliding;

      return directAcc;
    }, {});

    if (_.isEmpty(direct)) {
      ball.collision.active = false;
    } else {
      ball.collision.active = true;
      ball.physics.direct(direct);
    }
  }

  function render(dt) {
    clear();

    ball.render(dt);

    _.each(walls, function(wall) {
      wall.render(dt);
    });
  }

  function clear() {
    //graphics.clear();
    var padding = 2;
    graphics.setFillStyle("white");
    graphics.fillRect(padding, padding, width - 2 * padding, height - 2 * padding);
  }

  function ready() {
    // Game loop/environment settings
    fpsMeter = new FPSMeter({ decimals: 0, graph: true, theme: "dark" });

    canvas = document.getElementById("game-canvas");

    graphics = new app.Graphics({
      canvas: canvas,
      width: width,
      height: height
    });

    input = new app.Input();

    ball = createBall(mazeX, mazeY, mazeWidth, mazeHeight);
    walls = createWalls(mazeX, mazeY, mazeWidth, mazeHeight);

    // Start game loop
    dt = 0;
    last = timestamp();
    requestAnimationFrame(loop);
  }

  function createBall() {
    return new app.Ball({
      graphics: graphics,
      physics: {
        x: mazeX + mazeWidth - 50,
        y: mazeY + mazeHeight - 50,
        vx: 200,
        vy: 400
      },
      appearance: {
        radius: 10,
        strokeStyle: "black",
        fillStyle: "orange"
      }
    });
  }

  function createWalls() {
    // x, y, w, h
    // All values expressed as values from 0 to 1.  E.g. [0.5, 0.5, 0.1, 0.5]
    // would be a wall starting in the center of the maze with a width of 10% of the maze,
    // and a height of 50% of the maze height
    var t = 0.01;

    var coords = [
      [0, 0, t, 1], // left wall
      [1, 0, t, 1], // right wall
      [0, 0, 1, t], // top wall
      [0, 1, 1, t], // bottom wall
      [0.90, 0.10, 0.01, 0.90], // right 
      [0.10, 0.10, 0.80, 0.01], // top
      [0.10, 0.10, 0.01, 0.80], // left
      [0.10, 0.90, 0.70, 0.01], // bottom
      [0.80, 0.20, 0.01, 0.70], // right
      [0.20, 0.20, 0.60, 0.01], // top
      [0.20, 0.20, 0.01, 0.60], // left
      [0.20, 0.80, 0.50, 0.01], // bottom
      [0.70, 0.30, 0.01, 0.50], // right
      [0.30, 0.30, 0.40, 0.01],
      [0.30, 0.30, 0.01, 0.40],
      [0.30, 0.70, 0.30, 0.01],
      [0.60, 0.40, 0.01, 0.30],
      [0.40, 0.40, 0.20, 0.01],
      [0.40, 0.40, 0.01, 0.20],
      [0.40, 0.60, 0.10, 0.01],
      [0.50, 0.50, 0.01, 0.10],
    ];

    var colors = [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple"
    ];

    return _.map(coords, function(c, index) {
      var fillStyle = colors[index % colors.length];
      var wall = new app.Wall({
        input: input,
        graphics: graphics,
        physics: {
          x: c[0] * mazeWidth + mazeX,
          y: c[1] * mazeHeight + mazeY
        },
        appearance: {
          width: c[2] * mazeWidth,
          height: c[3] * mazeHeight,
          strokeStyle: "black",
          fillStyle: fillStyle
        }
      });

      wall.index = index;

      console.log("Wall (%s, %s) %s x %s",
        wall.physics.x,
        wall.physics.y,
        wall.appearance.width,
        wall.appearance.height);

      return wall;
    });
  }

  $(ready);
}(app || {}));
