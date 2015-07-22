(function() {

  var Mixins = Rune.Mixins = {

    Moveable : {

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
      width: 0,
      height: 0
    },

    Styleable : {

      fillColor: new Color(),
      fill: function(color) {
        this.fillColor = new Color(color);
        return this;
      },

      strokeColor: new Color()
    }

  };

})();