(function() {

  var Ellipse = Rune.Ellipse = function(x, y, width, height) {

    this.moveable();
    this.sizeable();
    this.styleable();

    this.vars.x = x;
    this.vars.y = y;
    this.vars.width = width;
    this.vars.height = height;
  };

  _.extend(Ellipse.prototype, Rune.Shapeable, Rune.Moveable, Rune.Sizeable, Rune.Styleable, {

    type: "ellipse",

    toPolygon: function(opts) {

      var numVectors = 16;

      // if we're calculating the number of vectors based on spacing
      // find circumference and divide by spacing.
      if(opts && opts.spacing) {
        var circumference = Math.PI * (this.vars.width+this.vars.height);
        numVectors = circumference / opts.spacing;
      } else if(opts && opts.vectors) {
        numVectors = opts.vectors;
      } else if(opts && opts.step) {
        numVectors = 1 / opts.step;
      }

      var vectorAngle = 360/numVectors;

      var poly =  new Rune.Polygon(this.vars.x, this.vars.y);
      for(var i = 0; i < numVectors; i++) {
        var x = Math.cos(Rune.radians(i * vectorAngle)) * this.vars.width;
        var y = Math.sin(Rune.radians(i * vectorAngle)) * this.vars.height;
        poly.lineTo(x, y);
      }

      return poly;
    },

    copy: function(group) {
      var e = new Rune.Ellipse();
      this.shapeCopy(e, group);
      return e;
    }

  });

})();