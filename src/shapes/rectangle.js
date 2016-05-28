var assign = require("lodash/object/assign");
var Shape = require("../mixins/shape");
var Styles = require("../mixins/styles");
var Box = require("../mixins/box");
var Polygon = require('./polygon');
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Rectangle = function(x, y, width, height) {
  this.shape();
  this.box();
  this.styles();
  this.vars.x = x;
  this.vars.y = y;
  this.vars.width = width;
  this.vars.height = height;
}

Rectangle.prototype = {

  round: function(rx, ry) {
    if(!ry) ry = rx;
    this.vars.rx = rx;
    this.vars.ry = ry;
    this.changed();
    return this;
  },

  toPolygon: function(opts, parent) {
    var poly =  new Polygon(this.vars.x, this.vars.y)
      .lineTo(0, 0)
      .lineTo(this.vars.width, 0)
      .lineTo(this.vars.width, this.vars.height)
      .lineTo(0, this.vars.height);

    if(opts) poly = poly.toPolygon(opts, false);

    Utils.copyMixinVars(this, poly);
    Utils.groupLogic(poly, this.parent, parent);

    return poly;
  },

  copy: function(parent) {
    var copy = new Rectangle();
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  scale: function(scalar) {
    this.scaleBox(scalar);
    this.scaleStyles(scalar);
    this.changed();
    return this;
  },

  render: function(opts) {
    var attr = {
      x: Utils.s(this.vars.x),
      y: Utils.s(this.vars.y),
      width: Utils.s(this.vars.width),
      height: Utils.s(this.vars.height)
    }
    if(this.vars.rx)  attr.rx = Utils.s(this.vars.rx);
    if(this.vars.ry)  attr.ry = Utils.s(this.vars.ry);
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('rect', attr);
  }
}

assign(Rectangle.prototype, Shape, Box, Styles, { type: "rectangle" });

module.exports = Rectangle;
