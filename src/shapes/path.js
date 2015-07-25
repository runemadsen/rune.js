(function(Rune) {

  var Path = Rune.Path = function(x, y) {

    this.moveable();
    this.styleable();

    this.vars.anchors = [];
    if(x > 0) this.vars.x = x;
    if(y > 0) this.vars.y = y;
  };

  _.extend(Path.prototype, Rune.Shapeable, Rune.Moveable, Rune.Styleable, {

    type: "path",

    moveTo: function(x, y, relative) {
      this.vars.anchors.push(new Rune.Anchor().setMove(x, y, relative));
      return this;
    },

    lineTo: function(x, y, relative) {
      this.checkStartMove();
      this.vars.anchors.push(new Rune.Anchor().setLine(x, y, relative));
      return this;
    },

    curveTo: function(a, b, c, d, e, f, g) {
      this.checkStartMove();
      this.vars.anchors.push(new Rune.Anchor().setCurve(a, b, c, d, e, f, g));
      return this;
    },

    closeShape: function() {
      this.checkStartMove();
      this.vars.anchors.push(new Rune.Anchor().setClose());
      return this;
    },

    copy: function(group) {
      var s = new Rune.Path();
      s.vars.anchors = _.map(this.vars.anchors, function(a) { return a.copy(); });
      this.shapeCopy(s, group);
      return s;
    },

    // Paths must start with a moveTo. This function is checks if
    // there is a moveTo at the beginning, and adds one if not.
    checkStartMove: function() {
      if(this.vars.anchors.length == 0) {
        this.moveTo(0, 0);
      }
    }

  });

})(Rune);