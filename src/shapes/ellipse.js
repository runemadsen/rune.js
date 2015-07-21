(function() {

  var Ellipse = Rune.Ellipse = function(x, y, width, height) {

    this.loc = new Rune.Vector(x, y);
    this.siz = new Rune.Vector(width, height);

  };

  _.extend(Ellipse.prototype, {
    type: "ellipse"
  });

})();