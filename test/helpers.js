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
};

global.newMixin = function(...args) {
  var Mixed = function() {};
  args.forEach(function(mixin) {
    Object.assign(Mixed.prototype, mixin);
  });
  return new Mixed();
};

// Returns an object with variables that comes from
// all the mixins that the shape extends.
global.getMixinVars = function(shape) {
  var keys = [];
  if (shape.shape) {
    keys = keys.concat(Object.keys(getShapeVars()));
  }
  if (shape.box) {
    keys = keys.concat(Object.keys(getBoxVars()));
  }
  if (shape.styles) {
    keys = keys.concat(Object.keys(getStylesVars()));
  }

  var state = {};
  keys.forEach(function(key) {
    state[key] = shape.state[key];
  });
  return state;
};

// Sets variables in object that comes from
// all the mixins that the shape extends.
global.setMixinVars = function(shape) {
  if (shape.shape) {
    setShapeVars(shape);
  }
  if (shape.box) {
    setBoxVars(shape);
  }
  if (shape.styles) {
    setStylesVars(shape);
  }
};

// Mixin getters
// -------------------------------------------

global.getShapeVars = function(opts) {
  return Object.assign(
    {
      x: 10,
      y: 15,
      rotation: 45,
      rotationX: 100,
      rotationY: 105
    },
    opts
  );
};

global.getBoxVars = function(opts) {
  return Object.assign(
    {
      width: 300,
      height: 305
    },
    opts
  );
};

global.getStylesVars = function(opts) {
  return Object.assign(
    {
      fill: new Rune.Color(255, 0, 0),
      stroke: new Rune.Color(0, 255, 0),
      strokeWidth: 2,
      strokeCap: 'square',
      strokeJoin: 'bevel',
      strokeMiterlimit: 2,
      strokeDash: '0,1',
      strokeDashOffset: 4
    },
    opts
  );
};

// Mixin setters
// -------------------------------------------

global.setShapeVars = function(shape, opts) {
  var state = getShapeVars(opts);
  Object.assign(shape.state, state);
};

global.setBoxVars = function(shape, opts) {
  var state = getBoxVars(opts);
  Object.assign(shape.state, state);
};

global.setStylesVars = function(shape, opts) {
  var state = getStylesVars(opts);
  Object.assign(shape.state, state);
};

global.setAllAnchors = function(path) {
  path
    .lineTo(104, 105)
    .moveTo(106, 107)
    .curveTo(108, 109, 110, 111, 112, 113)
    .curveTo(114, 115, 116, 117)
    .closePath();
};
