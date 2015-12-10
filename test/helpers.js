function drawShared(shape) {
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

function expectShared(el) {
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

function newMixin() {
  var Mixed = function() {};
  _.each(arguments, function(mixin) {
    _.extend(Mixed.prototype, mixin);
  });
  return new Mixed();
}

// Returns an object with variables that comes from
// all the mixins that the shape extends.
function getMixinVars(shape) {

  var keys = [];
  if(shape.moveable) {
    keys = keys.concat(_.keys(getMoveableVars()))
  }
  if(shape.sizeable) {
    keys = keys.concat(_.keys(getSizeableVars()))
  }
  if(shape.styleable) {
    keys = keys.concat(_.keys(getStyleableVars()))
  }

  var vars = {};
  _.each(keys, function(key) {
    vars[key] = shape.vars[key];
  });
  return vars;
}

// Sets variables in object that comes from
// all the mixins that the shape extends.
function setMixinVars(shape) {
  if(shape.moveable) {
    setMoveableVars(shape)
  }
  if(shape.sizeable) {
    setSizeableVars(shape)
  }
  if(shape.styleable) {
    setStyleableVars(shape)
  }
}

// Mixin getters
// -------------------------------------------

function getMoveableVars(opts) {
  return _.defaults(opts || {}, {
    x:10,
    y:15,
    rotation: 45,
    rotationX: 100,
    rotationY: 105
  });
}

function getSizeableVars(opts) {
  return _.defaults(opts || {}, {
    width:300,
    height:305
  });
}

function getStyleableVars(opts) {
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

function setMoveableVars(shape, opts) {
  var vars = getMoveableVars(opts)
  _.extend(shape.vars, vars);
}

function setSizeableVars(shape, opts) {
  var vars = getSizeableVars(opts)
  _.extend(shape.vars, vars);
}

function setStyleableVars(shape, opts) {
  var vars = getStyleableVars(opts)
  _.extend(shape.vars, vars);
}

function setAllAnchors(path) {
  path.lineTo(104, 105)
    .moveTo(106, 107)
    .curveTo(108, 109, 110, 111, 112, 113)
    .curveTo(114, 115, 116, 117)
    .closePath();
}
