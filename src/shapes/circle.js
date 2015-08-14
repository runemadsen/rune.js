(function() {

  var Circle = Rune.Circle = function(x, y, radius) {

    this.moveable();
    this.styleable();

    this.vars.x = x;
    this.vars.y = y;
    this.vars.radius = radius;
  };

  _.extend(Circle.prototype, Rune.Shapeable, Rune.Moveable, Rune.Styleable, {

      type: "circle",

      toPolygon: function(opts) {
        var ellipse = new Rune.Ellipse(this.vars.x, this.vars.y, this.vars.radius*2, this.vars.radius*2);
        return ellipse.toPolygon(opts);
      },

      copy: function(group) {
        var c = new Rune.Circle();
        c.vars.radius = this.vars.radius;
        this.shapeCopy(c, group);
        return c;
      }

    }
  );

})();