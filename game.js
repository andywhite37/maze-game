(function() {
  function now() {
    return performance.now();
  }

  function update(dt) {
    app.ball.update(dt);
    app.maze.update(dt);
  }

  function checkCollisions(dt) {
    var bh = app.ball.hitbox();
    var mh = app.maze.hitbox();

    if (bh.left < mh.left) {
      app.ball.moveRight();
    }

    if (bh.right > mh.right) {
      app.ball.moveLeft();
    }

    if (bh.top < mh.top) {
      app.ball.moveDown();
    }

    if (bh.bottom > mh.bottom) {
      app.ball.moveUp();
    }
  }

  function render(dt) {
    //app.graphics.clear();
    var padding = 2;
    app.graphics.fillStyle("white");
    app.graphics.fillRect(padding, padding, app.width - 2 * padding, app.height - 2 * padding);
    app.ball.render(dt);
    app.maze.render(dt);
  }

  function loop() {
    app.fpsMeter.tickStart();
    app.now = now();

    app.dt += ((app.now - app.last) / 1000);

    while (app.dt > app.step) {
      app.dt -= app.step;
      update(app.step);
      checkCollisions(app.step);
    }

    render(app.dt);

    app.last = app.now;
    app.fpsMeter.tick();
    requestAnimationFrame(loop);
  }

  function ready() {
    app.fpsMeter = new FPSMeter({ decimals: 0, graph: true, theme: "dark" });
    app.canvas = document.getElementById("game-canvas");
    app.canvas.width = app.width;
    app.canvas.height = app.height;
    app.context = app.canvas.getContext("2d");
    app.graphics.init();
    app.input.init();

    app.maze = new app.Maze({
      width: app.width * 0.8,
      height: app.height * 0.8,
      type: "easy"
    });

    app.ball = new app.Ball({
      x: 100,
      y: 100,
      vx: 200,
      vy: 400,
      radius: 10
    });

    app.dt = 0;
    app.last = now();
    requestAnimationFrame(loop);
  }

  document.addEventListener("DOMContentLoaded", ready);
}());
