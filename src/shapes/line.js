(function(Rune) {

  var Line = Rune.Line = function(x, y, x2, y2) {

    this.moveable();
    this.styleable();

    this.vars.x = x;
    this.vars.y = y;
    this.vars.x2 = x2;
    this.vars.y2 = y2;
  };

  _.extend(Line.prototype, Rune.Shapeable, Rune.Moveable, Rune.Styleable, {

    type: "line",

    copy: function(group) {
      var e = new Rune.Line();
      e.vars.x2 = this.vars.x2;
      e.vars.y2 = this.vars.y2;
      this.shapeCopy(e, group);
      return e;
    }

  });

})(Rune);