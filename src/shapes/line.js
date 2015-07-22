(function(Rune) {

  var Line = Rune.Line = function(x, y, x2, y2) {
    this.x = x;
    this.y = y;
    this.x2 = x2;
    this.y2 = y2;
  };

  _.extend(Line.prototype,
    Rune.Mixins.Moveable,
    { type: "line" }
  );

})(Rune);