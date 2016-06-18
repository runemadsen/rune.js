var Box = {

  box: function(copy) {
    this.state = this.state || {};
    this.state.width = copy ? copy.state.width : 0;
    this.state.height = copy ? copy.state.height : 0;
  },

  width: function(width, relative) {
    this.state.width = relative ? this.state.width + width : width;
    this.changed();
    return this;
  },

  height: function(height, relative) {
    this.state.height = relative ? this.state.height + height : height;
    this.changed();
    return this;
  },

  scaleBox: function(scalar) {
    this.state.width *= scalar;
    this.state.height *= scalar;
  },

  boxAttributes: function(attr) {
    attr.width = Utils.s(this.state.width);
    attr.height = Utils.s(this.state.height);
    return attr;
  }

}

module.exports = Box;
