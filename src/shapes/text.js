var assign = require("lodash/object/assign");
var Moveable = require("../mixins/moveable");
var Styleable = require("../mixins/styleable");
var VectorsAcceptable = require("../mixins/vectors_acceptable");
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Text = function(text, x, y) {
  this.moveable();
  this.styleable();
  this.vectorsAcceptable(arguments);
}

Text.prototype = {

  init: function(text, x, y) {
    this.vars.text = text;
    this.vars.x = x;
    this.vars.y = y;
    this.vars.fontSize = 16;
  },

  toPolygon: function() {
    throw new Error("You need the Rune.Font plugin to convert text to polygon");
  },

  textAlign: function(textAlign) { this.vars.textAlign = textAlign; return this; },
  fontFamily: function(fontFamily) { this.vars.fontFamily = fontFamily; return this; },
  fontStyle: function(fontStyle) { this.vars.fontStyle = fontStyle; return this; },
  fontWeight: function(fontWeight) { this.vars.fontWeight = fontWeight; return this; },
  fontSize: function(fontSize) { this.vars.fontSize = fontSize; return this; },
  letterSpacing: function(letterSpacing) { this.vars.letterSpacing = letterSpacing; return this; },
  textDecoration: function(textDecoration) { this.vars.textDecoration = textDecoration; return this; },

  copy: function(parent) {
    var copy = new Text();
    copy.vars.text = this.vars.text;
    copy.vars.textAlign = this.vars.textAlign;
    copy.vars.fontFamily = this.vars.fontFamily;
    copy.vars.fontStyle = this.vars.fontStyle;
    copy.vars.fontWeight = this.vars.fontWeight;
    copy.vars.fontSize = this.vars.fontSize;
    copy.vars.letterSpacing = this.vars.letterSpacing;
    copy.vars.textDecoration = this.vars.textDecoration;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  scale: function(scalar) {
    this.scaleStyleable(scalar);
    this.vars.fontSize *= scalar;
    return this;
  },

  render: function(opts) {
    var attr = {
      x: Utils.s(this.vars.x),
      y: Utils.s(this.vars.y),
    }
    this.moveableAttributes(attr);
    this.styleableAttributes(attr);

    // attributes that need specific handling
    if(this.vars.textAlign) {
      var translate = { "left":"start", "center":"middle", "right":"end" };
      attr["text-anchor"] = translate[this.vars.textAlign];
    }

    this.optionalAttributes(attr, {
      "fontFamily" : "font-family",
      "textAlign" : "text-align",
      "fontStyle" : "font-style",
      "fontWeight" : "font-weight",
      "fontSize" : "font-size",
      "letterSpacing" : "letter-spacing",
      "textDecoration" : "text-decoration"
    });

    if(this.vars.textAlign) {
      var translate = { "left":"start", "center":"middle", "right":"end" };
      attr["text-anchor"] = translate[this.vars.textAlign];
    }

    return svg('text', attr, this.vars.text);
  }

}

assign(Text.prototype, Moveable, Styleable, VectorsAcceptable, { type: "text" });

module.exports = Text;
