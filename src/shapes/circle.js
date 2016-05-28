var assign = require("lodash/object/assign");
var Shape = require("../mixins/shape");
var Styles = require("../mixins/styles");
var Ellipse = require("./ellipse");
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Circle = function(x, y, radius) {
  this.shape();
  this.styles();
  this.vars.x = x;
  this.vars.y = y;
  this.vars.radius = radius;
}

Circle.prototype = {

  toPolygon: function(opts, parent) {
    var ellipse = new Ellipse(this.vars.x, this.vars.y, this.vars.radius*2, this.vars.radius*2);
    var poly = ellipse.toPolygon(opts, false);
    Utils.copyMixinVars(this, poly);
    Utils.groupLogic(poly, this.parent, parent);
    return poly;
  },

  scale: function(scalar) {
    this.scaleStyles(scalar);
    this.vars.radius *= scalar;
    this.changed();
    return this;
  },

  copy: function(parent) {
    var copy = new Circle();
    copy.vars.radius = this.vars.radius;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  render: function(opts) {
    var attr = {
      cx: Utils.s(this.vars.x),
      cy: Utils.s(this.vars.y),
      r: Utils.s(this.vars.radius)
    }
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('circle', attr);
  }

}

assign(Circle.prototype, Shape, Styles, { type: "circle" });

module.exports = Circle;
