(function(Rune) {

  var Vector = Rune.Vector = function(x, y) {

    this.x = x || 0;
    this.y = y || 0;

  };

  _.extend(Vector.prototype, {

    set: function(x, y) {
      this.x = x;
      this.y = y;
    },

    copy: function() {
      return new Rune.Vector(this.x, this.y);
    }

  });

})(Rune);