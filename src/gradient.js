var Gradient = function(type) {
  this.gradientType = type || 'linear';
  this.stops = [];
};

Gradient.prototype = {

  type: "gradient",

  stop: function(col, offset) {
    this.stops.push({
      color: col,
      offset: offset
    });
  }

}

module.exports = Gradient;
