(function() {

  var Ellipse = Rune.Ellipse = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  };

  _.extend(Ellipse.prototype,
    Rune.Mixins.Moveable,
    Rune.Mixins.Sizeable,
    Rune.Mixins.Styleable,
    { type: "ellipse" }
  );

})();