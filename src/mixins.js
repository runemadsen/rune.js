(function() {

  Rune.BUTT = "butt";
  Rune.ROUND = "round";
  Rune.SQUARE = "square";
  Rune.MITER = "miter";
  Rune.BEVEL = "bevel";

  var Mixins = Rune.Mixins = {

    Moveable : {

      moveable: function(copy) {
        this.vars = this.vars || {};
        this.vars.x = copy ? copy.vars.x : 0;
        this.vars.y = copy ? copy.vars.y : 0;
        this.vars.rotation = copy ? copy.vars.rotation : 0;
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

      sizeable: function(copy) {
        this.vars = this.vars || {};
        this.vars.width = copy ? copy.vars.width : 0;
        this.vars.height = copy ? copy.vars.height : 0;
      }

    },

    Styleable : {

      styleable: function(copy) {
        this.vars = this.vars || {};
        this.vars.fill = copy ? copy.vars.fill.clone() : new Color();
        this.vars.stroke = copy ? copy.vars.stroke.clone() : new Color();
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
      },

      strokeWidth:      function(val) { this.vars.strokeWidth = val; return this; },
      strokeCap:        function(val) { this.vars.strokeCap = val; return this; },
      strokeJoin:       function(val) { this.vars.strokeJoin = val; return this; },
      strokeMiterlimit: function(val) { this.vars.strokeMiterlimit = val; return this; },
      strokeDash:       function(val) { this.vars.strokeDash = val; return this; },
      strokeDashOffset: function(val) { this.vars.strokeDashOffset= val; return this; }
    }

  };

})();