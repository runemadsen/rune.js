var assign = require("lodash/object/assign");
var Moveable = require("../mixins/moveable");
var Styleable = require("../mixins/styleable");
var Sizeable = require("../mixins/sizeable");
var VectorsAcceptable = require("../mixins/vectors_acceptable");
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Image = function(url, x, y, width, height) {
  this.moveable();
  this.sizeable();
  this.vectorsAcceptable(arguments);
}

Image.prototype = {

  init: function(url, x, y, width, height) {
    this.vars.url = url;
    this.vars.x = x;
    this.vars.y = y;
    this.vars.width = width;
    this.vars.height = height;
  },

  scale: function(scalar) {
    this.scaleSizeable(scalar);
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
    this.moveableAttributes(attr);
    return svg('image', attr);
  }

}

assign(Image.prototype, Moveable, Sizeable, VectorsAcceptable, { type: "image" });

module.exports = Image;
