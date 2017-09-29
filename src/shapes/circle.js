var assign = require('object-assign');
var Shape = require('../mixins/shape');
var Styles = require('../mixins/styles');
var Ellipse = require('./ellipse');
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Circle = function(x, y, radius) {
  this.shape();
  this.styles();
  this.state.x = x;
  this.state.y = y;
  this.state.radius = radius;
};

Circle.prototype = {
  toPolygon: function(opts, parent) {
    var ellipse = new Ellipse(
      this.state.x,
      this.state.y,
      this.state.radius * 2,
      this.state.radius * 2
    );
    var poly = ellipse.toPolygon(opts, false);
    Utils.copyMixinVars(this, poly);
    Utils.groupLogic(poly, this.parent, parent);
    return poly;
  },

  radius: function(radius, relative) {
    this.state.radius = relative ? this.state.radius + radius : radius;
    this.changed();
    return this;
  },

  scale: function(scalar) {
    this.scaleStyles(scalar);
    this.state.radius *= scalar;
    this.changed();
    return this;
  },

  copy: function(parent) {
    var copy = new Circle();
    copy.state.radius = this.state.radius;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  render: function(opts) {
    var attr = {
      cx: Utils.s(this.state.x),
      cy: Utils.s(this.state.y),
      r: Utils.s(this.state.radius)
    };
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('circle', attr);
  }
};

assign(Circle.prototype, Shape, Styles, { type: 'circle' });

module.exports = Circle;
