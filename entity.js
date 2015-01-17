(function() {
  var entityId = 0;

  function Entity(name, components) {
    this.id = entityId++;
    this.name = name;
    this.components = {};

    if (this.components) {
      this.addComponents(components);
    }
  }

  Entity.prototype.addComponents = function(components) {
    components.forEach(function(component) {
      this.addComponent(component);
    }, this);
  };

  Entity.prototype.addComponent = function(component) {
    this.components[component.name] = component;

    return this;
  };

  Entity.prototype.removeComponent = function(component) {
    var name;

    if (_.isString(component)) {
      name = component;
    } else {
      name = component.name;
    }

    delete this.components[name];

    return this;
  };

  app.Entity = Entity;
}());
