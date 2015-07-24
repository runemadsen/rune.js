(function() {

  Rune.BUTT = "butt";
  Rune.ROUND = "round";
  Rune.SQUARE = "square";
  Rune.MITER = "miter";
  Rune.BEVEL = "bevel";

  var Mixins = Rune.Mixins = {

    Moveable : {

      moveable: function() {
        this.vars = this.vars || {};
        this.vars.x = 0;
        this.vars.y = 0;
        this.vars.rotation = 0;
      },

      move: function(x, y, relative) {
        this.vars.x = relative ? this.vars.x + x : x;
        this.vars.y = relative ? this.vars.y + y : y;
        return this;
      },

      rotate: function(deg, relative) {
        this.vars.rotation = relative ? this.vars.rotation + deg : deg;
        return this;
      }
    },

    Sizeable : {

      sizeable: function() {
        this.vars = this.vars || {};
        this.vars.width = 0;
        this.vars.height = 0;
      }

    },

    Styleable : {

      styleable: function() {
        this.vars = this.vars || {};
        this.vars.fill = new Color();
        this.vars.stroke = new Color();
        this.vars.strokeWidth = false;
        this.vars.strokeCap = false;
        this.vars.strokeJoin = false;
        this.vars.strokeMiterlimit = false;
        this.vars.strokeDash = false;
      },

      fill: function(a, b, c, d) {
        if(a === false) this.vars.fill = false;
        else            this.vars.fill = Rune.Color.inputToColor(a, b, c, d);
        return this;
      },

      stroke: function(a, b, c, d) {
        if(a === false) this.vars.stroke = false;
        else            this.vars.stroke = Rune.Color.inputToColor(a, b, c, d);
        return this;
      }
    }

  };

})();