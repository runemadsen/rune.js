(function() {

  var Mixins = Rune.Mixins = {

    Translatable : {
      x: 0,
      y: 0,
      rotation: 0
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