import Vector from "./vector";

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

  groupLogicFromArguments: function(child, fallback, argsObject) {
    var group = argsObject.length > 0 ? argsObject[argsObject.length - 1] : null;
    this.groupLogic(child, fallback, group);
  },

  copyMixinVars: function(a, b) {
    if(a.moveable && b.moveable)    b.moveable(a);
    if(a.sizeable && b.sizeable)    b.sizeable(a);
    if(a.styleable && b.styleable)  b.styleable(a);
  },

  round: function(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  },

  argumentsToArray: function(argObject) {
    return Array.prototype.slice.call(argObject);
  },

  invokeConstructor: function(constructor, argsObject) {
    var argArray = this.argumentsToArray(argsObject);
    var args = [null].concat(argArray);
    var factoryFunction = constructor.bind.apply(constructor, args);
    return new factoryFunction();
  },

  expandVectorArguments: function(argObject) {
    var args = this.argumentsToArray(argObject);
    for (var i = 0; i < args.length; i++) {
      if (args[i] instanceof Vector) {
        var vec = args[i];
        args.splice(i, 1);
        args.splice(i, 0, vec.y);
        args.splice(i, 0, vec.x);
      }
    }
    return args;
  }
};

export default Utils;
