(function(Rune) {

  // Constructor
  // --------------------------------------------------

  var Group = Rune.Group = function(x, y) {

    this.moveable();
    this.children = [];

    if(x > 0) this.vars.x = x;
    if(y > 0) this.vars.y = y;
  };

  // Group functions
  // --------------------------------------------------

  _.extend(Group.prototype, Rune.Moveable, {

    type: "group",

    add: function(child) {
      if(child.parent) child.parent.remove(child);
      this.children.push(child);
      child.parent = this;
    },

    remove: function(child) {
      this.children = _.without(this.children, child);
      child.parent = false;
    }

  });

})(Rune);