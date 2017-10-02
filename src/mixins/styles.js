var Color = require('../color');
var Utils = require('../utils');

var map = {
  strokeWidth: 'stroke-width',
  strokeCap: 'stroke-linecap',
  strokeJoin: 'stroke-linejoin',
  strokeMiterlimit: 'stroke-miterlimit',
  strokeDash: 'stroke-dasharray',
  strokeDashOffset: 'stroke-dashoffset'
};
var keys = Object.keys(map);

var Styles = {
  styles: function(copy) {
    this.state = this.state || {};
    this.state.fill = new Color(128);
    this.state.stroke = new Color(0);

    if (copy) {
      if (copy.state.fill === false || copy.state.fill === 'none') {
        this.state.fill = copy.state.fill;
      } else if (copy.state.fill) {
        this.state.fill = copy.state.fill.copy();
      }

      if (copy.state.stroke === false || copy.state.stroke === 'none') {
        this.state.stroke = false;
      } else if (copy.state.stroke) {
        this.state.stroke = copy.state.stroke.copy();
      }

      // Copy basic attributes
      for (var i = 0; i < keys.length; i++) {
        if (copy.state[keys[i]]) {
          this.state[keys[i]] = copy.state[keys[i]];
        }
      }
    }
  },

  fill: function(a, b, c, d, e) {
    if (a === false || a === 'none') this.state.fill = a;
    else this.state.fill = new Color(a, b, c, d, e);
    this.changed();
    return this;
  },

  stroke: function(a, b, c, d, e) {
    if (a === false || a === 'none') this.state.stroke = a;
    else this.state.stroke = new Color(a, b, c, d, e);
    this.changed();
    return this;
  },

  scaleStyles: function(scalar) {
    if (this.state.strokeWidth) {
      this.state.strokeWidth *= scalar;
    } else {
      this.state.strokeWidth = scalar;
    }
  },

  stylesAttributes: function(attr) {
    if (this.state.fill) {
      if (this.state.fill === 'none') {
        attr.fill = 'none';
      } else {
        attr.fill =
          'rgb(' +
          this.state.fill.values.rgb[0] +
          ', ' +
          this.state.fill.values.rgb[1] +
          ', ' +
          this.state.fill.values.rgb[2] +
          ')';
        var alpha = this.state.fill.values.alpha;
        if (alpha < 1) attr['fill-opacity'] = Utils.s(alpha);
      }
    }

    if (this.state.stroke) {
      if (this.state.stroke === 'none') {
        attr.stroke = 'none';
      } else {
        attr.stroke =
          'rgb(' +
          this.state.stroke.values.rgb[0] +
          ', ' +
          this.state.stroke.values.rgb[1] +
          ', ' +
          this.state.stroke.values.rgb[2] +
          ')';
        var alpha = this.state.stroke.values.alpha;
        if (alpha < 1) attr['stroke-opacity'] = Utils.s(alpha);
      }
    }

    for (var i = 0; i < keys.length; i++) {
      if (this.state[keys[i]]) {
        attr[map[keys[i]]] = Utils.s(this.state[keys[i]]);
      }
    }

    return attr;
  }
};

// Generate setters
for (var i = 0; i < keys.length; i++) {
  Styles[keys[i]] = Utils.getSetter(keys[i]);
}

module.exports = Styles;
