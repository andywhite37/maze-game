var app = app || {};

app.width = 800; // canvas width
app.height = 600; // canvas height

app.fps = 60; // target frames per second
app.step = 1 / app.fps; // seconds per update tick
app.timeScale = 1; // game speed/slowness factor (1 is normal, >1 is slower)
app.stepScaled = app.step * app.timeScale;

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  alert("Upgrade your browser or install a different one to play this game!");
