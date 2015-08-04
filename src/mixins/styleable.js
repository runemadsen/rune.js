var Styleable = Rune.Styleable = {

  styleable: function(copy) {
    this.vars = this.vars || {};
    this.vars.fill = copy && copy.vars.fill ? copy.vars.fill.clone() : new Color().rgb(128, 128, 128);
    this.vars.stroke = copy && copy.vars.stroke ? copy.vars.stroke.clone() : new Color().rgb(0, 0, 0);
  },

  fill: function(a, b, c, d) {
    if(a === false) this.vars.fill = false;
    else            this.vars.fill = Rune.Color.inputToColor(a, b, c, d);
    return this;
  },

  stroke: function(a, b, c, d) {
    if(a === false) this.vars.stroke = false;
    else            this.vars.stroke = Rune.Color.inputToColor(a, b, c, d);
    return this;
  },

  strokeWidth:      function(val) { this.vars.strokeWidth = val; return this; },
  strokeCap:        function(val) { this.vars.strokeCap = val; return this; },
  strokeJoin:       function(val) { this.vars.strokeJoin = val; return this; },
  strokeMiterlimit: function(val) { this.vars.strokeMiterlimit = val; return this; },
  strokeDash:       function(val) { this.vars.strokeDash = val; return this; },
  strokeDashOffset: function(val) { this.vars.strokeDashOffset= val; return this; }
};