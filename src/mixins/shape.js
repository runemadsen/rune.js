var Vector = require('../vector');
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Shape = {
  changed: function() {
    if (this.parent && !this.parentNotified) {
      // let the parent know that this child changed
      this.parent.changedChildren.push(this.childId);
      // let's not do it again
      this.parentNotified = true;
      // let the parent do this for its parent
      this.parent.changed();
    }
  },

  shape: function(copy) {
    this.state = this.state || {};
    this.state.x = copy ? copy.state.x : 0;
    this.state.y = copy ? copy.state.y : 0;
    this.state.rotation = copy ? copy.state.rotation : 0;
    this.state.rotationX = copy ? copy.state.rotationX : 0;
    this.state.rotationY = copy ? copy.state.rotationY : 0;
  },

  move: function(x, y, relative) {
    this.state.x = relative ? this.state.x + x : x;
    this.state.y = relative ? this.state.y + y : y;
    this.changed();
    return this;
  },

  rotate: function(deg, x, y, relative) {
    this.state.rotation = deg;
    if (x || y) {
      this.state.rotationX = x || 0;
      this.state.rotationY = y || 0;
    }
    if (relative) {
      this.state.rotationX += this.state.x;
      this.state.rotationY += this.state.y;
    }
    this.changed();
    return this;
  },

  addTo: function(group) {
    group.add(this);
    return this;
  },

  removeParent: function() {
    if (this.parent) this.parent.remove(this);
    return this;
  },

  stagepos: function() {
    var vec = new Vector(this.state.x, this.state.y);
    if (this.parent) {
      vec = vec.add(this.parent.stagepos());
    }
    return vec;
  },

  // Render
  // ---------------------------------------------------

  shapeAttributes: function(attr) {
    var strings = [];

    if (this.state.rotation) {
      var rot = 'rotate(' + this.state.rotation;
      if (this.state.rotationX || this.state.rotationY)
        rot += ' ' + this.state.rotationX + ' ' + this.state.rotationY;
      strings.push(rot + ')');
    }

    if (
      (this.type == 'group' ||
        this.type == 'path' ||
        this.type == 'polygon' ||
        this.type == 'grid' ||
        this.type == 'triangle') &&
      (this.state.x || this.state.y)
    ) {
      strings.push('translate(' + this.state.x + ' ' + this.state.y + ')');
    }

    if (strings.length > 0) attr.transform = strings.join(' ').trim();

    return attr;
  },

  // Render Debug
  // ---------------------------------------------------

  debugCircle: function(x, y) {
    return svg('circle', {
      cx: Utils.s(x),
      cy: Utils.s(y),
      r: Utils.s(4),
      fill: 'rgb(212, 18, 229)'
    });
  },

  debugRect: function(x, y, width, height) {
    return svg('rect', {
      x: Utils.s(x),
      y: Utils.s(y),
      width: Utils.s(width),
      height: Utils.s(height),
      stroke: 'rgb(212, 18, 229)',
      fill: 'none'
    });
  },

  debugLine: function(x1, y1, x2, y2) {
    return svg('line', {
      x1: Utils.s(x1),
      y1: Utils.s(y1),
      x2: Utils.s(x2),
      y2: Utils.s(y2),
      stroke: 'rgb(212, 18, 229)',
      fill: 'none'
    });
  }
};

module.exports = Shape;
