var Vector = require('../vector');

var Moveable = {

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
    this.vars.rotation = deg;
    if(x || y) {
      this.vars.rotationX = x || 0;
      this.vars.rotationY = y || 0;
    }
    if(relative) {
      this.vars.rotationX += this.vars.x;
      this.vars.rotationY += this.vars.y;
    }
    return this;
  },

  addParent: function(group) {
    group.add(this);
    return this;
  },

  removeParent: function() {
    if(this.parent) this.parent.remove(this);
    return this;
  },

  stagepos: function() {
    var vec = new Vector(this.vars.x, this.vars.y);
    if(this.parent) {
      vec = vec.add(this.parent.stagepos());
    }
    return vec;
  },

  // Render
  // ---------------------------------------------------

  moveableAttributes: function(attr) {

    var strings = [];

    if(this.vars.rotation) {
      var rot = "rotate(" + this.vars.rotation;
      if(this.vars.rotationX || this.vars.rotationY)
        rot += " " + this.vars.rotationX + " " + this.vars.rotationY;
      strings.push(rot + ")");
    }

    if((this.type == "group" || this.type == "path" || this.type == "polygon" || this.type == "grid" || this.type == "triangle") && (this.vars.x || this.vars.y)) {
      strings.push("translate(" + this.vars.x + " " + this.vars.y + ")");
    }

    if(strings.length > 0)
      attr.transform = strings.join(" ").trim();

    return attr;
  }

};

module.exports = Moveable;
