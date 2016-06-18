var Color = require('../color');
var Utils = require('../utils');

var Styles = {

  styles: function(copy) {

    this.state = this.state || {};
    this.state.fill = new Color(128);
    this.state.stroke = new Color(0);

    if(copy) {
      if(copy.state.fill === false)  this.state.fill = false;
      else if(copy.state.fill)       this.state.fill = copy.state.fill.copy();

      if(copy.state.stroke === false)  this.state.stroke = false;
      else if(copy.state.stroke)       this.state.stroke = copy.state.stroke.copy();

      if(copy.state.strokeWidth)       this.state.strokeWidth = copy.state.strokeWidth;
      if(copy.state.strokeCap)         this.state.strokeCap = copy.state.strokeCap;
      if(copy.state.strokeJoin)        this.state.strokeJoin = copy.state.strokeJoin;
      if(copy.state.strokeMiterlimit)  this.state.strokeMiterlimit = copy.state.strokeMiterlimit;
      if(copy.state.strokeDash)        this.state.strokeDash = copy.state.strokeDash;
      if(copy.state.strokeDashOffset)  this.state.strokeDashOffset = copy.state.strokeDashOffset;
    }
  },

  fill: function(a, b, c, d, e) {
    if(a === false) this.state.fill = false;
    else            this.state.fill = new Color(a, b, c, d, e);
    this.changed();
    return this;
  },

  stroke: function(a, b, c, d, e) {
    if(a === false) this.state.stroke = false;
    else            this.state.stroke = new Color(a, b, c, d, e);
    this.changed();
    return this;
  },

  strokeWidth: function(val) {
    this.state.strokeWidth = val;
    this.changed();
    return this;
  },

  strokeCap: function(val) {
    this.state.strokeCap = val;
    this.changed();
    return this;
  },

  strokeJoin: function(val) {
    this.state.strokeJoin = val;
    this.changed();
    return this;
  },

  strokeMiterlimit: function(val) {
    this.state.strokeMiterlimit = val;
    this.changed();
    return this;
  },

  strokeDash: function(val) {
    this.state.strokeDash = val;
    this.changed();
    return this;
  },

  strokeDashOffset: function(val) {
    this.state.strokeDashOffset= val;
    this.changed();
    return this;
  },

  scaleStyles: function(scalar) {
    if(this.state.strokeWidth) {
      this.state.strokeWidth *= scalar;
    }
    else {
      this.state.strokeWidth = scalar;
    }
  },

  stylesAttributes: function(attr) {

    if(this.state.fill === false)    attr.fill = "none";
    else if(this.state.fill) {
      attr.fill = "rgb(" + this.state.fill.values.rgb[0] + ", " + this.state.fill.values.rgb[1] + ", " + this.state.fill.values.rgb[2] + ")";
      var alpha = this.state.fill.values.alpha;
      if(alpha < 1) attr["fill-opacity"] = Utils.s(alpha);
    }

    if(this.state.stroke === false)  attr.stroke = "none";
    else if(this.state.stroke) {
      attr.stroke = "rgb(" + this.state.stroke.values.rgb[0] + ", " + this.state.stroke.values.rgb[1] + ", " + this.state.stroke.values.rgb[2] + ")";
      var alpha = this.state.stroke.values.alpha;
      if(alpha < 1) attr["stroke-opacity"] = Utils.s(alpha);
    }

    if(this.state.strokeWidth)       attr["stroke-width"] = Utils.s(this.state.strokeWidth);
    if(this.state.strokeCap)         attr["stroke-linecap"] = this.state.strokeCap;
    if(this.state.strokeJoin)        attr["stroke-linejoin"] = this.state.strokeJoin;
    if(this.state.strokeMiterlimit)  attr["stroke-miterlimit"] = Utils.s(this.state.strokeMiterlimit);
    if(this.state.strokeDash)        attr["stroke-dasharray"] = this.state.strokeDash;
    if(this.state.strokeDashOffset)  attr["stroke-dashoffset"] = Utils.s(this.state.strokeDashOffset);

    return attr;
  }

};

module.exports = Styles;
