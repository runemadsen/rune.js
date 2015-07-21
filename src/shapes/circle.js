(function() {

  var Circle = Rune.Circle = function(x, y, radius) {

    this.loc = new Rune.Vector(x, y);
    this.radius = radius;

  };

  _.extend(Circle.prototype, {
    type: "circle"
  });

})();