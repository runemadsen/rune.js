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

  _.extend(Rectangle.prototype, Rune.Mixins.Shapeable, Rune.Mixins.Moveable, Rune.Mixins.Sizeable, Rune.Mixins.Styleable, {

    type: "rectangle",

    copy: function(group) {
      var c = new Rune.Rectangle();
      this.shapeCopy(c, group);
      return c;
    }

  });

})();