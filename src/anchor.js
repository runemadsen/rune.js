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

      // cubic bezier with two control points
      if(!_.isUndefined(f)) {
        this.command = 'cubic';
        this.vec1 = new Rune.Vector(a, b);
        this.vec2 = new Rune.Vector(c, d);
        this.vec3 = new Rune.Vector(e, f);
        if(g === true)  this.relative = true;
      }

      // quad bezier with one control point
      else {
        this.command = 'quad';
        this.vec1 = new Rune.Vector(a, b);
        this.vec2 = new Rune.Vector(c, d);
        if(e === true)  this.relative = true;
      }

      return this;
    },

    setClose: function() {
      this.command = 'close';
      return this;
    },

    vectorAt: function(scalar) {

      if(scalar > 1) scalar = 1;
      if(scalar < 0) scalar = 0;

      var ax, bx, cx;
      var ay, by, cy;
      var tSquared, tDoubled, tCubed;
      var dx, dy;

      if(this.command == 'line') {
        return new Rune.Vector(this.vec1.x, this.vec1.y).multiply(scalar)
      }
      else if(this.command == 'cubic') {

        // calculate the polynomial coefficients
        cx = 3 * this.vec1.x;
        bx = 3 * (this.vec2.x - this.vec1.x) - cx;
        ax = this.vec3.x - cx - bx;
        cy = 3 * this.vec1.y;
        by = 3 * (this.vec2.y - this.vec1.y) - cy;
        ay = this.vec3.y - cy - by;

        // calculate the curve point at parameter value t
        tSquared = scalar * scalar;
        tCubed = tSquared * scalar;
        return new Rune.Vector((ax * tCubed) + (bx * tSquared) + (cx * scalar), (ay * tCubed) + (by * tSquared) + (cy * scalar))
      }
      else if(this.command == 'quad') {

        // calculate the polynomial coefficients
        bx = this.vec1.x;
        ax = this.vec2.x - this.vec1.x - bx;
        by = this.vec1.y;
        ay = this.vec2.y - this.vec1.y - by;

        // calculate the curve point at parameter value t
        tSquared = scalar * scalar;
        tDoubled = 2 * scalar;
        return new Rune.Vector((ax * tSquared) + (bx * tDoubled), (ay * tSquared) + (by * tDoubled));
      }
      else {
        throw new Error("Cannot compute vectorAt for this type of anchor")
      }
    }

    /*

  ALSO RCommand.getCurveLength

  */

  });

})(Rune);