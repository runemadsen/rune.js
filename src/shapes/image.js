var assign = require("lodash/object/assign");
var Shape = require("../mixins/shape");
var Styles = require("../mixins/styles");
var Box = require("../mixins/box");
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Image = function(url, x, y, width, height) {
  this.shape();
  this.box();
  this.vars.url = url;
  this.vars.x = x;
  this.vars.y = y;
  this.vars.width = width;
  this.vars.height = height;
}

Image.prototype = {

  scale: function(scalar) {
    this.scaleBox(scalar);
    this.changed();
    return this;
  },

  copy: function(parent) {
    var copy = new Image();
    copy.vars.url = this.vars.url;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  render: function(opts) {
    var attr = {
      "xlink:href" : Utils.s(this.vars.url),
      x: Utils.s(this.vars.x),
      y: Utils.s(this.vars.y)
    }
    this.optionalAttributes(attr, {
      "width" : "width",
      "height" : "height"
    });
    this.shapeAttributes(attr);
    return svg('image', attr);
  }

}

assign(Image.prototype, Shape, Box, { type: "image" });

module.exports = Image;
