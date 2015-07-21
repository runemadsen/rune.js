(function() {

  // Constructor
  // --------------------------------------------------

  var Group = Rune.Group = function() {
    this.children = [];
  };

  // Group functions
  // --------------------------------------------------

  _.extend(Group.prototype, {

    add: function(child) {
      this.children.push(child);
    }

  });

})();