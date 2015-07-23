(function() {

  var Mixins = Rune.Mixins = {

    Moveable : {
      moveable: true,

      x: 0,
      y: 0,
      move: function(x, y, relative) {
        this.x = relative ? this.x + x : x;
        this.y = relative ? this.y + y : y;
        return this;
      },

      rotation: 0,
      rotate: function(deg, relative) {
        this.rotation = relative ? this.rotation + deg : deg;
        return this;
      }
    },

    Sizeable : {
      sizeable: true,

      width: 0,
      height: 0
    },

    Styleable : {
      styleable: true,

      fillColor: new Color(),
      fill: function(a, b, c, d) {
        this.fillColor = Rune.Color.inputToColor(a, b, c, d);
        return this;
      },

      strokeColor: new Color(),
      stroke: function(a, b, c, d) {
        this.strokeColor = Rune.Color.inputToColor(a, b, c, d);
        return this;
      }
    }

  };

})();