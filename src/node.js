var assign = require("object-assign");
var Shape = require("./mixins/shape");
var svg = require("virtual-dom/virtual-hyperscript/svg");

// This Node class allows developers to inject random SVG nodes into
// the scene graph if Rune.js does not support what they are trying to do.
var Node = function(name, attr, children) {
  this.shape();
  this.state.name = name;
  this.state.attr = attr;
  this.state.children = children;
};

Node.prototype = {
  render: function(opts) {
    return svg(this.state.name, this.state.attr, this.state.children);
  }
};

assign(Node.prototype, Shape, { type: "node" });

module.exports = Node;
