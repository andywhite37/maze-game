(function(){
  var LEFT = 37;
  var RIGHT = 39;
  var UP = 38;
  var DOWN = 40;
  var SPACE = 32;
  var PREVENT_DEFAULTS = [LEFT, RIGHT, UP, DOWN, SPACE];

  var input = {
    init: function(){
      this.on("keydown", this.onKeyDown);
      this.on("keyup", this.onKeyUp);
    },

    isPressed: {},

    onKeyDown: function(e) {
      if (PREVENT_DEFAULTS.indexOf(e.which) >= 0) {
        e.preventDefault();
      }
      this.isPressed["" + e.which] = true;
    },

    onKeyUp: function(e) {
      if (PREVENT_DEFAULTS.indexOf(e.which) >= 0) {
        e.preventDefault();
      }
      this.isPressed["" + e.which] = false;
    },

    up: function() {
      return this.isPressed["" + UP];
    },

    down: function() {
      return this.isPressed["" + DOWN];
    },

    left: function() {
      return this.isPressed["" + LEFT];
    },

    right: function() {
      return this.isPressed["" + RIGHT];
    },

    space: function() {
      return this.isPressed["" + SPACE];
    },

    on: function(name, handler) {
      document.addEventListener(name, handler.bind(this));
    }
  };

  app.input = input;
}());
