var assign = require('object-assign');
var Shape = require('../mixins/shape');
var Box = require('../mixins/box');
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Image = function(url, x, y, width, height) {
  this.shape();
  this.box();
  this.state.url = url;
  this.state.x = x;
  this.state.y = y;
  this.state.width = width;
  this.state.height = height;
};

Image.prototype = {
  scale: function(scalar) {
    this.scaleBox(scalar);
    this.changed();
    return this;
  },

  copy: function(parent) {
    var copy = new Image();
    copy.state.url = this.state.url;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  render: function(opts) {
    var attr = {
      'xlink:href': Utils.s(this.state.url),
      x: Utils.s(this.state.x),
      y: Utils.s(this.state.y)
    };
    if (this.state.width) attr.width = Utils.s(this.state.width);
    if (this.state.height) attr.height = Utils.s(this.state.height);
    this.shapeAttributes(attr);
    return svg('image', attr);
  }
};

assign(Image.prototype, Shape, Box, { type: 'image' });

module.exports = Image;
