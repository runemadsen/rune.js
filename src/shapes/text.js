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

    toPolygon: function() {
      throw new Error("You need the Rune.Font plugin to convert text to polygon");
    },

    textAlign: function(textAlign) { this.vars.textAlign = textAlign; return this; },
    fontFamily: function(fontFamily) { this.vars.fontFamily = fontFamily; return this; },
    fontStyle: function(fontStyle) { this.vars.fontStyle = fontStyle; return this; },
    fontWeight: function(fontWeight) { this.vars.fontWeight = fontWeight; return this; },
    fontSize: function(fontSize) { this.vars.fontSize = fontSize; return this; },
    letterSpacing: function(letterSpacing) { this.vars.letterSpacing = letterSpacing; return this; },
    textDecoration: function(textDecoration) { this.vars.textDecoration = textDecoration; return this; },

    copy: function(group) {
      var t = new Rune.Text();
      t.vars.text = this.vars.text;
      this.shapeCopy(t, group);
      return t;
    }

  });

})();