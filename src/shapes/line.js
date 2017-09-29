var assign = require("object-assign");
var Shape = require("../mixins/shape");
var Styles = require("../mixins/styles");
var Vector = require('../vector');
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Line = function(x, y, x2, y2) {
  this.shape();
  this.styles();
  this.state.x = x;
  this.state.y = y;
  this.state.x2 = x2;
  this.state.y2 = y2;
}

assign(Line.prototype, Shape, Styles, {

  type: "line",

  start: function(x, y, rel) {
    this.state.x = rel ? this.state.x + x : x;
    this.state.y = rel ? this.state.y + y : y;
    this.changed();
    return this;
  },

  end: function(x, y, rel) {
    this.state.x2 = rel ? this.state.x2 + x : x;
    this.state.y2 = rel ? this.state.y2 + y : y;
    this.changed();
    return this;
  },

  copy: function(parent) {
    var copy = new Line();
    copy.state.x2 = this.state.x2;
    copy.state.y2 = this.state.y2;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  scale: function(scalar) {
    this.scaleStyles(scalar);
    var start = new Vector(this.state.x, this.state.y)
    var end = new Vector(this.state.x2, this.state.y2)
    var vec = end.sub(start).multiply(scalar).add(start);
    this.state.x2 = vec.x;
    this.state.y2 = vec.y;
    this.changed();
    return this;
  },

  move: function(x, y, relative) {
    var change = new Vector(this.state.x2, this.state.y2).sub(new Vector(this.state.x, this.state.y));
    this.state.x = relative ? this.state.x + x : x;
    this.state.y = relative ? this.state.y + y : y;
    this.state.x2 = this.state.x + change.x;
    this.state.y2 = this.state.y + change.y;
    this.changed();
    return this;
  },

  render: function(opts) {
    var attr = {
      x1: Utils.s(this.state.x),
      y1: Utils.s(this.state.y),
      x2: Utils.s(this.state.x2),
      y2: Utils.s(this.state.y2)
    }
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('line', attr);
  }

});

module.exports = Line;
