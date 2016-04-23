var assign = require("lodash/object/assign");
var Moveable = require("../mixins/moveable");
var Sizeable = require("../mixins/sizeable");
var Styleable = require("../mixins/styleable");
var VectorsAcceptable = require("../mixins/vectors_acceptable");
var Polygon = require('./polygon');
var Utils = require('../utils');

var Ellipse = function(x, y, width, height) {
  this.moveable();
  this.sizeable();
  this.styleable();
  this.vectorsAcceptable(arguments);
}

Ellipse.prototype = {

  init: function(x, y, width, height) {
    this.vars.x = x;
    this.vars.y = y;
    this.vars.width = width;
    this.vars.height = height;
  },

  toPolygon: function(opts, parent) {

    var numVectors = 16;

    // if we're calculating the number of vectors based on spacing
    // find circumference and divide by spacing.
    if(opts && opts.spacing) {
      var circumference = Math.PI * (this.vars.width+this.vars.height);
      numVectors = circumference / opts.spacing;
    }

    var vectorAngle = 360/numVectors;

    var poly =  new Polygon(this.vars.x, this.vars.y);
    for(var i = 0; i < numVectors; i++) {
      var x = Math.cos(Utils.radians(i * vectorAngle)) * this.vars.width;
      var y = Math.sin(Utils.radians(i * vectorAngle)) * this.vars.height;
      poly.lineTo(x, y);
    }

    Utils.copyMixinVars(this, poly);
    Utils.groupLogic(poly, this.parent, parent);

    return poly;
  },

  scale: function(scalar) {
    this.scaleSizeable(scalar);
    this.scaleStyleable(scalar);
    return this;
  },

  copy(parent) {
    var copy = new Ellipse();
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }

}

assign(Ellipse.prototype, Moveable, Sizeable, Styleable, VectorsAcceptable, {type: "ellipse"});

module.exports = Ellipse;
