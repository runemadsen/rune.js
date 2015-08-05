var Styleable = Rune.Styleable = {

  styleable: function(copy) {

    this.vars = this.vars || {};
    this.vars.fill = new Rune.Color(128);
    this.vars.stroke = new Rune.Color(0);

    if(copy) {
      if(copy.vars.fill === false)  this.vars.fill = false;
      else if(copy.vars.fill)       this.vars.fill = copy.vars.fill.copy();

      if(copy.vars.stroke === false)  this.vars.stroke = false;
      else if(copy.vars.stroke)       this.vars.stroke = copy.vars.stroke.copy();
    }
  },

  fill: function(a, b, c, d, e) {
    if(a === false) this.vars.fill = false;
    else            this.vars.fill = new Rune.Color(a, b, c, d, e);
    return this;
  },

  stroke: function(a, b, c, d, e) {
    if(a === false) this.vars.stroke = false;
    else            this.vars.stroke = new Rune.Color(a, b, c, d, e);
    return this;
  },

  strokeWidth:      function(val) { this.vars.strokeWidth = val; return this; },
  strokeCap:        function(val) { this.vars.strokeCap = val; return this; },
  strokeJoin:       function(val) { this.vars.strokeJoin = val; return this; },
  strokeMiterlimit: function(val) { this.vars.strokeMiterlimit = val; return this; },
  strokeDash:       function(val) { this.vars.strokeDash = val; return this; },
  strokeDashOffset: function(val) { this.vars.strokeDashOffset= val; return this; }
};