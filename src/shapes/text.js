var assign = require('object-assign');
var Shape = require('../mixins/shape');
var Styles = require('../mixins/styles');
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var map = {
  textAlign: 'text-align',
  fontFamily: 'font-family',
  fontStyle: 'font-style',
  fontWeight: 'font-weight',
  fontSize: 'font-size',
  letterSpacing: 'letter-spacing',
  textDecoration: 'text-decoration'
};
var keys = Object.keys(map);

var Text = function(text, x, y) {
  this.shape();
  this.styles();
  this.state.text = text;
  this.state.x = x;
  this.state.y = y;
  this.state.fontSize = 16;
};

Text.prototype = {
  toPolygon: function() {
    throw new Error('You need the Rune.Font plugin to convert text to polygon');
  },

  copy: function(parent) {
    var copy = new Text();
    copy.state.text = this.state.text;
    for (var i = 0; i < keys.length; i++) {
      copy.state[keys[i]] = this.state[keys[i]];
    }
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  scale: function(scalar) {
    this.scaleStyles(scalar);
    this.state.fontSize *= scalar;
    this.changed();
    return this;
  },

  render: function(opts) {
    var attr = {
      x: Utils.s(this.state.x),
      y: Utils.s(this.state.y)
    };
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);

    for (var i = 0; i < keys.length; i++) {
      if (this.state[keys[i]]) {
        attr[map[keys[i]]] = Utils.s(this.state[keys[i]]);
      }
    }

    // handle textalign conversion
    if (attr['text-align']) {
      var translate = { left: 'start', center: 'middle', right: 'end' };
      attr['text-anchor'] = translate[attr['text-align']];
    }

    return svg('text', attr, this.state.text);
  }
};

// Generate setters
for (var i = 0; i < keys.length; i++) {
  Text.prototype[keys[i]] = Utils.getSetter(keys[i]);
}

assign(Text.prototype, Shape, Styles, { type: 'text' });

module.exports = Text;
