var Bezier = require('./bezier');
var Vector = require('./vector');
var Utils = require('./utils');

var Anchor = function() {};

Anchor.prototype = {

  type: "anchor",

  add: function(vec) {
    var a = this.copy();
    if(a.vec1) a.vec1 = a.vec1.add(vec);
    if(a.vec2) a.vec2 = a.vec2.add(vec);
    if(a.vec3) a.vec3 = a.vec3.add(vec);
    return a;
  },

  sub: function(vec) {
    var a = this.copy();
    if(a.vec1) a.vec1 = a.vec1.sub(vec);
    if(a.vec2) a.vec2 = a.vec2.sub(vec);
    if(a.vec3) a.vec3 = a.vec3.sub(vec);
    return a;
  },

  multiply: function(scalar) {
    var a = this.copy();
    if(a.vec1) a.vec1 = a.vec1.multiply(scalar);
    if(a.vec2) a.vec2 = a.vec2.multiply(scalar);
    if(a.vec3) a.vec3 = a.vec3.multiply(scalar);
    return a;
  },

  copy: function() {
    var a = new Anchor();
    a.command = this.command;
    if(this.vec1) a.vec1 = this.vec1.copy();
    if(this.vec2) a.vec2 = this.vec2.copy();
    if(this.vec3) a.vec3 = this.vec3.copy();
    return a;
  },

  setMove: function(x, y) {
    this.command = 'move';
    if (x instanceof Vector) {
      this.vec1 = x;
    } else {
      this.vec1 = new Vector(x, y);
    }
    return this;
  },

  setLine: function(x, y) {
    this.command = 'line';
    if (x instanceof Vector) {
      this.vec1 = x;
    } else {
      this.vec1 = new Vector(x, y);
    }
    return this;
  },

  setCurve: function(a, b, c, d, e, f) {
    // cubic bezier with two control points
    if(typeof f !== 'undefined') {
      this.command = 'cubic';
      this.vec1 = new Vector(a, b);
      this.vec2 = new Vector(c, d);
      this.vec3 = new Vector(e, f);
    }

    // quad bezier with one control point
    else {
      this.command = 'quad';
      this.vec1 = new Vector(a, b);
      this.vec2 = new Vector(c, d);
    }
    return this;
  },

  setClose: function() {
    this.command = 'close';
    return this;
  },

  length: function() {
    if(this.command == 'move') {
      return 0;
    }
    else if(this.command == 'line') {
      return this.vec1.length();
    }
    else if(this.command == 'quad') {
      return new Bezier(0, 0, this.vec1.x, this.vec1.y, this.vec2.x, this.vec2.y).length();
    }
    else if(this.command == 'cubic') {
      return new Bezier(0, 0, this.vec1.x, this.vec1.y, this.vec2.x, this.vec2.y, this.vec3.x, this.vec3.y).length();
    }
    else {
      throw new Error("Cannot compute length for this type of anchor")
    }
  },

  vectorAt: function(scalar) {

    if(scalar > 1) scalar = 1;
    if(scalar < 0) scalar = 0;

    var ax, bx, cx;
    var ay, by, cy;
    var tSquared, tDoubled, tCubed;
    var dx, dy;

    if(this.command == 'line') {
      return new Vector(this.vec1.x, this.vec1.y).multiply(scalar)
    }
    else if(this.command == 'quad') {
      return new Bezier(0, 0, this.vec1.x, this.vec1.y, this.vec2.x, this.vec2.y).get(scalar);
    }
    else if(this.command == 'cubic') {
      return new Bezier(0, 0, this.vec1.x, this.vec1.y, this.vec2.x, this.vec2.y, this.vec3.x, this.vec3.y).get(scalar);
    }
    else {
      throw new Error("Cannot compute vectorAt for this type of anchor")
    }
  }

}

module.exports = Anchor;
