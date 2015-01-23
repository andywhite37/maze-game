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

  var isStarted = false;
  var elapsedTime = 0;
  var displayTime = 0;
  var score = 1000;
  var scoreText;

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

  var lastPresses = 0;

  function update(dt) {
    if ((input.down() || input.up() || input.right() || input.left()) && !isStarted) {
      isStarted = true;
      elapsedTime = 0;
    }

    if (isStarted) {
      elapsedTime += dt;
      displayTime = Math.round(elapsedTime * 10) / 10;
      score -= step;
      score -= input.presses - lastPresses;
      var displayScore = Math.round(score * 10) / 10;
      scoreText = "Score: " + displayScore + " (time: " + displayTime + ", moves: " + input.presses + ")";
      lastPresses = input.presses;
    }

    ball.update(dt);

    _.each(walls, function(wall) {
      wall.update(dt);
    });

    checkCollisions(dt);
  }

  function checkCollisions(dt) {
    var bh = ball.getHitbox();
    var bhu = ball.getHitboxUnion();

    var bounceBallLeftWall = null;
    var bounceBallRightWall = null;
    var bounceBallUpWall = null;
    var bounceBallDownWall = null;

    var vxBall = ball.physics.vx;
    var vyBall = ball.physics.vy;

    var vxWall = null;
    var vyWall = null;

    // TODO: This is terrible

    _.each(walls, function(wall) {
      var wh = wall.getHitbox();
      var whu = wall.getHitboxUnion();
      vxWall = wall.points[0].vx;
      vyWall = wall.points[0].vy;

      if (app.util.intersects(bhu, whu)) {
        // Wall is vertical and ball is vertically in-line with the wall
        if (wall.isVertical() && wh.top <= bh.centerY && bh.centerY <= wh.bottom) {
          if (vxWall > 0 || vxBall < 0) {
            bounceBallRightWall = wh;
          } else if (vxWall < 0 || vxBall > 0) {
            bounceBallLeftWall = wh;
          }
        }

        // Wall is horizontal and ball is horizontally in-line with the wall
        if (wall.isHorizontal() && wh.left <= bh.centerX && bh.centerX <= wh.right) {
          if (vyWall > 0 || vyBall < 0) {
            bounceBallDownWall = wh;
          } else if (vyWall < 0 || vyBall > 0) {
            bounceBallUpWall = wh;
          }
        }
      }
    });

    if (bounceBallLeftWall || bounceBallRightWall) {
      if (!ball.collision.activeX) {
        ball.collision.activeX = true;

        if (bounceBallLeftWall) {
          ball.physics.setX(bounceBallLeftWall.left - ball.appearance.radius * 2);
          ball.physics.setVX(Math.min(Math.abs(vxBall) * -1, vxWall));
        } else if (bounceBallRightWall) {
          ball.physics.setX(bounceBallRightWall.right);
          ball.physics.setVX(Math.max(Math.abs(vxBall), vxWall));
        }

        if (vxWall) {
          ball.physics.setVY(0);
        }
      }
    } else {
      ball.collision.activeX = false;
    }

    if (bounceBallUpWall || bounceBallDownWall) {
      if (!ball.collision.activeY) {
        ball.collision.activeY = true;

        if (bounceBallUpWall) {
          ball.physics.setY(bounceBallUpWall.top - ball.appearance.radius * 2);
          ball.physics.setVY(Math.min(Math.abs(vyBall) * -1, vyWall));
        } else if (bounceBallDownWall) {
          ball.physics.setY(bounceBallDownWall.bottom);
          ball.physics.setVY(Math.max(Math.abs(vyBall), vyWall));
        }

        if (vyWall) {
          ball.physics.vx = 0;
        }
      }
    } else {
      ball.collision.activeY = false;
    }
  }

  function render(dt) {
    clear();

    if (scoreText) {
      graphics.context.save();
      graphics.context.shadowBlur = 10;
      graphics.context.shadowColor = "red";
      graphics.setFillStyle("white");
      graphics.fillText(scoreText, 250, 30);
      graphics.context.restore();
    }

    ball.render(dt);

    _.each(walls, function(wall) {
      wall.render(dt);
    });
  }

  function clear() {
    graphics.clear();

    var padding = 2;
    graphics.setFillStyle("rgba(0, 0, 10, 0.8)");
    graphics.setStrokeStyle("black");
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
        x: mazeX + mazeWidth - 25,
        y: mazeY + mazeHeight - 25,
        vx: 0,
        vy: 0
      },
      appearance: {
        radius: 10,
        strokeStyle: "black",
        fillStyle: "orange"
      }
    });
  }

  function createWalls() {
    var coords = [
      // Bounds
      [0, 0, 1, 0], // top
      [1, 0, 1, 1], // right
      [1, 1, 0, 1], // bottom
      [0, 1, 0, 0], // left

      [0.9, 1, 0.9, 0.1], // right
      [0.9, 0.1, 0.1, 0.1], // top
      [0.1, 0.1, 0.1, 0.9], // left
      [0.1, 0.9, 0.8, 0.9], // bottom
      [0.8, 0.9, 0.8, 0.2], // right
      [0.8, 0.2, 0.2, 0.2], // top
      [0.2, 0.2, 0.2, 0.8], // left
      [0.2, 0.8, 0.7, 0.8], // bottom
      [0.7, 0.8, 0.7, 0.3], // right
      [0.7, 0.3, 0.3, 0.3], // top
      [0.3, 0.3, 0.3, 0.7], // left
      [0.3, 0.7, 0.6, 0.7], // bottom
      [0.6, 0.7, 0.6, 0.4], // right
      [0.6, 0.4, 0.4, 0.4], // top
      [0.4, 0.4, 0.4, 0.6], // left
      [0.4, 0.6, 0.5, 0.6], // bottom
      [0.5, 0.6, 0.5, 0.5], // right
    ];

    return _.map(coords, function(c, index) {
      return new app.Wall({
        input: input,
        graphics: graphics,
        points: [{
          x: c[0] * mazeWidth + mazeX,
          y: c[1] * mazeHeight + mazeY
        }, {
          x: c[2] * mazeWidth + mazeX,
          y: c[3] * mazeHeight + mazeY
        }]
      });
    });
  }

  $(ready);
}(app || {}));
