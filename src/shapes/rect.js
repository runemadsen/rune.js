(function() {

  var Rectangle = Rune.Rectangle = function(x, y, width, height) {

    this.moveable();
    this.sizeable();
    this.styleable();

    this.vars.x = x;
    this.vars.y = y;
    this.vars.width = width;
    this.vars.height = height;
  };

  _.extend(Rectangle.prototype, Rune.Shapeable, Rune.Moveable, Rune.Sizeable, Rune.Styleable, {

    type: "rectangle",

    toPolygon: function(opts) {

      var poly =  new Rune.Polygon(this.vars.x, this.vars.y)
        .lineTo(0, 0)
        .lineTo(this.vars.width, 0)
        .lineTo(this.vars.width, this.vars.height)
        .lineTo(0, this.vars.height);

      if(opts) poly = poly.toPolygon(opts);

      return poly;
    },

    copy: function(group) {
      var c = new Rune.Rectangle();
      this.shapeCopy(c, group);
      return c;
    }

  });

})();