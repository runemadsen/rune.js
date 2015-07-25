var Moveable = Rune.Moveable = {

  moveable: function(copy) {
    this.vars = this.vars || {};
    this.vars.x = copy ? copy.vars.x : 0;
    this.vars.y = copy ? copy.vars.y : 0;
    this.vars.rotation = copy ? copy.vars.rotation : 0;
  },

  move: function(x, y, relative) {
    this.vars.x = relative ? this.vars.x + x : x;
    this.vars.y = relative ? this.vars.y + y : y;
    return this;
  },

  rotate: function(deg, relative) {
    this.vars.rotation = relative ? this.vars.rotation + deg : deg;
    return this;
  }

};