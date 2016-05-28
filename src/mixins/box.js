var Box = {

  box: function(copy) {
    this.vars = this.vars || {};
    this.vars.width = copy ? copy.vars.width : 0;
    this.vars.height = copy ? copy.vars.height : 0;
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
