(function(Rune) {

  var Ellipse = Rune.Line = function(x1, y1, x2, y2) {

    this.loc = new Rune.Vector(x1, y1);
    this.end = new Rune.Vector(x2, y2);

  };

})(Rune);