var Utils = {

  random: function(a, b) {
    if(_.isUndefined(b)) {
      b = a;
      a = 0;
    }
    return a + (Math.random() * (b-a));
  },

  degrees: function(radians) {
    return radians * (180/Math.PI);
  },

  radians: function(degrees) {
    return degrees * (Math.PI/180);
  },

  addToGroup: function(child, fallback, group) {
    // if group is undefined, add to fallback
    if(_.isUndefined(group) && fallback && fallback.type == "group")
      fallback.add(child)
    // if group is specified, add to group
    else if(group && group.type == "group")
      group.add(child)
    // otherwise don't add to anything
  }

}

export default Utils;