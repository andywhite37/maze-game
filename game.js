(function() {
  function update(dt) {
    app.ball.update(dt);
    app.maze.update(dt);
  }

  function checkCollisions(dt) {
    if (app.ball.x < app.maze.x) {
      app.ball.vx *= -1;
    }

    if (app.ball.y < app.maze.y) {
      app.ball.vy *= -1;
    }

    if ((app.ball.x + 2 * app.ball.radius) > (app.maze.x + app.maze.width)) {
      app.ball.vx *= -1;
    }

    if ((app.ball.y + 2 * app.ball.radius) > (app.maze.y + app.maze.height)) {
      app.ball.vy *= -1;
    }
  }

  function render(dt) {
    app.graphics.clear();

    var padding = 2;
    app.graphics.fillStyle("white");
    app.graphics.fillRect(padding, padding, app.width - 2 * padding, app.height - 2 * padding);

    app.ball.render(dt);
    app.maze.render(dt);
  }

  function loop(now) {
    app.fpsMeter.tickStart();
    app.now = now;

    app.dt = app.dt + Math.min(1, (app.now - app.last) / 1000);

    while (app.dt > app.stepScaled) {
      app.dt = app.dt - app.stepScaled;
      update(app.dt);
      checkCollisions(app.dt);
    }

    render(app.dt / app.timeScale);

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

    app.maze = new app.Maze({
      width: app.width * 0.8,
      height: app.height * 0.8,
      type: "easy"
    });

    app.ball = new app.Ball({
      x: 100,
      y: 100,
      vx: 100,
      vy: 200,
      radius: 10
    });

    app.dt = 0;
    app.last = performance.now();
    requestAnimationFrame(loop);
  }

  document.addEventListener("DOMContentLoaded", ready);
}());
