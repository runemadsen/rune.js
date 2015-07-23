(function(Rune) {

  var Polygon = Rune.Polygon = function() {
    this.vectors = [];
  };

  _.extend(Polygon.prototype, Rune.Mixins.Moveable, Rune.Mixins.Styleable, {

    type: "polygon",

    lineTo: function(x, y) {
      this.vectors.push(new Rune.Vector(x, y));
      return this;
    }


  });

})(Rune);