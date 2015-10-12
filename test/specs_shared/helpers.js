import _ from "underscore"

var Helpers = {

  newMixin: function() {
    var Mixed = function() {};
    _.each(arguments, function(mixin) {
      _.extend(Mixed.prototype, mixin);
    });
    return new Mixed();
  },

  // Mixin general
  // -------------------------------------------

  // Returns an object with variables that comes from
  // all the mixins that the shape extends.
  getMixinVars: function(shape) {

    var keys = [];
    if(shape.moveable) {
      keys = keys.concat(_.keys(Helpers.getMoveableVars()))
    }
    if(shape.sizeable) {
      keys = keys.concat(_.keys(Helpers.getSizeableVars()))
    }
    if(shape.styleable) {
      keys = keys.concat(_.keys(Helpers.getStyleableVars()))
    }

    var vars = {};
    _.each(keys, function(key) {
      vars[key] = shape.vars[key];
    });
    return vars;
  },

  // Sets variables in object that comes from
  // all the mixins that the shape extends.
  setMixinVars: function(shape) {
    if(shape.moveable) {
      Helpers.setMoveableVars(shape)
    }
    if(shape.sizeable) {
      Helpers.setSizeableVars(shape)
    }
    if(shape.styleable) {
      Helpers.setStyleableVars(shape)
    }
  },

  // Mixin getters
  // -------------------------------------------

  getMoveableVars: function(opts) {
    return _.defaults(opts || {}, {
      x:10,
      y:15,
      rotation: 45,
      rotationX: 100,
      rotationY: 105
    });
  },

  getSizeableVars: function(opts) {
    return _.defaults(opts || {}, {
      width:300,
      height:305
    });
  },

  getStyleableVars: function(opts) {
    return _.defaults(opts || {}, {
      fill: new Rune.Color(255, 0, 0),
      stroke: new Rune.Color(0, 255, 0)
    });
  },

  // Mixin setters
  // -------------------------------------------

  setMoveableVars: function(shape, opts) {
    var vars = Helpers.getMoveableVars(opts)
    _.extend(shape.vars, vars);
  },

  setSizeableVars: function(shape, opts) {
    var vars = Helpers.getSizeableVars(opts)
    _.extend(shape.vars, vars);
  },

  setStyleableVars: function(shape, opts) {
    var vars = Helpers.getStyleableVars(opts)
    _.extend(shape.vars, vars);
  },

  setAllAnchors: function(path) {
    path.lineTo(104, 105)
      .moveTo(106, 107)
      .curveTo(108, 109, 110, 111, 112, 113)
      .curveTo(114, 115, 116, 117)
      .closePath();
  }
};

export default Helpers