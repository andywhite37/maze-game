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
  var predatorMusic;
  var hitSound;
  var explosionSound;

  // Game objects
  var currentType = "easy";
  var maze;
  var ball;
  var walls;
  var endMarker;
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
    if (!isStarted && !isStopped && (input.down() || input.up() || input.right() || input.left())) {
      isStarted = true;
      elapsedTime = 0;
    }

    if (input.space()) {
      reset(currentType);
    }

    if (isStarted) {
      elapsedTime += dt;
      displayTime = Math.round(elapsedTime * 10) / 10;
      score -= dt;
      score -= (input.presses - lastPresses);
      lastPresses = input.presses;
      displayScore = Math.round(score * 10) / 10;
      scoreText = "Score: " + displayScore + " (time: " + displayTime + ", moves: " + input.presses + ")";

      endMarker.update(dt);
      ball.update(dt);

      _.each(walls, function(wall) {
        wall.update(dt);
      });

      checkCollisions(dt);
    } else if (isStopped) {
      endMarker.update(dt);
    }
  }

  function checkCollisions(dt) {
    var bh = ball.getHitbox();
    var bhu = ball.getHitboxUnion();
    var eh = endMarker.getHitbox();
    var bp = ball.physics;
    var ballMovingLeft = bp.vx < 0;
    var ballMovingRight = bp.vx > 0;
    var ballStoppedX = bp.vx === 0;
    var ballMovingUp = bp.vy < 0;
    var ballMovingDown = bp.vy > 0;
    var ballStoppedY = bp.vy === 0;

    if (score < 0) {
      score = 0;
      stop();
      return;
    }

    // Check if ball hits the end marker
    if (app.util.intersects(bh, eh)) {
      endMarker.isExploding = true;
      ball.isExploding = true;
      stop();

      if (!explosionSound.paused) {
        explosionSound.pause();
        explosionSound.currentTime = 1;
      }
      explosionSound.play();

      return;
    }

    var bounceBallLeft = null;
    var bounceBallRight = null;
    var bounceBallUp = null;
    var bounceBallDown = null;

    _.each(walls, function(wall) {
      var wh = wall.getHitbox();
      var whu = wall.getHitboxUnion();
      var wp = wall.points[0];
      var wallMovingLeft = wp.vx < 0;
      var wallMovingRight = wp.vx > 0;
      var wallStoppedX = wp.vx === 0;
      var wallMovingUp = wp.vy < 0;
      var wallMovingDown = wp.vy > 0;
      var wallStoppedY = wp.vy === 0;

      if (app.util.intersects(bhu, whu)) {

        if (!bounceBallRight && !bounceBallLeft && wall.isVertical()) {
          if (ballMovingLeft || (wallMovingRight && !ballMovingRight)) {
            bounceBallRight = {
              wall: wall,
              hitbox: wh,
              vx: wp.vx
            };
          } else if (ballMovingRight || (wallMovingLeft && !ballMovingLeft)) {
            bounceBallLeft = {
              wall: wall,
              hitbox: wh,
              vx: wp.vx
            };
          }
        }

        if (!bounceBallUp && !bounceBallDown && wall.isHorizontal()) {
          if (ballMovingUp || (wallMovingDown && !ballMovingDown)) {
            bounceBallDown = {
              wall: wall,
              hitbox: wh,
              vy: wp.vy
            };
          } else if (ballMovingDown || (wallMovingUp && !ballMovingUp)) {
            bounceBallUp = {
              wall: wall,
              hitbox: wh,
              vy: wp.vy
            };
          }
        }
      }

      wall.restrictMovement();
    });

    var isHit = false;

    if (bounceBallLeft || bounceBallRight) {
      if (!ball.collision.activeX) {
        ball.collision.activeX = true;
        isHit = true;

        if (bounceBallLeft) {
          ball.physics.setX(bounceBallLeft.wall.getHitbox().left - ball.appearance.radius * 2);
          ball.physics.setVX(Math.min(
            Math.abs(bp.vx) * -1,
            Math.abs(bounceBallLeft.vx) * -1
          ));
        } else if (bounceBallRight) {
          ball.physics.setX(bounceBallRight.wall.getHitbox().right);
          ball.physics.setVX(Math.max(
            Math.abs(bp.vx),
            Math.abs(bounceBallRight.vx)
          ));
        }

        if (!bounceBallUp && !bounceBallDown) {
          ball.physics.setVY(0);
        }
      }
    } else {
      ball.collision.activeX = false;
    }

    if (bounceBallUp || bounceBallDown) {
      if (!ball.collision.activeY) {
        ball.collision.activeY = true;
        isHit = true;

        if (bounceBallUp) {
          ball.physics.setY(bounceBallUp.wall.getHitbox().top - ball.appearance.radius * 2);
          ball.physics.setVY(Math.min(
            Math.abs(bp.vy) * -1,
            Math.abs(bounceBallUp.vy) * -1
          ));
        } else if (bounceBallDown) {
          ball.physics.setY(bounceBallDown.wall.getHitbox().bottom);
          ball.physics.setVY(Math.max(
            Math.abs(bp.vy),
            Math.abs(bounceBallDown.vy)
          ));
        }

        if (!bounceBallLeft && !bounceBallRight) {
          ball.physics.setVX(0);
        }
      }
    } else {
      ball.collision.activeY = false;
    }

    if (isHit) {
      if (!hitSound.paused) {
        hitSound.pause();
        hitSound.currentTime = 0;
      }
      hitSound.play();
    }
  }

  function render(dt) {
    clear();

    endMarker.render(dt);

    ball.render(dt);

    _.each(walls, function(wall) {
      wall.render(dt);
    });

    renderScore(dt);
  }

  function renderScore() {
    if (scoreText) {
      graphics.save();
      graphics.context.shadowBlur = 10;
      graphics.context.shadowColor = "red";
      graphics.setFillStyle("white");
      graphics.fillText(scoreText, 180, 40);
      graphics.restore();
    }
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
    predatorMusic = document.getElementById("predator-music");
    hitSound = document.getElementById("hit-sound");
    explosionSound = document.getElementById("explosion-sound");

    predatorMusic.play();

    bindEvents();

    graphics = new app.Graphics({
      canvas: canvas,
      width: width,
      height: height
    });

    input = new app.Input();

    reset("easy");
    start();
  }

  function bindEvents() {
    _.each(["easy", "medium", "hard"], function(type) {
      $(".button-" + type).on("click", function() {
        currentType = type;
        reset(currentType);
      });
    });
  }

  function reset(type) {
    isStarted = false;
    isStopped = false;

    input.presses = 0;
    lastPresses = 0;
    elapsedTime = 0;
    displayTime = 0;
    score = 100;
    scoreText = "";

    createMaze(type);
  }

  function start() {
    dt = 0;
    last = timestamp();
    requestAnimationFrame(loop);
  }

  function stop() {
    if (score > 85) {
      scoreText = "Cheater!  Your final score was: " + Math.round(score * 10) / 10;
    } else {
      scoreText = "You died!  Your final score was: " + Math.round(score * 10) / 10;
    }
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
        end: [0.5, 0.5, 0.05],
        walls: [
          // [x1, y1, x2, y2]
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
        ]
      },
      medium: {
        start: {
          x: mazeX + mazeWidth - 25,
          y: mazeY + mazeHeight - 25,
          vx: 0,
          vy: 0
        },
        end: [0.05, 0.05, 0.05],
        walls: [
          // Bounds
          [0, 0, 1, 0], // top
          [1, 0, 1, 1], // right
          [1, 1, 0, 1], // bottom
          [0, 1, 0, 0], // left

          // Maze walls
          [0.9, 0.1, 0.9, 1],
          [0.8, 0, 0.8, 0.9],
          [0.7, 0.1, 0.7, 1],
          [0.6, 0, 0.6, 0.9],
          [0.5, 0.1, 0.5, 1],
          [0.4, 0, 0.4, 0.9],
          [0.3, 0.1, 0.3, 1],
          [0.2, 0, 0.2, 0.9],
          [0.1, 0.1, 0.1, 1]
        ]
      },
      hard: {
        start: {
          x: mazeX + mazeWidth - 25,
          y: mazeY + mazeHeight - 25,
          vx: 0,
          vy: 0
        },
        end: [0.15, 0.25, 0.05],
        walls: [
          // Bounds
          [0, 0, 1, 0], // top
          [1, 0, 1, 1], // right
          [1, 1, 0, 1], // bottom
          [0, 1, 0, 0], // left

          [0.9, 0.1, 0.9, 1],
          [0.8, 0, 0.8, 0.9],
          [0.1, 0.9, 0.8, 0.9],
          [0, 0.8, 0.7, 0.8],
          [0.7, 0.1, 0.7, 0.8],
          [0.6, 0, 0.6, 0.7],
          [0.1, 0.7, 0.6, 0.7],
          [0, 0.6, 0.5, 0.6],
          [0.5, 0.1, 0.5, 0.6],
          [0.4, 0, 0.4, 0.5],
          [0.1, 0.5, 0.4, 0.5],
          [0, 0.4, 0.3, 0.4],
          [0.3, 0.1, 0.3, 0.4],
          [0.2, 0, 0.2, 0.3],
          [0.1, 0.3, 0.2, 0.3],
          [0.1, 0.1, 0.1, 0.3]
        ]
      }
    };

    maze = mazes[type];
    ball = createBall();
    walls = createWalls();
    endMarker = createEndMarker();
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

  function createEndMarker() {
    return new app.End({
      graphics: graphics,
      x: maze.end[0] * mazeWidth + mazeX,
      y: maze.end[1] * mazeHeight + mazeY,
      radius: maze.end[2] * mazeWidth
    });
  }

  $(ready);
}(app || {}));
