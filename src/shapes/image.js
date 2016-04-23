var assign = require("lodash/object/assign");
var Moveable = require("../mixins/moveable");
var Styleable = require("../mixins/styleable");
var Sizeable = require("../mixins/sizeable");
var VectorsAcceptable = require("../mixins/vectors_acceptable");
var Utils = require('../utils');

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
    return this;
  },

  copy(parent) {
    var copy = new Image();
    copy.vars.url = this.vars.url;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }

}

assign(Image.prototype, Moveable, Sizeable, VectorsAcceptable, { type: "image" });

module.exports = Image;
