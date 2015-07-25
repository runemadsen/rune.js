var Moveable = Rune.Moveable = {

  moveable: function(copy) {
    this.vars = this.vars || {};
    this.vars.x = copy ? copy.vars.x : 0;
    this.vars.y = copy ? copy.vars.y : 0;
    this.vars.rotation = copy ? copy.vars.rotation : 0;
    this.vars.rotationX = copy ? copy.vars.rotationX : 0;
    this.vars.rotationY = copy ? copy.vars.rotationY : 0;
  },

  move: function(x, y, relative) {
    this.vars.x = relative ? this.vars.x + x : x;
    this.vars.y = relative ? this.vars.y + y : y;
    return this;
  },

  rotate: function(deg, x, y, relative) {
    if(relative) {
      this.vars.rotation += deg;
      this.vars.rotationX += x;
      this.vars.rotationY += y;
    } else {
      this.vars.rotation = deg;
      this.vars.rotationX = x;
      this.vars.rotationY = y;
    }
    return this;
  }

};