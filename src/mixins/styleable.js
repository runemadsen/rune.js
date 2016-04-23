var Color = require('../color');

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
    return this;
  },

  stroke: function(a, b, c, d, e) {
    if(a === false) this.vars.stroke = false;
    else            this.vars.stroke = new Color(a, b, c, d, e);
    return this;
  },

  strokeWidth:      function(val) { this.vars.strokeWidth = val; return this; },
  strokeCap:        function(val) { this.vars.strokeCap = val; return this; },
  strokeJoin:       function(val) { this.vars.strokeJoin = val; return this; },
  strokeMiterlimit: function(val) { this.vars.strokeMiterlimit = val; return this; },
  strokeDash:       function(val) { this.vars.strokeDash = val; return this; },
  strokeDashOffset: function(val) { this.vars.strokeDashOffset= val; return this; },

  scaleStyleable: function(scalar) {
    if(this.vars.strokeWidth) {
      this.vars.strokeWidth *= scalar;
    }
    else {
      this.vars.strokeWidth = scalar;
    }
  }
};

module.exports = Styleable;
