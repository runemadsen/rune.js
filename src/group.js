(function(Rune) {

  // Constructor
  // --------------------------------------------------

  var Group = Rune.Group = function(x, y) {

    this.children = [];

    if(x > 0) this.x = x;
    if(y > 0) this.y = y;
  };

  // Group functions
  // --------------------------------------------------

  _.extend(Group.prototype, Rune.Mixins.Moveable, {

    type: "group",

    add: function(child) {
      this.children.push(child);
    }

  });

})(Rune);