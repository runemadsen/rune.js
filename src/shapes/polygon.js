var assign = require('object-assign');
var Shape = require('../mixins/shape');
var Styles = require('../mixins/styles');
var Vector = require('../vector');
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Polygon = function(x, y) {
  this.shape();
  this.styles();
  this.state.vectors = [];
  if (typeof x !== 'undefined') this.state.x = x;
  if (typeof y !== 'undefined') this.state.y = y;
};

Polygon.prototype = {
  lineTo: function(x, y) {
    if (x instanceof Vector) {
      this.state.vectors.push(x);
    } else {
      this.state.vectors.push(new Vector(x, y));
    }
    this.changed();
    return this;
  },

  length: function() {
    var len = 0;
    for (var i = 0; i < this.state.vectors.length; i++) {
      var start = this.state.vectors[i];
      var stop = this.state.vectors[(i + 1) % this.state.vectors.length];
      len += stop.sub(start).length();
    }
    return len;
  },

  vectorAtLength: function(len) {
    var tmpLen = 0;

    for (var i = 0; i < this.state.vectors.length; i++) {
      var start = this.state.vectors[i];
      var stop = this.state.vectors[(i + 1) % this.state.vectors.length];
      var vec = stop.sub(start);
      var veclen = vec.length();

      if (tmpLen + veclen > len) {
        var remaining = len - tmpLen;
        return start.add(vec.normalize().multiply(remaining));
      }

      tmpLen += veclen;
    }

    return this.state.vectors[0].copy();
  },

  vectorAt: function(scalar) {
    return this.vectorAtLength(this.length() * scalar);
  },

  area: function() {
    var area = 0;
    for (var i = 0; i < this.state.vectors.length - 1; i++) {
      area +=
        this.state.vectors[i].x * this.state.vectors[i + 1].y -
        this.state.vectors[i + 1].x * this.state.vectors[i].y;
    }
    area /= 2;
    return Math.abs(area);
  },

  bounds: function() {
    var xmax = undefined;
    var ymax = undefined;
    var xmin = undefined;
    var ymin = undefined;

    for (var i = 0; i < this.state.vectors.length; i++) {
      if (typeof xmin === 'undefined' || this.state.vectors[i].x < xmin)
        xmin = this.state.vectors[i].x;
      if (typeof xmax === 'undefined' || this.state.vectors[i].x > xmax)
        xmax = this.state.vectors[i].x;
      if (typeof ymin === 'undefined' || this.state.vectors[i].y < ymin)
        ymin = this.state.vectors[i].y;
      if (typeof ymax === 'undefined' || this.state.vectors[i].y > ymax)
        ymax = this.state.vectors[i].y;
    }

    return {
      x: xmin,
      y: ymin,
      width: xmax - xmin,
      height: ymax - ymin
    };
  },

  centroid: function() {
    var areaAcc = 0.0;
    var xAcc = 0.0;
    var yAcc = 0.0;
    for (var i = 0; i < this.state.vectors.length; i++) {
      var start = this.state.vectors[i];
      var stop = this.state.vectors[(i + 1) % this.state.vectors.length];
      areaAcc += start.x * stop.y - stop.x * start.y;
      xAcc += (start.x + stop.x) * (start.x * stop.y - stop.x * start.y);
      yAcc += (start.y + stop.y) * (start.x * stop.y - stop.x * start.y);
    }
    areaAcc /= 2.0;
    var x = xAcc / (6.0 * areaAcc);
    var y = yAcc / (6.0 * areaAcc);
    return new Vector(x, y);
  },

  toPolygon: function(opts, parent) {
    if (opts && opts.spacing) {
      var poly = new Polygon(this.state.x, this.state.y);
      var len = this.length();
      var num = len / opts.spacing;
      for (var i = 0; i < num; i++) {
        var vec = this.vectorAtLength(i * opts.spacing);
        poly.lineTo(vec.x, vec.y);
      }

      Utils.copyMixinVars(this, poly);
      Utils.groupLogic(poly, this.parent, parent);

      return poly;
    }

    return this;
  },

  copy: function(parent) {
    var copy = new Polygon();
    copy.state.vectors = this.state.vectors.map(function(v) {
      return v.copy();
    });
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  // Code from ContainsPoint function here:
  // http://polyk.ivank.net
  contains: function(x, y) {
    // get stage position
    var addPos = this.stagepos();

    // map array of vectors to flat array of xy numbers
    // This might be slow, so let's rewrite this at some point.

    var p = Utils.flatten(
      this.state.vectors.map(function(vector) {
        return [addPos.x + vector.x, addPos.y + vector.y];
      }, this)
    );

    var n = p.length >> 1;
    var ax,
      ay = p[2 * n - 3] - y,
      bx = p[2 * n - 2] - x,
      by = p[2 * n - 1] - y;

    var lup;
    for (var i = 0; i < n; i++) {
      ax = bx;
      ay = by;
      bx = p[2 * i] - x;
      by = p[2 * i + 1] - y;
      if (ay == by) continue;
      lup = by > ay;
    }

    var depth = 0;
    for (var i = 0; i < n; i++) {
      ax = bx;
      ay = by;
      bx = p[2 * i] - x;
      by = p[2 * i + 1] - y;
      if (ay < 0 && by < 0) continue; // both "up" or both "down"
      if (ay > 0 && by > 0) continue; // both "up" or both "down"
      if (ax < 0 && bx < 0) continue; // both points on the left

      if (ay == by && Math.min(ax, bx) <= 0) return true;
      if (ay == by) continue;

      var lx = ax + (bx - ax) * -ay / (by - ay);
      if (lx == 0) return true; // point on edge
      if (lx > 0) depth++;
      if (ay == 0 && lup && by > ay) depth--; // hit vertex, both up
      if (ay == 0 && !lup && by < ay) depth--; // hit vertex, both down
      lup = by > ay;
    }

    return (depth & 1) == 1;
  },

  scale: function(scalar) {
    this.scaleStyles(scalar);
    this.state.vectors = this.state.vectors.map(function(vec) {
      return vec.multiply(scalar);
    });
    this.changed();
    return this;
  },

  render: function(opts) {
    var attr = {
      points: this.state.vectors
        .map(function(vec) {
          return vec.x + ' ' + vec.y;
        })
        .join(' ')
    };
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('polygon', attr);
  }
};

assign(Polygon.prototype, Shape, Styles, { type: 'polygon' });

module.exports = Polygon;
