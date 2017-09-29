var assign = require('object-assign');
var Shape = require('../mixins/shape');
var Styles = require('../mixins/styles');
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

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

  textAlign: function(textAlign) {
    this.state.textAlign = textAlign;
    this.changed();
    return this;
  },

  fontFamily: function(fontFamily) {
    this.state.fontFamily = fontFamily;
    this.changed();
    return this;
  },

  fontStyle: function(fontStyle) {
    this.state.fontStyle = fontStyle;
    this.changed();
    return this;
  },

  fontWeight: function(fontWeight) {
    this.state.fontWeight = fontWeight;
    this.changed();
    return this;
  },

  fontSize: function(fontSize) {
    this.state.fontSize = fontSize;
    this.changed();
    return this;
  },

  letterSpacing: function(letterSpacing) {
    this.state.letterSpacing = letterSpacing;
    this.changed();
    return this;
  },

  textDecoration: function(textDecoration) {
    this.state.textDecoration = textDecoration;
    this.changed();
    return this;
  },

  copy: function(parent) {
    var copy = new Text();
    copy.state.text = this.state.text;
    copy.state.textAlign = this.state.textAlign;
    copy.state.fontFamily = this.state.fontFamily;
    copy.state.fontStyle = this.state.fontStyle;
    copy.state.fontWeight = this.state.fontWeight;
    copy.state.fontSize = this.state.fontSize;
    copy.state.letterSpacing = this.state.letterSpacing;
    copy.state.textDecoration = this.state.textDecoration;
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

    // attributes that need specific handling
    if (this.state.textAlign) {
      var translate = { left: 'start', center: 'middle', right: 'end' };
      attr['text-anchor'] = translate[this.state.textAlign];
    }

    if (this.state.fontFamily)
      attr['font-family'] = Utils.s(this.state.fontFamily);
    if (this.state.textAlign)
      attr['text-align'] = Utils.s(this.state.textAlign);
    if (this.state.fontStyle)
      attr['font-style'] = Utils.s(this.state.fontStyle);
    if (this.state.fontWeight)
      attr['font-weight'] = Utils.s(this.state.fontWeight);
    if (this.state.fontSize) attr['font-size'] = Utils.s(this.state.fontSize);
    if (this.state.letterSpacing)
      attr['letter-spacing'] = Utils.s(this.state.letterSpacing);
    if (this.state.textDecoration)
      attr['text-decoration'] = Utils.s(this.state.textDecoration);

    return svg('text', attr, this.state.text);
  }
};

assign(Text.prototype, Shape, Styles, { type: 'text' });

module.exports = Text;
