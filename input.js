(function(){
  var LEFT = 37;
  var RIGHT = 39;
  var UP = 38;
  var DOWN = 40;
  var SPACE = 32;
  var PREVENT_DEFAULTS = [LEFT, RIGHT, UP, DOWN, SPACE];

  var input = {
    init: function(){
      $(document).on("keydown", this.onKeyDown.bind(this));
      $(document).on("keyup", this.onKeyUp.bind(this));
    },

    isPressed: [],

    onKeyDown: function(e) {
      if (PREVENT_DEFAULTS.indexOf(e.which) >= 0) {
        e.preventDefault();
      }
      this.isPressed[e.which] = true;
    },

    onKeyUp: function(e) {
      if (PREVENT_DEFAULTS.indexOf(e.which) >= 0) {
        e.preventDefault();
      }
      this.isPressed[e.which] = false;
    },

    up: function() {
      return this.isPressed[UP];
    },

    down: function() {
      return this.isPressed[DOWN];
    },

    left: function() {
      return this.isPressed[LEFT];
    },

    right: function() {
      return this.isPressed[RIGHT];
    },

    space: function() {
      return this.isPressed[SPACE];
    }
  };

  app.input = input;
}());
