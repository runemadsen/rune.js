beforeEach(function() {
  jasmine.addMatchers({
    toBeChildOf: function() {
      return {
        compare: function(child, parent) {
          var hasChild = false;
          for (var i = 0; i < parent.children.length; i++) {
            if (parent.children[i] == child) {
              hasChild = true;
              break;
            }
          }

          var isChild = child.parent === parent;
          var pass = hasChild && isChild;
          var msg;

          if (pass) {
            msg = 'Expected to not be child of parent';
          } else {
            msg = 'Expected to be child of parent';
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    },

    // Matcher that takes two object and makes sure that all the
    // keys in subset matches the same key in full. Full may have
    // extra values.
    toBeIn: function() {
      return {
        compare: function(subset, full) {
          var noMatches = [];
          var keys = Object.keys(subset);
          for (var i = 0; i < keys.length; i++) {
            if (
              JSON.stringify(full[keys[i]]) !== JSON.stringify(subset[keys[i]])
            ) {
              noMatches.push(keys[i]);
            }
          }

          var msg;
          var pass = noMatches.length == 0;

          if (pass) {
            msg = 'Expected ' + noMatches + ' not to be in object';
          } else {
            msg = 'Expected ' + noMatches + ' to be in object';
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    }
  });
});
