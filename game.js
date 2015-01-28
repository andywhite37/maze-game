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

  // Other/utilities
  var fpsMeter;
  var canvas;
  var graphics;
  var input;

  // Game objects
  var maze;
  var ball;
  var walls;
  var lastPresses;
  var isStarted;
  var isStopped;
  var elapsedTime;
  var displayTime;
  var score;
  var displayScore;
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

  function update(dt) {
    if (!isStarted && (input.down() || input.up() || input.right() || input.left())) {
      isStarted = true;
      elapsedTime = 0;
    }

    if (isStarted) {
      elapsedTime += dt;
      displayTime = Math.round(elapsedTime * 10) / 10;
      score -= dt;
      score -= (input.presses - lastPresses);
      lastPresses = input.presses;
      displayScore = Math.round(score * 10) / 10;
      scoreText = "Score: " + displayScore + " (time: " + displayTime + ", moves: " + input.presses + ")";
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

    // Check if ball goes out of the maze.  This would be my fault, but we'll blame the player.
    if (bh.left > width || bh.right < 0 || bh.top > height || bh.bottom < 0) {
      stop();
    }

    var bounceBallLeftWall = null;
    var bounceBallRightWall = null;
    var bounceBallUpWall = null;
    var bounceBallDownWall = null;

    var vxBall = ball.physics.vx;
    var vyBall = ball.physics.vy;

    _.each(walls, function(wall) {
      var wh = wall.getHitbox();
      var whu = wall.getHitboxUnion();

      var vxWall = wall.points[0].vx;
      var vyWall = wall.points[0].vy;
      var vxWallLast = wall.points[0].vxLast;
      var vyWallLast = wall.points[0].vyLast;

      // See if the ball would have hit the wall between the last tick and this tick
      if (app.util.intersects(bhu, whu)) {
        console.log("intersect", wall.points[0]);

        // Wall is vertical and ball is vertically in-line with the wall
        if (!bounceBallRightWall && !bounceBallLeftWall && wall.isVertical() && whu.top < bhu.bottom && whu.bottom > bhu.top) {
          if (vxWall > 0 || vxBall < 0) {
            // Wall is moving right or ball is moving left -> bounce ball right
            bounceBallRightWall = wh;
            bounceBallRightWall.vx = vxWall;
            bounceBallRightWall.vxLast = vxWallLast;
          } else if (vxWall < 0 || vxBall > 0) {
            // Wall is moving left or ball is moving right -> bounce ball left
            bounceBallLeftWall = wh;
            bounceBallLeftWall.vx = vxWall;
            bounceBallLeftWall.vxLast = vxWallLast;
          }
        }

        // Wall is horizontal and ball is horizontally in-line with the wall
        if (!bounceBallUpWall && !bounceBallDownWall && wall.isHorizontal() && whu.left < bhu.right && whu.right > bhu.left) {
          if (vyWall > 0 || vyBall < 0) {
            // Wall is moving down or ball is moving up -> bounce ball down
            bounceBallDownWall = wh;
            bounceBallDownWall.vy = vyWall;
            bounceBallDownWall.vyLast = vyWallLast;
          } else if (vyWall < 0 || vyBall > 0) {
            // Wall is moving up or ball is moving down -> bounce ball up
            bounceBallUpWall = wh;
            bounceBallUpWall.vy = vyWall;
            bounceBallUpWall.vyLast = vyWallLast;
          }
        }
      }
    });

    if (bounceBallLeftWall || bounceBallRightWall) {
      if (!ball.collision.activeX) {
        ball.collision.activeX = true;

        if (bounceBallLeftWall) {
          ball.physics.setX(bounceBallLeftWall.left - ball.appearance.radius * 2);
          ball.physics.setVX(Math.min(
            Math.abs(vxBall) * -1,
            Math.abs(bounceBallLeftWall.vx) * -1
          ));
        } else if (bounceBallRightWall) {
          ball.physics.setX(bounceBallRightWall.right);
          ball.physics.setVX(Math.max(
            Math.abs(vxBall),
            Math.abs(bounceBallRightWall.vx)
          ));
        }

        // If the ball is not also bouncing up or down, make it a clean horizontal hit,
        // and cancel the Y velocity
        if (!bounceBallUpWall && !bounceBallDownWall) {
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
          ball.physics.setVY(Math.min(
            Math.abs(vyBall) * -1,
            Math.abs(bounceBallUpWall.vy) * -1
          ));
        } else if (bounceBallDownWall) {
          ball.physics.setY(bounceBallDownWall.bottom);
          ball.physics.setVY(Math.max(
            Math.abs(vyBall),
            Math.abs(bounceBallDownWall.vy)
          ));
        }

        if (!bounceBallUpWall && !bounceBallDownWall) {
          ball.physics.setVY(0);
        }

        // If the ball is not also bouncing left or right, make it a clean vertical hit,
        // and cancel the X velocity
        if (!bounceBallLeftWall && !bounceBallRightWall) {
          ball.physics.setVX(0);
        }
      }
    } else {
      ball.collision.activeY = false;
    }
  }

  function render(dt) {
    clear();

    renderScore();

    renderMarkers();

    ball.render(dt);

    _.each(walls, function(wall) {
      wall.render(dt);
    });
  }

  function renderScore() {
    if (scoreText) {
      graphics.save();
      graphics.context.shadowBlur = 10;
      graphics.context.shadowColor = "red";
      graphics.setFillStyle("white");
      graphics.fillText(scoreText, 250, 30);
      graphics.restore();
    }
  }

  function renderMarkers() {
  }

  function clear() {
    graphics.clear();

    // Draw a transparent backdrop
    var padding = 2;

    graphics.save();
    graphics.setFillStyle("rgba(0, 0, 0, 0.8)");
    graphics.setStrokeStyle("black");
    graphics.fillRect(padding, padding, width - 2 * padding, height - 2 * padding);
    graphics.restore();
  }

  function ready() {
    fpsMeter = new FPSMeter({ decimals: 0, graph: true, theme: "dark" });

    canvas = document.getElementById("game-canvas");

    bind();

    graphics = new app.Graphics({
      canvas: canvas,
      width: width,
      height: height
    });

    input = new app.Input();

    reset("easy");
    start();
  }

  function bind() {
    _.each(["easy", "medium", "hard"], function(type) {
      $(".button-" + type).on("click", function() {
        reset(type);
        start();
      });
    });
  }

  function reset(type) {
    isStarted = false;
    isStopped = true;

    lastPresses = 0;
    elapsedTime = 0;
    displayTime = 0;
    score = 1000;
    scoreText = "";

    createMaze(type);
  }

  function start() {
    isStarted = false;
    isStopped = false;

    dt = 0;
    last = timestamp();
    requestAnimationFrame(loop);
  }

  function stop() {
    scoreText = "You died!  Your final score was: " + Math.round(score * 10) / 10;
    isStopped = true;
    isStarted = false;
  }

  function createMaze(type) {
    var mazes = {
      // Spiral
      easy: {
        start: {
          x: mazeX + mazeWidth - 25,
          y: mazeY + mazeHeight - 25,
          vx: 0,
          vy: 0
        },
        end: {
        },
        walls: [
          // Bounds
          [0, 0, 1, 0], // top
          [1, 0, 1, 1], // right
          [1, 1, 0, 1], // bottom
          [0, 1, 0, 0], // left

          // Maze walls
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
        ]
      },
      medium: {
        start: {
          x: mazeX + mazeWidth - 25,
          y: mazeY + mazeHeight - 25,
          vx: 0,
          vy: 0
        },
        end: {
        },
        walls: [
          // Bounds
          [0, 0, 1, 0], // top
          [1, 0, 1, 1], // right
          [1, 1, 0, 1], // bottom
          [0, 1, 0, 0] // left

          // Maze walls
        ]
      },
      // Stair-step
      hard: {
        start: {
          x: mazeX + mazeWidth - 25,
          y: mazeY + mazeHeight - 25,
          vx: 0,
          vy: 0
        },
        end: {
        },
        walls: [
          // Bounds
          [0, 0, 1, 0], // top
          [1, 0, 1, 1], // right
          [1, 1, 0, 1], // bottom
          [0, 1, 0, 0] // left

        ]
      }
    };

    maze = mazes[type];
    ball = createBall();
    walls = createWalls();
  }

  function createBall() {
    return new app.Ball({
      graphics: graphics,
      physics: {
        x: maze.start.x,
        y: maze.start.y,
        vx: maze.start.vx || 0,
        vy: maze.start.vy || 0
      },
      appearance: {
        radius: 10,
        strokeStyle: "black",
        fillStyle: "orange"
      }
    });
  }

  function createWalls() {
    return _.map(maze.walls, function(wall, index) {
      return new app.Wall({
        input: input,
        graphics: graphics,
        points: [{
          x: wall[0] * mazeWidth + mazeX,
          y: wall[1] * mazeHeight + mazeY
        }, {
          x: wall[2] * mazeWidth + mazeX,
          y: wall[3] * mazeHeight + mazeY
        }]
      });
    });
  }

  $(ready);
}(app || {}));
