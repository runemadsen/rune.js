(function() {

  var Circle = Rune.Circle = function(x, y, radius) {

    this.moveable();
    this.styleable();

    this.vars.x = x;
    this.vars.y = y;
    this.vars.radius = radius;
  };

  _.extend(Circle.prototype, Rune.Mixins.Moveable, Rune.Mixins.Styleable, {

      type: "circle",

      copy: function() {
        var c = new Rune.Circle();
        c.moveable(this);
        c.styleable(this);
        c.vars.radius = this.vars.radius;
        return c;
      }

    }
  );

})();