(function() {

  var Circle = Rune.Circle = function(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  };

  _.extend(Circle.prototype,
    Rune.Mixins.Moveable,
    Rune.Mixins.Styleable,
    { type: "circle" }
  );

})();