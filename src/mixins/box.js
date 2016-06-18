var Box = {

  box: function(copy) {
    this.vars = this.vars || {};
    this.vars.width = copy ? copy.vars.width : 0;
    this.vars.height = copy ? copy.vars.height : 0;
  },

  width: function(width, relative) {
    this.vars.width = relative ? this.vars.width + width : width;
    this.changed();
    return this;
  },

  height: function(height, relative) {
    this.vars.height = relative ? this.vars.height + height : height;
    this.changed();
    return this;
  },

  scaleBox: function(scalar) {
    this.vars.width *= scalar;
    this.vars.height *= scalar;
  },

  boxAttributes: function(attr) {
    attr.width = Utils.s(this.vars.width);
    attr.height = Utils.s(this.vars.height);
    return attr;
  }

}

module.exports = Box;
