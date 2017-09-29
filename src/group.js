var assign = require('object-assign');
var Shape = require('./mixins/shape');
var Styles = require('./mixins/styles');
var Parent = require('./mixins/parent');
var Utils = require('./utils');
var Vector = require('./vector');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Group = function(x, y) {
  this.shape();
  this.setupParent();
  if (typeof x !== 'undefined') this.state.x = x;
  if (typeof y !== 'undefined') this.state.y = y;
};

Group.prototype = {
  add: function(child) {
    this.addChild(child);
  },

  remove: function(child) {
    this.removeChild(child);
  },

  copy: function(parent) {
    var copy = new Group();
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].copy(copy);
    }
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  scale: function(scalar) {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].state.x *= scalar;
      this.children[i].state.y *= scalar;
      this.children[i].scale(scalar);
    }
    return this;
  },

  render: function(opts) {
    if (!this.children || this.children.length == 0) return;
    var attr = this.shapeAttributes({});
    this.stylesAttributes(attr);
    return svg('g', attr, this.renderChildren(opts));
  }
};

assign(Group.prototype, Shape, Styles, Parent, { type: 'group' });

module.exports = Group;
