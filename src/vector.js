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

    add : function(vec) {
      this.x += vec.x;
      this.y += vec.y;
      return this;
    },

    sub: function(vec) {
      this.x -= vec.x;
      this.y -= vec.y;
      return this;
    },

    multiply: function(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    },

    divide: function(scalar) {
      if(scalar) {
        this.x /= scalar;
        this.y /= scalar;
      } else {
        this.set(0, 0);
      }
      return this;
    },

    distance: function(vec) {
      return Math.sqrt(this.distanceSquared(vec));
    },

    distanceSquared: function(vec) {
      var dx = this.x - vec.x;
      var dy = this.y - vec.y;
      return dx * dx + dy * dy;
    },

    lerp: function(vec, scalar) {
      this.x = (vec.x - this.x) * scalar + this.x;
      this.y = (vec.y - this.y) * scalar + this.y;
      return this;
    },

    dot : function(vec) {
      return this.x * vec.x + this.y * vec.y;
    },

    length: function() {
      return Math.sqrt(this.lengthSquared());
    },

    lengthSquared: function() {
      return this.x * this.x + this.y * this.y;
    },

    normalize: function() {
      return this.divide(this.length());
    },

    rotation: function() {
      return Rune.degrees(Math.atan2(this.y, this.x));
    },

    rotate: function(degrees) {
      var rad = Rune.radians(this.rotation() + degrees);
      var len = this.length();
      this.x = Math.cos(rad) * len;
      this.y = Math.sin(rad) * len;
      return this;
    },

    copy: function() {
      return new Rune.Vector(this.x, this.y);
    }

  });

})(Rune);