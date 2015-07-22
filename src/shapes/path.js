(function(Rune) {

  var Path = Rune.Path = function() {
    this.anchors = [];
  };

  // Drawing functions
  // --------------------------------------------------

  _.extend(Path.prototype, {

    type: "path",

    moveTo: function(x, y, relative) {
      this.anchors.push(new Rune.Anchor().setMove(x, y, relative));
      return this;
    },

    lineTo: function(x, y, relative) {
      this.anchors.push(new Rune.Anchor().setLine(x, y, relative));
      return this;
    },

    curveTo: function(a, b, c, d, e, f, g) {
      this.anchors.push(new Rune.Anchor().setCurve(a, b, c, d, e, f, g));
      return this;
    }

  });

})(Rune);