(function() {
  function now() {
    return performance.now();
  }

  function update(dt) {
    app.entities.forEach(function(entity) {
      if (entity.components.input) {
        entity.components.input.tick(dt);
      }

      if (entity.components.physics) {
        entity.components.physics.tick(dt);
      }
    });
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

    app.entities.forEach(function(entity) {
      if (entity.components.appearance) {
        app.graphics.fillStyle(entity.components.appearance.fillStyle);
        app.graphics.strokeStyle(entity.components.appearance.strokeStyle);

        if (entity.components.appearance.shapeType === "rectangle") {
          app.graphics.fillRect(
            entity.components.physics.x,
            entity.components.physics.y,
            entity.components.appearance.width,
            entity.components.appearance.height
          );
        } else if (entity.components.appearance.shapeType === "circle") {
          app.graphics.fillCircle(
            entity.components.physics.x + 0.5 * entity.components.appearance.width,
            entity.components.physics.y + 0.5 * entity.components.appearance.height,
            0.5 * entity.components.appearance.width
          );
        }
      }
    });
  }

  function loop() {
    app.fpsMeter.tickStart();
    app.now = now();

    app.dt += ((app.now - app.last) / 1000);

    while (app.dt > app.step) {
      app.dt -= app.step;
      update(app.step);
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

    var mazeWidth = app.width * 0.8;
    var mazeHeight = app.height * 0.8;
    var mazeX = (app.width - mazeWidth) / 2;
    var mazeY = (app.height - mazeHeight) / 2;
    app.maze = new app.Entity("maze", [
      new app.PhysicsComponent({ x: mazeX, y: mazeY }),
      new app.AppearanceComponent({ width: mazeWidth, height: mazeHeight, shapeType: "rectangle", fillStyle: "white", strokeStyle: "black" })
    ]);

    app.ball = new app.Entity("ball", [
      new app.PhysicsComponent({ x: 100, y: 100, vx: 200, vy: 400 }),
      new app.AppearanceComponent({ width: 10, height: 10, shapeType: "circle", fillStyle: "orange", strokeStyle: "black" })
    ]);

    app.entities = [app.ball, app.maze];

    app.dt = 0;
    app.last = now();
    requestAnimationFrame(loop);
  }

  document.addEventListener("DOMContentLoaded", ready);
}());
