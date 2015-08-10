(function(Rune) {

  var Anchor = Rune.Anchor = function() {
    this.relative = false;
  };

  // Constructors
  // --------------------------------------------------

  _.extend(Anchor.prototype, {

    copy: function() {
      var a = new Rune.Anchor();
      a.relative = this.relative;
      a.command = this.command;
      if(this.vec1) a.vec1 = this.vec1.copy();
      if(this.vec2) a.vec2 = this.vec2.copy();
      if(this.vec3) a.vec3 = this.vec3.copy();
      return a;
    },

    setMove: function(x, y, relative) {
      this.command = 'move';
      this.vec1 = new Rune.Vector(x, y);
      this.relative = !!relative;
      return this;
    },

    setLine: function(x, y, relative) {
      this.command = 'line';
      this.vec1 = new Rune.Vector(x, y);
      this.relative = !!relative;
      return this;
    },

    setCurve: function(a, b, c, d, e, f, g) {

      // if we have 6 or more arguments, we create
      // a cubic bezier with 2 control points.
      if(!_.isUndefined(f)) {
        this.command = 'cubic';
        this.vec1 = new Rune.Vector(a, b);
        this.vec2 = new Rune.Vector(c, d);
        this.vec3 = new Rune.Vector(e, f);
        if(g === true)  this.relative = true;
      }

      // else if we have 4 or more arguments, we create
      // a quad bezier with 1 control point.
      else if(!_.isUndefined(d)) {
        this.command = 'quad';
        this.vec1 = new Rune.Vector(a, b);
        this.vec2 = new Rune.Vector(c, d);
        if(e === true)  this.relative = true;
      }

      // else we create an automatic quad bezier
      // with no control points.
      else {
        this.command = 'quad';
        this.vec1 = new Rune.Vector(a, b);
        if(c === true)  this.relative = true;
      }

      return this;
    },

    setClose: function() {
      this.command = 'close';
      return this;
    }

  });

})(Rune);