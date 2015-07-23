(function(Rune) {

  var Polygon = Rune.Polygon = function(x, y) {

    this.vectors = [];

    if(x > 0) this.x = x;
    if(y > 0) this.y = y;
  };

  _.extend(Polygon.prototype, Rune.Mixins.Moveable, Rune.Mixins.Styleable, {

    type: "polygon",

    lineTo: function(x, y) {
      this.vectors.push(new Rune.Vector(x, y));
      return this;
    }


  });

})(Rune);