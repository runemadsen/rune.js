var Color = require('../color');
var Utils = require('../utils');

var Styleable = {

  styleable: function(copy) {

    this.vars = this.vars || {};
    this.vars.fill = new Color(128);
    this.vars.stroke = new Color(0);

    if(copy) {
      if(copy.vars.fill === false)  this.vars.fill = false;
      else if(copy.vars.fill)       this.vars.fill = copy.vars.fill.copy();

      if(copy.vars.stroke === false)  this.vars.stroke = false;
      else if(copy.vars.stroke)       this.vars.stroke = copy.vars.stroke.copy();

      if(copy.vars.strokeWidth)       this.vars.strokeWidth = copy.vars.strokeWidth;
      if(copy.vars.strokeCap)         this.vars.strokeCap = copy.vars.strokeCap;
      if(copy.vars.strokeJoin)        this.vars.strokeJoin = copy.vars.strokeJoin;
      if(copy.vars.strokeMiterlimit)  this.vars.strokeMiterlimit = copy.vars.strokeMiterlimit;
      if(copy.vars.strokeDash)        this.vars.strokeDash = copy.vars.strokeDash;
      if(copy.vars.strokeDashOffset)  this.vars.strokeDashOffset = copy.vars.strokeDashOffset;
    }
  },

  fill: function(a, b, c, d, e) {
    if(a === false) this.vars.fill = false;
    else            this.vars.fill = new Color(a, b, c, d, e);
    this.changed();
    return this;
  },

  stroke: function(a, b, c, d, e) {
    if(a === false) this.vars.stroke = false;
    else            this.vars.stroke = new Color(a, b, c, d, e);
    this.changed();
    return this;
  },

  strokeWidth: function(val) {
    this.vars.strokeWidth = val;
    this.changed();
    return this;
  },

  strokeCap: function(val) {
    this.vars.strokeCap = val;
    this.changed();
    return this;
  },

  strokeJoin: function(val) {
    this.vars.strokeJoin = val;
    this.changed();
    return this;
  },

  strokeMiterlimit: function(val) {
    this.vars.strokeMiterlimit = val;
    this.changed();
    return this;
  },

  strokeDash: function(val) {
    this.vars.strokeDash = val;
    this.changed();
    return this;
  },

  strokeDashOffset: function(val) {
    this.vars.strokeDashOffset= val;
    this.changed();
    return this;
  },

  scaleStyleable: function(scalar) {
    if(this.vars.strokeWidth) {
      this.vars.strokeWidth *= scalar;
    }
    else {
      this.vars.strokeWidth = scalar;
    }
  },

  styleableAttributes: function(attr) {

    if(this.vars.fill === false)    attr.fill = "none";
    else if(this.vars.fill) {
      attr.fill = "rgb(" + this.vars.fill.values.rgb[0] + ", " + this.vars.fill.values.rgb[1] + ", " + this.vars.fill.values.rgb[2] + ")";
      var alpha = this.vars.fill.values.alpha;
      if(alpha < 1) attr["fill-opacity"] = Utils.s(alpha);
    }

    if(this.vars.stroke === false)  attr.stroke = "none";
    else if(this.vars.stroke) {
      attr.stroke = "rgb(" + this.vars.stroke.values.rgb[0] + ", " + this.vars.stroke.values.rgb[1] + ", " + this.vars.stroke.values.rgb[2] + ")";
      var alpha = this.vars.stroke.values.alpha;
      if(alpha < 1) attr["stroke-opacity"] = Utils.s(alpha);
    }

    if(this.vars.strokeWidth)       attr["stroke-width"] = Utils.s(this.vars.strokeWidth);
    if(this.vars.strokeCap)         attr["stroke-linecap"] = this.vars.strokeCap;
    if(this.vars.strokeJoin)        attr["stroke-linejoin"] = this.vars.strokeJoin;
    if(this.vars.strokeMiterlimit)  attr["stroke-miterlimit"] = Utils.s(this.vars.strokeMiterlimit);
    if(this.vars.strokeDash)        attr["stroke-dasharray"] = this.vars.strokeDash;
    if(this.vars.strokeDashOffset)  attr["stroke-dashoffset"] = Utils.s(this.vars.strokeDashOffset);

    return attr;
  }

};

module.exports = Styleable;
