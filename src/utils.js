var Utils = {
  isBrowser: function() {
    return typeof window !== 'undefined';
  },

  // function to turn any non-string into a string. We need
  // this when running server-side node.
  s: function(val) {
    if (typeof val !== 'string' && typeof val.toString !== 'undefined')
      return val.toString();
    return val;
  },

  random: function(a, b) {
    if (typeof b === 'undefined') {
      b = a;
      a = 0;
    }
    return a + Math.random() * (b - a);
  },

  degrees: function(radians) {
    return radians * (180 / Math.PI);
  },

  radians: function(degrees) {
    return degrees * (Math.PI / 180);
  },

  groupLogic: function(child, fallback, group) {
    if (group && group.type == 'group') {
      group.add(child);
    } else if (group !== false && fallback && fallback.type == 'group') {
      fallback.add(child);
    }
  },

  copyMixinVars: function(a, b) {
    if (a.shape && b.shape) b.shape(a);
    if (a.box && b.box) b.box(a);
    if (a.styles && b.styles) b.styles(a);
  },

  // A function that returns a simple setter on an object.
  // Used to generate lots of setters based on a hashmap
  getSetter: function(func) {
    return function(val) {
      this.state[func] = val;
      this.changed();
      return this;
    };
  },

  round: function(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  },

  map: function(n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  },

  flatten: function(arr) {
    return arr.reduce(function(flat, toFlatten) {
      return flat.concat(
        Array.isArray(toFlatten) ? Utils.flatten(toFlatten) : toFlatten
      );
    }, []);
  }
};

module.exports = Utils;
