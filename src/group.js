var without = require("lodash/array/without");
var assign = require("lodash/object/assign");
var flatten = require("lodash/array/flatten");
var each = require("lodash/collection/each");
var map = require("lodash/collection/map");
var Shape = require("./mixins/shape");
var Utils = require('./utils');
var Vector = require('./vector');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Group = function(x, y) {
  this.shape();
  this.children = [];
  this.changedChildren = [];
  this.renderedChildren = [];
  if(typeof x !== 'undefined') this.state.x = x;
  if(typeof y !== 'undefined') this.state.y = y;
}

Group.prototype = {

  add: function(child) {
    if(child.parent) child.parent.remove(child);
    this.children.push(child);
    child.parent = this;
    child.childId = this.children.length-1;
    child.changed();
  },

  remove: function(child) {
    this.children = without(this.children, child);
    this.changedChildren = without(this.changedChildren, child.childId);

    // Lower id's of all children above by one
    for(var i = child.childId; i < this.children.length; i++) {
      this.children[i].childId--;
    }

    // lower id's of all changedChildren by one
    for(var i = 0; i < this.changedChildren; i++) {
      if(this.changedChildren[i] > child.childId) this.changedChildren[i]--;
    }

    child.childId = null;
    child.parentNotified = false;
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
      child.state.x *= scalar;
      child.state.y *= scalar;
      child.scale(scalar);
    });
    return this;
  },

  render: function(opts) {
    if(!this.children || this.children.length == 0) return;
    var attr = this.shapeAttributes({});
    return svg('g', attr, this.renderChildren(opts));
  },

  renderChildren: function(opts) {

    // loop through the changed children
    while(this.changedChildren.length > 0) {
      var childId = this.changedChildren.shift();
      this.renderedChildren[childId] = this.children[childId].render(opts);
      this.children[childId].parentNotified = false;
    }

    // FIGURE OUT HOW NOT TO FLATTEN EVERY TIME!
    return flatten(this.renderedChildren, true);
  }

}

assign(Group.prototype, Shape, {type: "group"});

module.exports = Group;
