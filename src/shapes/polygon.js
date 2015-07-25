(function(Rune) {

  var Polygon = Rune.Polygon = function(x, y) {

    this.moveable();
    this.styleable();
    this.vars.vectors = [];

    if(x > 0) this.vars.x = x;
    if(y > 0) this.vars.y = y;
  };

  _.extend(Polygon.prototype, Rune.Shapeable, Rune.Moveable, Rune.Styleable, {

    type: "polygon",

    lineTo: function(x, y) {
      this.vars.vectors.push(new Rune.Vector(x, y));
      return this;
    },

    copy: function(group) {
      var s = new Rune.Polygon();
      s.vars.vectors = _.map(this.vars.vectors, function(v) { return v.copy(); });
      this.shapeCopy(s, group);
      return s;
    }


  });

})(Rune);