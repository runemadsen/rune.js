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
    }

    /*public RPoint getPoint(float t){
    // limit the value of t between 0 and 1
    t = (t > 1F) ? 1F : t;
    t = (t < 0F) ? 0F : t;
    float ax, bx, cx;
    float ay, by, cy;
    float tSquared, tDoubled, tCubed;
    float dx, dy;

    switch(commandType){
    case LINETO:
      dx = endPoint.x - startPoint.x;
      dy = endPoint.y - startPoint.y;
      return new RPoint(startPoint.x + dx * t, startPoint.y + dy * t);

    case QUADBEZIERTO:
      // calculate the polynomial coefficients
      bx = controlPoints[0].x - startPoint.x;
      ax = endPoint.x - controlPoints[0].x - bx;
      by = controlPoints[0].y - startPoint.y;
      ay = endPoint.y - controlPoints[0].y - by;

      // calculate the curve point at parameter value t
      tSquared = t * t;
      tDoubled = 2F * t;
      return new RPoint((ax * tSquared) + (bx * tDoubled) + startPoint.x, (ay * tSquared) + (by * tDoubled) + startPoint.y);

    case CUBICBEZIERTO:
      // calculate the polynomial coefficients
      cx = 3F * (controlPoints[0].x - startPoint.x);
      bx = 3F * (controlPoints[1].x - controlPoints[0].x) - cx;
      ax = endPoint.x - startPoint.x - cx - bx;
      cy = 3F * (controlPoints[0].y - startPoint.y);
      by = 3F * (controlPoints[1].y - controlPoints[0].y) - cy;
      ay = endPoint.y - startPoint.y - cy - by;

      // calculate the curve point at parameter value t
      tSquared = t * t;
      tCubed = tSquared * t;
      return new RPoint((ax * tCubed) + (bx * tSquared) + (cx * t) + startPoint.x, (ay * tCubed) + (by * tSquared) + (cy * t) + startPoint.y);
    }

    return new RPoint();
  }

  ALSO RCommand.getCurveLength

  */

  });

})(Rune);