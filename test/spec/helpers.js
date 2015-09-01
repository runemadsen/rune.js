import _ from "underscore"

var Helpers = {

  newMixin: function() {
    var Mixed = function() {};
    _.each(arguments, function(mixin) {
      _.extend(Mixed.prototype, mixin);
    });
    return new Mixed();
  },

  // In order to not constantly keep track of what mixins each
  // object has, we can call this helper that automatically
  // checks what mixins the shape has, and sets some default
  // values for each mixin property.
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

  setMoveableVars: function(shape, opts) {
    opts = opts || {};
    shape.vars.x = opts.x || 10;
    shape.vars.y = opts.y || 15;
    shape.vars.rotation = opts.rotation || 45;
    shape.vars.rotationX = opts.rotationX || 100;
    shape.vars.rotationY = opts.rotationY || 105;
  },

  setSizeableVars: function(shape) {
    shape.vars.width = 300;
    shape.vars.height = 305;
  },

  setStyleableVars: function(shape) {
    shape.vars.fill = new Rune.Color(255, 0, 0);
    shape.vars.stroke = new Rune.Color(0, 255, 0);
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