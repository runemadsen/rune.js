(function() {

  var Text = Rune.Text = function(text, x, y) {

    this.moveable();
    this.styleable();

    this.vars.text = text;
    this.vars.x = x;
    this.vars.y = y;
  };

  _.extend(Text.prototype, Rune.Shapeable, Rune.Moveable, Rune.Styleable, {

    type: "text",

    copy: function(group) {
      var t = new Rune.Text();
      t.vars.text = this.vars.text;
      this.shapeCopy(t, group);
      return t;
    }

  });

})();