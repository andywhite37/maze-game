(function() {
    // DOM/sizes/etc.
    var width = 500;
    var height = 500;
    var canvas;
    var ctx;

    // Animation frame/loop variables
    var fpsMeter;
    var lastNow;
    var deltaSeconds = 0;
    var framesPerSecond = 60;
    var secondsPerFrame = 1 / framesPerSecond;
    var timeScaleFactor = 1;
    var timeScaledSecondsPerFrame = timeScaleFactor * secondsPerFrame;

    // Game state
    var ballX = 0;
    var ballY = 0;
    var ballSize = 10;

    function update(deltaSeconds) {
        console.log("update", deltaSeconds);
        var velocity = 100; // px/s

        if (ballX + ballSize > width) {
            ballX = 0;
        } else {
            ballX += velocity * deltaSeconds;
        }

        if (ballY + ballSize > height) {
            ballY = 0;
        } else {
            ballY += velocity * deltaSeconds;
        }
    }

    function render(deltaSeconds) {
        console.log("render", deltaSeconds);
        clear();
        //rect(ballX, ballY, ballSize, ballSize);
        circle(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2);
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function rect(x, y, w, h, fillStyle) {
        ctx.fillStyle = fillStyle || "red";
        ctx.fillRect(x, y, w, h);
    }

    function circle(centerX, centerY, radius, fillStyle, strokeStyle, lineWidth, startAngle, endAngle, counterClockwise) {
        fillStyle = fillStyle || "red";
        strokeStyle = strokeStyle || "black";
        lineWidth = lineWidth || 1;
        startAngle = startAngle || 0;
        endAngle = endAngle || 2 * Math.PI;
        counterClockwise = counterClockwise || false;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, counterClockwise);
        ctx.fillStyle = fillStyle;
        ctx.fill();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }

    function text(str, x, y, font, fillStyle) {
        ctx.font = font || "10pt sans-serif";
        ctx.fillStyle = fillStyle || "black";
        ctx.fillText(str, x, y);
    }

    function loop(now) {
        fpsMeter.tickStart();

        deltaSeconds = deltaSeconds + Math.min(1, (now - lastNow) / 1000);

        while (deltaSeconds > timeScaledSecondsPerFrame) {
            deltaSeconds = deltaSeconds - timeScaledSecondsPerFrame;
            update(secondsPerFrame);
        }

        render(deltaSeconds / timeScaleFactor);

        lastNow = now;
        fpsMeter.tick();
        requestAnimationFrame(loop);
    }

    function ready() {
        fpsMeter = new FPSMeter({ decimals: 0, graph: true, theme: "dark", left: "400px", top: "18px" });
        canvas = document.getElementById("game-canvas");
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");

        lastNow = performance.now();
        requestAnimationFrame(loop);
    }

    document.addEventListener("DOMContentLoaded", ready);
}());
