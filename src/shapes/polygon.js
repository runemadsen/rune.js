(function(Rune) {

  var Polygon = Rune.Polygon = function(x, y) {

    this.moveable();
    this.styleable();
    this.vars.vectors = [];

    if(x > 0) this.vars.x = x;
    if(y > 0) this.vars.y = y;
  };

  _.extend(Polygon.prototype, Rune.Mixins.Moveable, Rune.Mixins.Styleable, {

    type: "polygon",

    lineTo: function(x, y) {
      this.vars.vectors.push(new Rune.Vector(x, y));
      return this;
    }


  });

})(Rune);