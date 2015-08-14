(function(Rune) {

  var Polygon = Rune.Polygon = function(x, y) {

    this.moveable();
    this.styleable();
    this.vars.vectors = [];

    if(!_.isUndefined(x)) this.vars.x = x;
    if(!_.isUndefined(y)) this.vars.y = y;
  };

  _.extend(Polygon.prototype, Rune.Shapeable, Rune.Moveable, Rune.Styleable, {

    type: "polygon",

    lineTo: function(x, y) {
      this.vars.vectors.push(new Rune.Vector(x, y));
      return this;
    },

    bounds: function() {
      var xmax = 0;
      var ymax = 0;
      var xmin = 0;
      var ymin = 0;

      _.each(this.vars.vectors, function(vec) {
        if(vec.x < xmin)  xmin = vec.x;
        if(vec.x > xmax)  xmax = vec.x;
        if(vec.y < ymin)  ymin = vec.y;
        if(vec.y > ymax)  ymax = vec.y;
      });

      return {
        x: this.vars.x + xmin,
        y: this.vars.y + ymin,
        width: xmax - xmin,
        height: ymax - ymin
      };
    },

    centroid: function() {
      var ps = this.vars.vectors;
      var areaAcc = 0.0;
      var xAcc = 0.0;
      var yAcc = 0.0;

      for(var i = 0; i < ps.length-1; i++)
      {
        areaAcc += ps[i].x * ps[i+1].y - ps[i+1].x * ps[i].y;
        xAcc += (ps[i].x + ps[i+1].x) * (ps[i].x * ps[i+1].y - ps[i+1].x * ps[i].y);
        yAcc += (ps[i].y + ps[i+1].y) * (ps[i].x * ps[i+1].y - ps[i+1].x * ps[i].y);
      }

      areaAcc /= 2.0;
      var x = this.vars.x + (xAcc/(6.0*areaAcc));
      var y = this.vars.y + (yAcc/(6.0*areaAcc));

      return new Rune.Vector(x, y);
    },

    toPolygon: function(opts) {

      // if asked to create a new polygon where
      // the vectors have equal spacing.
      if(opts && opts.spacing) {

        var poly = new Rune.Polygon(this.vars.x, this.vars.y);

        for(var i = 0; i < this.vars.vectors.length; i++) {
          var start = this.vars.vectors[i];
          var stop = this.vars.vectors[(i+1)%this.vars.vectors.length];
          var rel = stop.sub(start);
          var numPoints = rel.length() / opts.spacing;
          var norm = rel.normalize();
          for(var j = 0; j < numPoints; j++) {
            var vec = start.add(norm.multiply(opts.spacing * j));
            poly.lineTo(vec.x, vec.y);
          }
        }

        return poly;
      }

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