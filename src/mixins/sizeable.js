var Sizeable = {

  sizeable: function(copy) {
    this.vars = this.vars || {};
    this.vars.width = copy ? copy.vars.width : 0;
    this.vars.height = copy ? copy.vars.height : 0;
  },

  scaleSizeable: function(scalar) {
    this.vars.width *= scalar;
    this.vars.height *= scalar;
  }

}

module.exports = Sizeable;
