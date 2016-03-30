var Utils = {

  random: function(a, b) {
    if(typeof b === 'undefined') {
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

  groupLogic: function(child, fallback, group) {

    if(group && group.type == "group") {
      group.add(child)
    }

    else if(group !== false && fallback && fallback.type == "group") {
      fallback.add(child)
    }
  },

  copyMixinVars: function(a, b) {
    if(a.moveable && b.moveable)    b.moveable(a);
    if(a.sizeable && b.sizeable)    b.sizeable(a);
    if(a.styleable && b.styleable)  b.styleable(a);
  },

  round: function(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }

};

export default Utils;
