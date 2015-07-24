(function() {

  var Circle = Rune.Circle = function(x, y, radius) {

    this.moveable();
    this.styleable();

    this.vars.x = x;
    this.vars.y = y;
    this.vars.radius = radius;
  };

  _.extend(Circle.prototype, Rune.Mixins.Shapeable, Rune.Mixins.Moveable, Rune.Mixins.Styleable, {

      type: "circle",

      copy: function(group) {
        var c = new Rune.Circle();
        c.vars.radius = this.vars.radius;
        this.shapeCopy(c, group);
        return c;
      }

    }
  );

})();