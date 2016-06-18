var Vector = require('../vector');
var Utils = require("../utils");
var each = require("lodash/collection/each");
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Shape = {

  changed: function() {
    if(this.parent && !this.parentNotified) {

      // let the parent know that this child changed
      this.parent.changedChildren.push(this.childId);

      // let's not do it again
      this.parentNotified = true;

      // let the parent do this for its parent
      this.parent.changed();
    }
  },

  shape: function(copy) {
    this.vars = this.vars || {};
    this.vars.x = copy ? copy.vars.x : 0;
    this.vars.y = copy ? copy.vars.y : 0;
    this.vars.rotation = copy ? copy.vars.rotation : 0;
    this.vars.rotationX = copy ? copy.vars.rotationX : 0;
    this.vars.rotationY = copy ? copy.vars.rotationY : 0;
  },

  move: function(x, y, relative) {
    this.vars.x = relative ? this.vars.x + x : x;
    this.vars.y = relative ? this.vars.y + y : y;
    this.changed();
    return this;
  },

  rotate: function(deg, x, y, relative) {
    this.vars.rotation = deg;
    if(x || y) {
      this.vars.rotationX = x || 0;
      this.vars.rotationY = y || 0;
    }
    if(relative) {
      this.vars.rotationX += this.vars.x;
      this.vars.rotationY += this.vars.y;
    }
    this.changed();
    return this;
  },

  addTo: function(group) {
    group.add(this);
    return this;
  },

  removeParent: function() {
    if(this.parent) this.parent.remove(this);
    return this;
  },

  stagepos: function() {
    var vec = new Vector(this.vars.x, this.vars.y);
    if(this.parent) {
      vec = vec.add(this.parent.stagepos());
    }
    return vec;
  },

  // Render
  // ---------------------------------------------------

  shapeAttributes: function(attr) {

    var strings = [];

    if(this.vars.rotation) {
      var rot = "rotate(" + this.vars.rotation;
      if(this.vars.rotationX || this.vars.rotationY)
        rot += " " + this.vars.rotationX + " " + this.vars.rotationY;
      strings.push(rot + ")");
    }

    if((this.type == "group" || this.type == "path" || this.type == "polygon" || this.type == "grid" || this.type == "triangle") && (this.vars.x || this.vars.y)) {
      strings.push("translate(" + this.vars.x + " " + this.vars.y + ")");
    }

    if(strings.length > 0)
      attr.transform = strings.join(" ").trim();

    return attr;
  },

  optionalAttributes: function(attr, keys) {
    each(keys, function(attribute, variable) {
      if(this.vars[variable]) {
        attr[attribute] = Utils.s(this.vars[variable]);
      }
    }, this);
  },

  // Render Debug
  // ---------------------------------------------------

  debugCircle: function(x, y) {
    return svg('circle', {
      cx: Utils.s(x),
      cy: Utils.s(y),
      r: Utils.s(4),
      fill: "rgb(212, 18, 229)"
    });
  },

  debugRect: function(x, y, width, height) {
    return svg('rect', {
      x: Utils.s(x),
      y: Utils.s(y),
      width: Utils.s(width),
      height: Utils.s(height),
      stroke: "rgb(212, 18, 229)",
      fill: "none"
    });
  },

  debugLine: function(x1, y1, x2, y2) {
    return svg('line', {
      x1: Utils.s(x1),
      y1: Utils.s(y1),
      x2: Utils.s(x2),
      y2: Utils.s(y2),
      stroke: "rgb(212, 18, 229)",
      fill: "none"
    });
  }

};

module.exports = Shape;
