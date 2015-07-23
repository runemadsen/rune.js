(function(Rune) {

  // Constructor
  // --------------------------------------------------

  var Group = Rune.Group = function() {
    this.children = [];
  };

  // Group functions
  // --------------------------------------------------

  _.extend(Group.prototype, {

    type: "group",

    add: function(child) {
      this.children.push(child);
    }

  });

})(Rune);