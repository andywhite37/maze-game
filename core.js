var app = app || {};

app.width = 800; // canvas width
app.height = 600; // canvas height

app.fps = 60; // target frames per second
app.step = 1 / app.fps; // seconds per update tick

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  alert("Update your browser or install a different one to play this game!");
