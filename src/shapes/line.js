(function(Rune) {

  var Line = Rune.Line = function(x, y, x2, y2) {

    this.moveable();
    this.styleable();

    this.vars.x = x;
    this.vars.y = y;
    this.vars.x2 = x2;
    this.vars.y2 = y2;
  };

  _.extend(Line.prototype,
    Rune.Mixins.Moveable,
    Rune.Mixins.Styleable,
    { type: "line" }
  );

})(Rune);