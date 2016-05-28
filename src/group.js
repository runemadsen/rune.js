var without = require("lodash/array/without");
var assign = require("lodash/object/assign");
var flatten = require("lodash/array/flatten");
var each = require("lodash/collection/each");
var map = require("lodash/collection/map");
var Moveable = require("./mixins/moveable");
var VectorsAcceptable = require("./mixins/vectors_acceptable");
var Utils = require('./utils');
var Vector = require('./vector');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Group = function(x, y) {
  this.moveable();
  this.vectorsAcceptable(arguments);
}

Group.prototype = {

  init: function(x, y) {
    this.children = [];
    if(typeof x !== 'undefined') this.vars.x = x;
    if(typeof y !== 'undefined') this.vars.y = y;
  },

  add: function(child) {
    if(child.parent) child.parent.remove(child);
    child.childId = this.children.length;
    this.children.push(child);
    child.parent = this;
  },

  remove: function(child) {
    this.children = without(this.children, child);
    child.childId = null;
    child.parent = false;
  },

  copy: function(parent) {
    var copy = new Group();
    for(var i = 0; i < this.children.length; i++) {
      this.children[i].copy(copy)
    }
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  scale: function(scalar) {
    each(this.children, function(child) {
      child.vars.x *= scalar;
      child.vars.y *= scalar;
      child.scale(scalar);
    });
    return this;
  },

  render: function(opts) {
    if(!this.children || this.children.length == 0) return;
    var attr = this.moveableAttributes({});
    return svg('g', attr, this.renderChildren(opts));
  },

  renderChildren: function(opts) {
    var children = map(this.children, function(child) {
      return child.render(opts);
    });
    return flatten(children, true);
  }

}

// Should we figure out a better way to do mixins for ES6?
assign(Group.prototype, Moveable, VectorsAcceptable, {type: "group"});

module.exports = Group;
