var assign = require("lodash/object/assign");
var Moveable = require("../mixins/moveable");
var Styleable = require("../mixins/styleable");
var Sizeable = require("../mixins/sizeable");
var VectorsAcceptable = require("../mixins/vectors_acceptable");
var Polygon = require('./polygon');
var Utils = require('../utils');

var Rectangle = function(x, y, width, height) {
  this.moveable();
  this.sizeable();
  this.styleable();
  this.vectorsAcceptable(arguments);
}

Rectangle.prototype = {

  init: function(x, y, width, height) {
    this.vars.x = x;
    this.vars.y = y;
    this.vars.width = width;
    this.vars.height = height;
  },

  round: function(rx, ry) {
    if(!ry) ry = rx;
    this.vars.rx = rx;
    this.vars.ry = ry;
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
    this.scaleSizeable(scalar);
    this.scaleStyleable(scalar);
    return this;
  },

  render: function(opts) {
    var attr = {
      x: Utils.s(thisvars.x),
      y: Utils.s(thisvars.y),
      width: Utils.s(thisvars.width),
      height: Utils.s(thisvars.height)
    }
    if(thisvars.rx)  attr.rx = Utils.s(thisvars.rx);
    if(thisvars.ry)  attr.ry = Utils.s(thisvars.ry);
    this.moveableAttributes(attr);
    this.styleableAttributes(attr);
    return svg('rect', attr);
  }
}

assign(Rectangle.prototype, Moveable, Sizeable, Styleable, VectorsAcceptable, { type: "rectangle" });

module.exports = Rectangle;
