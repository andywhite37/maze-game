(function(app) {
  var keys = {
    left: 37,
    right: 39,
    up: 38,
    down: 40,
    space: 32
  };

  function Input(options) {
    if (!(this instanceof Input)) {
      return new Input(options);
    }

    this.isPressed = [];

    _.each(keys, function(keyCode) {
      this.isPressed[keyCode] = false;
    }, this);

    this.boundOnKeyDown = _.bind(this.onKeyDown, this);
    this.boundOnKeyUp = _.bind(this.onKeyUp, this);

    this.bind();
  }

  _.extend(Input.prototype, {
    bind: function() {
      $(document).on("keydown", this.boundOnKeyDown);
      $(document).on("keyup", this.boundOnKeyUp);
    },

    unbind: function() {
      $(document).off("keydown", this.boundOnKeyDown);
      $(document).off("keyup", this.boundOnKeyUp);
    },

    onKeyDown: function(e) {
      this.preventDefault(e);
      this.isPressed[e.which] = true;
    },

    onKeyUp: function(e) {
      this.preventDefault(e);
      this.isPressed[e.which] = false;
    },

    preventDefault: function(e) {
      var shouldPreventDefault = _.any(keys, function(keyCode) {
        return keyCode === e.which;
      });

      if (shouldPreventDefault) {
        e.preventDefault();
      }
    },

    up: function() {
      return this.isPressed[keys.up];
    },

    down: function() {
      return this.isPressed[keys.down];
    },

    left: function() {
      return this.isPressed[keys.left];
    },

    right: function() {
      return this.isPressed[keys.right];
    },

    space: function() {
      return this.isPressed[keys.space];
    }
  });

  app.Input = Input;
}(app || {}));
