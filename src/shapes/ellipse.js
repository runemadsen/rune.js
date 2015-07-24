(function() {

  var Ellipse = Rune.Ellipse = function(x, y, width, height) {

    this.moveable();
    this.sizeable();
    this.styleable();

    this.vars.x = x;
    this.vars.y = y;
    this.vars.width = width;
    this.vars.height = height;
  };

  _.extend(Ellipse.prototype,
    Rune.Mixins.Moveable,
    Rune.Mixins.Sizeable,
    Rune.Mixins.Styleable,
    { type: "ellipse" }
  );

})();