global.drawShared = function(shape) {
  shape
    .rotate(45, 100, 105)
    .fill(255, 0, 0, 0.5)
    .stroke(0, 255, 0, 0.6)
    .strokeWidth(5)
    .strokeCap('round')
    .strokeJoin('miter')
    .strokeMiterlimit(7)
    .strokeDash("3,4,5")
    .strokeDashOffset(10);
}

global.expectCopy = function(s) {

  // should copy shape
  setMixinVars(s);
  var copy = s.copy();
  expect(copy).not.toBe(s);
  expect(copy).toEqual(s);

  var g = new Rune.Group();
  g.add(s);

  // should not add to parent
  expect(g.children.length).toEqual(1);
  s.copy(false);
  expect(g.children.length).toEqual(1);

  // should add to parent
  s.copy();
  expect(g.children.length).toEqual(2);
}

global.expectShared = function(el) {
  expect(el).toHaveRotation(45, 100, 105);
  expect(el).toHaveAttr("fill", "rgb(255, 0, 0)");
  expect(el).toHaveAttr("fill-opacity", "0.5")
  expect(el).toHaveAttr("stroke", "rgb(0, 255, 0)");
  expect(el).toHaveAttr("stroke-opacity", "0.6")
  expect(el).toHaveAttr("stroke-width", "5");
  expect(el).toHaveAttr("stroke-linecap", "round");
  expect(el).toHaveAttr("stroke-linejoin", "miter");
  expect(el).toHaveAttr("stroke-miterlimit", "7");
  expect(el).toHaveAttr("stroke-dasharray", "3,4,5");
  expect(el).toHaveAttr("stroke-dashoffset", "10");
}

global.newMixin = function() {
  var Mixed = function() {};
  _.each(arguments, function(mixin) {
    _.extend(Mixed.prototype, mixin);
  });
  return new Mixed();
}

// Returns an object with variables that comes from
// all the mixins that the shape extends.
global.getMixinVars = function(shape) {

  var keys = [];
  if(shape.shape) {
    keys = keys.concat(_.keys(getShapeVars()))
  }
  if(shape.box) {
    keys = keys.concat(_.keys(getBoxVars()))
  }
  if(shape.styles) {
    keys = keys.concat(_.keys(getStylesVars()))
  }

  var state = {};
  _.each(keys, function(key) {
    state[key] = shape.state[key];
  });
  return state;
}

// Sets variables in object that comes from
// all the mixins that the shape extends.
global.setMixinVars = function(shape) {
  if(shape.shape) {
    setShapeVars(shape)
  }
  if(shape.box) {
    setBoxVars(shape)
  }
  if(shape.styles) {
    setStylesVars(shape)
  }
}

// Mixin getters
// -------------------------------------------

global.getShapeVars = function(opts) {
  return _.defaults(opts || {}, {
    x:10,
    y:15,
    rotation: 45,
    rotationX: 100,
    rotationY: 105
  });
}

global.getBoxVars = function(opts) {
  return _.defaults(opts || {}, {
    width:300,
    height:305
  });
}

global.getStylesVars = function(opts) {
  return _.defaults(opts || {}, {
    fill: new Rune.Color(255, 0, 0),
    stroke: new Rune.Color(0, 255, 0),
    strokeWidth: 2,
    strokeCap: "square",
    strokeJoin: "bevel",
    strokeMiterlimit: 2,
    strokeDash: "0,1",
    strokeDashOffset: 4
  });
}

// Mixin setters
// -------------------------------------------

global.setShapeVars = function(shape, opts) {
  var state = getShapeVars(opts)
  _.extend(shape.state, state);
}

global.setBoxVars = function(shape, opts) {
  var state = getBoxVars(opts)
  _.extend(shape.state, state);
}

global.setStylesVars = function(shape, opts) {
  var state = getStylesVars(opts)
  _.extend(shape.state, state);
}

global.setAllAnchors = function(path) {
  path.lineTo(104, 105)
    .moveTo(106, 107)
    .curveTo(108, 109, 110, 111, 112, 113)
    .curveTo(114, 115, 116, 117)
    .closePath();
}
