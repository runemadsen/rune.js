var Gradient = function(type) {
  this.gradientType = type || 'linear';
  this.gradientOrientation = [0, 0, 0, 1];
  this.stops = [];
};

Gradient.prototype = {

  type: "gradient",

  stop: function(col, offset) {
    this.stops.push({
      color: col,
      offset: offset
    });
  },

  orientation: function(x1, y1, x2, y2) {
    this.gradientOrientation = [x1, y1, x2, y2];
  }

}

module.exports = Gradient;
