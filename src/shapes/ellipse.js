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

    copy: function(group) {
      var e = new Rune.Ellipse();
      this.shapeCopy(e, group);
      return e;
    }

  });

})();