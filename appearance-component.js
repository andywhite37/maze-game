(function() {
  function AppearanceComponent(options) {
    this.width = options.width || 0;
    this.height = options.height || 0;
    this.shapeType = options.shapeType || "rectangle";
    this.fillStyle = options.fillStyle || "gray";
    this.strokeStyle = options.strokeStyle || "black";
  }

  AppearanceComponent.prototype.name = "appearance";

  app.AppearanceComponent = AppearanceComponent;
}());
