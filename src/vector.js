var Utils = require("./utils");
var ROUND_PRECISION = 9;

var Vector = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};

Vector.prototype = {
  type: "vector",

  set: function(x, y) {
    this.x = x;
    this.y = y;
  },

  add: function(vec) {
    return new Vector(this.x + vec.x, this.y + vec.y);
  },

  sub: function(vec) {
    return new Vector(this.x - vec.x, this.y - vec.y);
  },

  multiply: function(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  },

  divide: function(scalar) {
    var vec = new Vector(0, 0);
    if (scalar) {
      vec.x = this.x / scalar;
      vec.y = this.y / scalar;
    }
    return vec;
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
    var x = (vec.x - this.x) * scalar + this.x;
    var y = (vec.y - this.y) * scalar + this.y;
    return new Vector(x, y);
  },

  dot: function(vec) {
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
    return Utils.degrees(Math.atan2(this.y, this.x));
  },

  rotate: function(degrees) {
    var rad = Utils.radians(this.rotation() + degrees);
    var len = this.length();
    var x = Utils.round(Math.cos(rad) * len, ROUND_PRECISION);
    var y = Utils.round(Math.sin(rad) * len, ROUND_PRECISION);
    return new Vector(x, y);
  },

  limit: function(max) {
    const mSq = this.lengthSquared();
    if (mSq > max * max) {
      return this.divide(Math.sqrt(mSq)).multiply(max);
    }
    return this.copy();
  },

  copy: function() {
    return new Vector(this.x, this.y);
  },

  toString: function() {
    return "(x: " + this.x + ", y: " + this.y + ")";
  }
};

module.exports = Vector;
