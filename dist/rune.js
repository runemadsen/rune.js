var Rune =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 29);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArray = __webpack_require__(9);

var h = __webpack_require__(19);


var SVGAttributeNamespace = __webpack_require__(42);
var attributeHook = __webpack_require__(43);

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

module.exports = svg;

function svg(tagName, properties, children) {
    if (!children && isChildren(properties)) {
        children = properties;
        properties = {};
    }

    properties = properties || {};

    // set namespace for svg
    properties.namespace = SVG_NAMESPACE;

    var attributes = properties.attributes || (properties.attributes = {});

    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }

        var namespace = SVGAttributeNamespace(key);

        if (namespace === undefined) { // not a svg attribute
            continue;
        }

        var value = properties[key];

        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        ) {
            continue;
        }

        if (namespace !== null) { // namespaced attribute
            properties[key] = attributeHook(namespace, value);
            continue;
        }

        attributes[key] = value
        properties[key] = undefined
    }

    return h(tagName, properties, children);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var Vector = __webpack_require__(5);
var Utils = __webpack_require__(0);
var svg = __webpack_require__(1);

var Shape = {
  changed: function() {
    if (this.parent && !this.parentNotified) {
      // let the parent know that this child changed
      this.parent.changedChildren.push(this.childId);
      // let's not do it again
      this.parentNotified = true;
      // let the parent do this for its parent
      this.parent.changed();
    }
  },

  shape: function(copy) {
    this.state = this.state || {};
    this.state.x = copy ? copy.state.x : 0;
    this.state.y = copy ? copy.state.y : 0;
    this.state.rotation = copy ? copy.state.rotation : 0;
    this.state.rotationX = copy ? copy.state.rotationX : 0;
    this.state.rotationY = copy ? copy.state.rotationY : 0;
  },

  move: function(x, y, relative) {
    this.state.x = relative ? this.state.x + x : x;
    this.state.y = relative ? this.state.y + y : y;
    this.changed();
    return this;
  },

  rotate: function(deg, x, y, relative) {
    this.state.rotation = deg;
    if (x || y) {
      this.state.rotationX = x || 0;
      this.state.rotationY = y || 0;
    }
    if (relative) {
      this.state.rotationX += this.state.x;
      this.state.rotationY += this.state.y;
    }
    this.changed();
    return this;
  },

  addTo: function(group) {
    group.add(this);
    return this;
  },

  removeParent: function() {
    if (this.parent) this.parent.remove(this);
    return this;
  },

  stagepos: function() {
    var vec = new Vector(this.state.x, this.state.y);
    if (this.parent) {
      vec = vec.add(this.parent.stagepos());
    }
    return vec;
  },

  // Render
  // ---------------------------------------------------

  shapeAttributes: function(attr) {
    var strings = [];

    if (this.state.rotation) {
      var rot = 'rotate(' + this.state.rotation;
      if (this.state.rotationX || this.state.rotationY)
        rot += ' ' + this.state.rotationX + ' ' + this.state.rotationY;
      strings.push(rot + ')');
    }

    if (
      (this.type == 'group' ||
        this.type == 'path' ||
        this.type == 'polygon' ||
        this.type == 'grid' ||
        this.type == 'triangle') &&
      (this.state.x || this.state.y)
    ) {
      strings.push('translate(' + this.state.x + ' ' + this.state.y + ')');
    }

    if (strings.length > 0) attr.transform = strings.join(' ').trim();

    return attr;
  },

  // Render Debug
  // ---------------------------------------------------

  debugCircle: function(x, y) {
    return svg('circle', {
      cx: Utils.s(x),
      cy: Utils.s(y),
      r: Utils.s(4),
      fill: 'rgb(212, 18, 229)'
    });
  },

  debugRect: function(x, y, width, height) {
    return svg('rect', {
      x: Utils.s(x),
      y: Utils.s(y),
      width: Utils.s(width),
      height: Utils.s(height),
      stroke: 'rgb(212, 18, 229)',
      fill: 'none'
    });
  },

  debugLine: function(x1, y1, x2, y2) {
    return svg('line', {
      x1: Utils.s(x1),
      y1: Utils.s(y1),
      x2: Utils.s(x2),
      y2: Utils.s(y2),
      stroke: 'rgb(212, 18, 229)',
      fill: 'none'
    });
  }
};

module.exports = Shape;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var Color = __webpack_require__(16);
var Utils = __webpack_require__(0);

var Styles = {
  styles: function(copy) {
    this.state = this.state || {};
    this.state.fill = new Color(128);
    this.state.stroke = new Color(0);

    if (copy) {
      if (copy.state.fill === false) this.state.fill = false;
      else if (copy.state.fill) this.state.fill = copy.state.fill.copy();

      if (copy.state.stroke === false) this.state.stroke = false;
      else if (copy.state.stroke) this.state.stroke = copy.state.stroke.copy();

      if (copy.state.strokeWidth)
        this.state.strokeWidth = copy.state.strokeWidth;
      if (copy.state.strokeCap) this.state.strokeCap = copy.state.strokeCap;
      if (copy.state.strokeJoin) this.state.strokeJoin = copy.state.strokeJoin;
      if (copy.state.strokeMiterlimit)
        this.state.strokeMiterlimit = copy.state.strokeMiterlimit;
      if (copy.state.strokeDash) this.state.strokeDash = copy.state.strokeDash;
      if (copy.state.strokeDashOffset)
        this.state.strokeDashOffset = copy.state.strokeDashOffset;
    }
  },

  fill: function(a, b, c, d, e) {
    if (a === false || a === 'none') this.state.fill = false;
    else this.state.fill = new Color(a, b, c, d, e);
    this.changed();
    return this;
  },

  stroke: function(a, b, c, d, e) {
    if (a === false || a === 'none') this.state.stroke = false;
    else this.state.stroke = new Color(a, b, c, d, e);
    this.changed();
    return this;
  },

  strokeWidth: function(val) {
    this.state.strokeWidth = val;
    this.changed();
    return this;
  },

  strokeCap: function(val) {
    this.state.strokeCap = val;
    this.changed();
    return this;
  },

  strokeJoin: function(val) {
    this.state.strokeJoin = val;
    this.changed();
    return this;
  },

  strokeMiterlimit: function(val) {
    this.state.strokeMiterlimit = val;
    this.changed();
    return this;
  },

  strokeDash: function(val) {
    this.state.strokeDash = val;
    this.changed();
    return this;
  },

  strokeDashOffset: function(val) {
    this.state.strokeDashOffset = val;
    this.changed();
    return this;
  },

  scaleStyles: function(scalar) {
    if (this.state.strokeWidth) {
      this.state.strokeWidth *= scalar;
    } else {
      this.state.strokeWidth = scalar;
    }
  },

  stylesAttributes: function(attr) {
    if (this.state.fill) {
      attr.fill =
        'rgb(' +
        this.state.fill.values.rgb[0] +
        ', ' +
        this.state.fill.values.rgb[1] +
        ', ' +
        this.state.fill.values.rgb[2] +
        ')';
      var alpha = this.state.fill.values.alpha;
      if (alpha < 1) attr['fill-opacity'] = Utils.s(alpha);
    }

    if (this.state.stroke) {
      attr.stroke =
        'rgb(' +
        this.state.stroke.values.rgb[0] +
        ', ' +
        this.state.stroke.values.rgb[1] +
        ', ' +
        this.state.stroke.values.rgb[2] +
        ')';
      var alpha = this.state.stroke.values.alpha;
      if (alpha < 1) attr['stroke-opacity'] = Utils.s(alpha);
    }

    if (this.state.strokeWidth)
      attr['stroke-width'] = Utils.s(this.state.strokeWidth);
    if (this.state.strokeCap) attr['stroke-linecap'] = this.state.strokeCap;
    if (this.state.strokeJoin) attr['stroke-linejoin'] = this.state.strokeJoin;
    if (this.state.strokeMiterlimit)
      attr['stroke-miterlimit'] = Utils.s(this.state.strokeMiterlimit);
    if (this.state.strokeDash) attr['stroke-dasharray'] = this.state.strokeDash;
    if (this.state.strokeDashOffset)
      attr['stroke-dashoffset'] = Utils.s(this.state.strokeDashOffset);

    return attr;
  }
};

module.exports = Styles;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(0);
var ROUND_PRECISION = 9;

var Vector = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector.prototype = {

  type: "vector",

  set: function(x, y) {
    this.x = x;
    this.y = y;
  },

  add: function(vec) {
    return new Vector(this.x + vec.x, this.y + vec.y);
  },

  sub: function(vec) {
    return new Vector(this.x - vec.x, this.y - vec.y);
  },

  multiply: function(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  },

  divide: function(scalar) {
    var vec = new Vector(0, 0);
    if(scalar) {
      vec.x = this.x / scalar;
      vec.y = this.y / scalar;
    }
    return vec;
  },

  distance: function(vec) {
    return Math.sqrt(this.distanceSquared(vec));
  },

  distanceSquared: function(vec) {
    var dx = this.x - vec.x;
    var dy = this.y - vec.y;
    return dx * dx + dy * dy;
  },

  lerp: function(vec, scalar) {
    var x = (vec.x - this.x) * scalar + this.x;
    var y = (vec.y - this.y) * scalar + this.y;
    return new Vector(x, y);
  },

  dot: function(vec) {
    return this.x * vec.x + this.y * vec.y;
  },

  length: function() {
    return Math.sqrt(this.lengthSquared());
  },

  lengthSquared: function() {
    return this.x * this.x + this.y * this.y;
  },

  normalize: function() {
    return this.divide(this.length());
  },

  rotation: function() {
    return Utils.degrees(Math.atan2(this.y, this.x));
  },

  rotate: function(degrees) {
    var rad = Utils.radians(this.rotation() + degrees);
    var len = this.length();
    var x = Utils.round(Math.cos(rad) * len, ROUND_PRECISION);
    var y = Utils.round(Math.sin(rad) * len, ROUND_PRECISION);
    return new Vector(x, y);
  },

  copy: function() {
    return new Vector(this.x, this.y);
  },

  toString: function() {
    return "(x: " + this.x + ", y: " + this.y + ")";
  }

}

module.exports = Vector;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "2"


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(7)

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}


/***/ }),
/* 9 */
/***/ (function(module, exports) {

var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(7)

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}


/***/ }),
/* 13 */
/***/ (function(module, exports) {

var Box = {

  box: function(copy) {
    this.state = this.state || {};
    this.state.width = copy ? copy.state.width : 0;
    this.state.height = copy ? copy.state.height : 0;
  },

  width: function(width, relative) {
    this.state.width = relative ? this.state.width + width : width;
    this.changed();
    return this;
  },

  height: function(height, relative) {
    this.state.height = relative ? this.state.height + height : height;
    this.changed();
    return this;
  },

  scaleBox: function(scalar) {
    this.state.width *= scalar;
    this.state.height *= scalar;
  },

  boxAttributes: function(attr) {
    attr.width = Utils.s(this.state.width);
    attr.height = Utils.s(this.state.height);
    return attr;
  }

}

module.exports = Box;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var assign = __webpack_require__(2);
var Shape = __webpack_require__(3);
var Styles = __webpack_require__(4);
var Vector = __webpack_require__(5);
var Utils = __webpack_require__(0);
var svg = __webpack_require__(1);

var Polygon = function(x, y) {
  this.shape();
  this.styles();
  this.state.vectors = [];
  if (typeof x !== 'undefined') this.state.x = x;
  if (typeof y !== 'undefined') this.state.y = y;
};

Polygon.prototype = {
  lineTo: function(x, y) {
    if (x instanceof Vector) {
      this.state.vectors.push(x);
    } else {
      this.state.vectors.push(new Vector(x, y));
    }
    this.changed();
    return this;
  },

  length: function() {
    var len = 0;
    for (var i = 0; i < this.state.vectors.length; i++) {
      var start = this.state.vectors[i];
      var stop = this.state.vectors[(i + 1) % this.state.vectors.length];
      len += stop.sub(start).length();
    }
    return len;
  },

  vectorAtLength: function(len) {
    var tmpLen = 0;

    for (var i = 0; i < this.state.vectors.length; i++) {
      var start = this.state.vectors[i];
      var stop = this.state.vectors[(i + 1) % this.state.vectors.length];
      var vec = stop.sub(start);
      var veclen = vec.length();

      if (tmpLen + veclen > len) {
        var remaining = len - tmpLen;
        return start.add(vec.normalize().multiply(remaining));
      }

      tmpLen += veclen;
    }

    return this.state.vectors[0].copy();
  },

  vectorAt: function(scalar) {
    return this.vectorAtLength(this.length() * scalar);
  },

  area: function() {
    var area = 0;
    for (var i = 0; i < this.state.vectors.length - 1; i++) {
      area +=
        this.state.vectors[i].x * this.state.vectors[i + 1].y -
        this.state.vectors[i + 1].x * this.state.vectors[i].y;
    }
    area /= 2;
    return Math.abs(area);
  },

  bounds: function() {
    var xmax = undefined;
    var ymax = undefined;
    var xmin = undefined;
    var ymin = undefined;

    for (var i = 0; i < this.state.vectors.length; i++) {
      if (typeof xmin === 'undefined' || this.state.vectors[i].x < xmin)
        xmin = this.state.vectors[i].x;
      if (typeof xmax === 'undefined' || this.state.vectors[i].x > xmax)
        xmax = this.state.vectors[i].x;
      if (typeof ymin === 'undefined' || this.state.vectors[i].y < ymin)
        ymin = this.state.vectors[i].y;
      if (typeof ymax === 'undefined' || this.state.vectors[i].y > ymax)
        ymax = this.state.vectors[i].y;
    }

    return {
      x: xmin,
      y: ymin,
      width: xmax - xmin,
      height: ymax - ymin
    };
  },

  centroid: function() {
    var areaAcc = 0.0;
    var xAcc = 0.0;
    var yAcc = 0.0;
    for (var i = 0; i < this.state.vectors.length; i++) {
      var start = this.state.vectors[i];
      var stop = this.state.vectors[(i + 1) % this.state.vectors.length];
      areaAcc += start.x * stop.y - stop.x * start.y;
      xAcc += (start.x + stop.x) * (start.x * stop.y - stop.x * start.y);
      yAcc += (start.y + stop.y) * (start.x * stop.y - stop.x * start.y);
    }
    areaAcc /= 2.0;
    var x = xAcc / (6.0 * areaAcc);
    var y = yAcc / (6.0 * areaAcc);
    return new Vector(x, y);
  },

  toPolygon: function(opts, parent) {
    if (opts && opts.spacing) {
      var poly = new Polygon(this.state.x, this.state.y);
      var len = this.length();
      var num = len / opts.spacing;
      for (var i = 0; i < num; i++) {
        var vec = this.vectorAtLength(i * opts.spacing);
        poly.lineTo(vec.x, vec.y);
      }

      Utils.copyMixinVars(this, poly);
      Utils.groupLogic(poly, this.parent, parent);

      return poly;
    }

    return this;
  },

  copy: function(parent) {
    var copy = new Polygon();
    copy.state.vectors = this.state.vectors.map(function(v) {
      return v.copy();
    });
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  // Code from ContainsPoint function here:
  // http://polyk.ivank.net
  contains: function(x, y) {
    // get stage position
    var addPos = this.stagepos();

    // map array of vectors to flat array of xy numbers
    // This might be slow, so let's rewrite this at some point.

    var p = Utils.flatten(
      this.state.vectors.map(function(vector) {
        return [addPos.x + vector.x, addPos.y + vector.y];
      }, this)
    );

    var n = p.length >> 1;
    var ax,
      ay = p[2 * n - 3] - y,
      bx = p[2 * n - 2] - x,
      by = p[2 * n - 1] - y;

    var lup;
    for (var i = 0; i < n; i++) {
      ax = bx;
      ay = by;
      bx = p[2 * i] - x;
      by = p[2 * i + 1] - y;
      if (ay == by) continue;
      lup = by > ay;
    }

    var depth = 0;
    for (var i = 0; i < n; i++) {
      ax = bx;
      ay = by;
      bx = p[2 * i] - x;
      by = p[2 * i + 1] - y;
      if (ay < 0 && by < 0) continue; // both "up" or both "down"
      if (ay > 0 && by > 0) continue; // both "up" or both "down"
      if (ax < 0 && bx < 0) continue; // both points on the left

      if (ay == by && Math.min(ax, bx) <= 0) return true;
      if (ay == by) continue;

      var lx = ax + (bx - ax) * -ay / (by - ay);
      if (lx == 0) return true; // point on edge
      if (lx > 0) depth++;
      if (ay == 0 && lup && by > ay) depth--; // hit vertex, both up
      if (ay == 0 && !lup && by < ay) depth--; // hit vertex, both down
      lup = by > ay;
    }

    return (depth & 1) == 1;
  },

  scale: function(scalar) {
    this.scaleStyles(scalar);
    this.state.vectors = this.state.vectors.map(function(vec) {
      return vec.multiply(scalar);
    });
    this.changed();
    return this;
  },

  render: function(opts) {
    var attr = {
      points: this.state.vectors
        .map(function(vec) {
          return vec.x + ' ' + vec.y;
        })
        .join(' ')
    };
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('polygon', attr);
  }
};

assign(Polygon.prototype, Shape, Styles, { type: 'polygon' });

module.exports = Polygon;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var Bezier = __webpack_require__(30);
var Vector = __webpack_require__(5);
var Utils = __webpack_require__(0);

var Anchor = function() {};

Anchor.prototype = {

  type: "anchor",

  add: function(vec) {
    var a = this.copy();
    if(a.vec1) a.vec1 = a.vec1.add(vec);
    if(a.vec2) a.vec2 = a.vec2.add(vec);
    if(a.vec3) a.vec3 = a.vec3.add(vec);
    return a;
  },

  sub: function(vec) {
    var a = this.copy();
    if(a.vec1) a.vec1 = a.vec1.sub(vec);
    if(a.vec2) a.vec2 = a.vec2.sub(vec);
    if(a.vec3) a.vec3 = a.vec3.sub(vec);
    return a;
  },

  multiply: function(scalar) {
    var a = this.copy();
    if(a.vec1) a.vec1 = a.vec1.multiply(scalar);
    if(a.vec2) a.vec2 = a.vec2.multiply(scalar);
    if(a.vec3) a.vec3 = a.vec3.multiply(scalar);
    return a;
  },

  copy: function() {
    var a = new Anchor();
    a.command = this.command;
    if(this.vec1) a.vec1 = this.vec1.copy();
    if(this.vec2) a.vec2 = this.vec2.copy();
    if(this.vec3) a.vec3 = this.vec3.copy();
    return a;
  },

  setMove: function(x, y) {
    this.command = 'move';
    if (x instanceof Vector) {
      this.vec1 = x;
    } else {
      this.vec1 = new Vector(x, y);
    }
    return this;
  },

  setLine: function(x, y) {
    this.command = 'line';
    if (x instanceof Vector) {
      this.vec1 = x;
    } else {
      this.vec1 = new Vector(x, y);
    }
    return this;
  },

  setCurve: function(a, b, c, d, e, f) {
    // cubic bezier with two control points
    if(typeof f !== 'undefined') {
      this.command = 'cubic';
      this.vec1 = new Vector(a, b);
      this.vec2 = new Vector(c, d);
      this.vec3 = new Vector(e, f);
    }

    // quad bezier with one control point
    else {
      this.command = 'quad';
      this.vec1 = new Vector(a, b);
      this.vec2 = new Vector(c, d);
    }
    return this;
  },

  setClose: function() {
    this.command = 'close';
    return this;
  },

  length: function() {
    if(this.command == 'move') {
      return 0;
    }
    else if(this.command == 'line') {
      return this.vec1.length();
    }
    else if(this.command == 'quad') {
      return new Bezier(0, 0, this.vec1.x, this.vec1.y, this.vec2.x, this.vec2.y).length();
    }
    else if(this.command == 'cubic') {
      return new Bezier(0, 0, this.vec1.x, this.vec1.y, this.vec2.x, this.vec2.y, this.vec3.x, this.vec3.y).length();
    }
    else {
      throw new Error("Cannot compute length for this type of anchor")
    }
  },

  vectorAt: function(scalar) {

    if(scalar > 1) scalar = 1;
    if(scalar < 0) scalar = 0;

    var ax, bx, cx;
    var ay, by, cy;
    var tSquared, tDoubled, tCubed;
    var dx, dy;

    if(this.command == 'line') {
      return new Vector(this.vec1.x, this.vec1.y).multiply(scalar)
    }
    else if(this.command == 'quad') {
      return new Bezier(0, 0, this.vec1.x, this.vec1.y, this.vec2.x, this.vec2.y).get(scalar);
    }
    else if(this.command == 'cubic') {
      return new Bezier(0, 0, this.vec1.x, this.vec1.y, this.vec2.x, this.vec2.y, this.vec3.x, this.vec3.y).get(scalar);
    }
    else {
      throw new Error("Cannot compute vectorAt for this type of anchor")
    }
  }

}

module.exports = Anchor;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// This code was adapted from the brilliant color lib by MoOx
// See more here: https://github.com/MoOx/color
var colorConvert = __webpack_require__(17);
var colorParse = __webpack_require__(32);

var Color = function(a, b, c, d, e) {
  this.values = {
    rgb: [0, 0, 0],
    hsl: [0, 0, 0],
    hsv: [0, 0, 0],
    hwb: [0, 0, 0],
    cmyk: [0, 0, 0, 0],
    alpha: 1
  };

  // COLOR
  if (a instanceof Color) {
    return a;
  } else if (a == "hsv") {
    // HSB
    this.setValues("hsv", { h: b % 360, s: c, v: d });
    if (e) this.setValues("alpha", e);
  } else if (typeof a === "string") {
    // HEX
    // convert HEX to RGB
    var result = colorParse(a);
    if (result.rgb) {
      this.setValues("rgb", result.rgb);
      if (result.rgba) this.setValues("alpha", result.rgba[3]);
    } else {
      throw new Error('Unable to parse color from string "' + a + '"');
    }
    if (b) this.setValues("alpha", b);
  } else if (typeof c === "undefined") {
    // GRAYSCALE
    this.setValues("rgb", { r: a, g: a, b: a });
    if (b) this.setValues("alpha", b);
  } else if (typeof a !== "undefined") {
    // RGB
    this.setValues("rgb", { r: a, g: b, b: c });
    if (d) this.setValues("alpha", d);
  }
};

Color.prototype = {
  type: "color",

  rgb: function(vals) {
    return this.setSpace("rgb", arguments);
  },

  hsl: function(vals) {
    return this.setSpace("hsl", arguments);
  },

  hsv: function(vals) {
    return this.setSpace("hsv", arguments);
  },

  hwb: function(vals) {
    return this.setSpace("hwb", arguments);
  },

  cmyk: function(vals) {
    return this.setSpace("cmyk", arguments);
  },

  rgbArray: function() {
    return this.values.rgb;
  },

  hslArray: function() {
    return this.values.hsl;
  },

  hsvArray: function() {
    return this.values.hsv;
  },

  hwbArray: function() {
    if (this.values.alpha !== 1) {
      return this.values.hwb.concat([this.values.alpha]);
    }
    return this.values.hwb;
  },

  cmykArray: function() {
    return this.values.cmyk;
  },

  rgbaArray: function() {
    var rgb = this.values.rgb;
    return rgb.concat([this.values.alpha]);
  },

  hslaArray: function() {
    var hsl = this.values.hsl;
    return hsl.concat([this.values.alpha]);
  },

  alpha: function(val) {
    if (val === undefined) {
      return this.values.alpha;
    }
    this.setValues("alpha", val);
    return this;
  },

  red: function(val) {
    return this.setChannel("rgb", 0, val);
  },

  green: function(val) {
    return this.setChannel("rgb", 1, val);
  },

  blue: function(val) {
    return this.setChannel("rgb", 2, val);
  },

  hue: function(val) {
    return this.setChannel("hsl", 0, val);
  },

  saturation: function(val) {
    return this.setChannel("hsl", 1, val);
  },

  lightness: function(val) {
    return this.setChannel("hsl", 2, val);
  },

  saturationv: function(val) {
    return this.setChannel("hsv", 1, val);
  },

  whiteness: function(val) {
    return this.setChannel("hwb", 1, val);
  },

  blackness: function(val) {
    return this.setChannel("hwb", 2, val);
  },

  value: function(val) {
    return this.setChannel("hsv", 2, val);
  },

  cyan: function(val) {
    return this.setChannel("cmyk", 0, val);
  },

  magenta: function(val) {
    return this.setChannel("cmyk", 1, val);
  },

  yellow: function(val) {
    return this.setChannel("cmyk", 2, val);
  },

  black: function(val) {
    return this.setChannel("cmyk", 3, val);
  },

  luminosity: function() {
    // http://www.w3.org/TR/WCAG20/#relativeluminancedef
    var rgb = this.values.rgb;
    var lum = [];
    for (var i = 0; i < rgb.length; i++) {
      var chan = rgb[i] / 255;
      lum[i] =
        chan <= 0.03928 ? chan / 12.92 : Math.pow((chan + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
  },

  contrast: function(color2) {
    // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
    var lum1 = this.luminosity();
    var lum2 = color2.luminosity();
    if (lum1 > lum2) {
      return (lum1 + 0.05) / (lum2 + 0.05);
    }
    return (lum2 + 0.05) / (lum1 + 0.05);
  },

  level: function(color2) {
    var contrastRatio = this.contrast(color2);
    return contrastRatio >= 7.1 ? "AAA" : contrastRatio >= 4.5 ? "AA" : "";
  },

  dark: function() {
    // YIQ equation from http://24ways.org/2010/calculating-color-contrast
    var rgb = this.values.rgb,
      yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return yiq < 128;
  },

  light: function() {
    return !this.dark();
  },

  negate: function() {
    var rgb = [];
    for (var i = 0; i < 3; i++) {
      rgb[i] = 255 - this.values.rgb[i];
    }
    this.setValues("rgb", rgb);
    return this;
  },

  lighten: function(ratio) {
    this.values.hsl[2] += this.values.hsl[2] * ratio;
    this.setValues("hsl", this.values.hsl);
    return this;
  },

  darken: function(ratio) {
    this.values.hsl[2] -= this.values.hsl[2] * ratio;
    this.setValues("hsl", this.values.hsl);
    return this;
  },

  saturate: function(ratio) {
    this.values.hsl[1] += this.values.hsl[1] * ratio;
    this.setValues("hsl", this.values.hsl);
    return this;
  },

  desaturate: function(ratio) {
    this.values.hsl[1] -= this.values.hsl[1] * ratio;
    this.setValues("hsl", this.values.hsl);
    return this;
  },

  whiten: function(ratio) {
    this.values.hwb[1] += this.values.hwb[1] * ratio;
    this.setValues("hwb", this.values.hwb);
    return this;
  },

  blacken: function(ratio) {
    this.values.hwb[2] += this.values.hwb[2] * ratio;
    this.setValues("hwb", this.values.hwb);
    return this;
  },

  greyscale: function() {
    var rgb = this.values.rgb;
    // http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
    var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
    this.setValues("rgb", [val, val, val]);
    return this;
  },

  clearer: function(ratio) {
    this.setValues("alpha", this.values.alpha - this.values.alpha * ratio);
    return this;
  },

  opaquer: function(ratio) {
    this.setValues("alpha", this.values.alpha + this.values.alpha * ratio);
    return this;
  },

  rotate: function(degrees) {
    var hue = this.values.hsl[0];
    hue = (hue + degrees) % 360;
    hue = hue < 0 ? 360 + hue : hue;
    this.values.hsl[0] = hue;
    this.setValues("hsl", this.values.hsl);
    return this;
  },

  /**
   * Ported from sass implementation in C
   * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
   */
  mix: function(mixinColor, weight) {
    var color1 = this;
    var color2 = mixinColor;
    var p = weight !== undefined ? weight : 0.5;

    var w = 2 * p - 1;
    var a = color1.alpha() - color2.alpha();

    var w1 = ((w * a == -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
    var w2 = 1 - w1;

    return this.rgb(
      w1 * color1.red() + w2 * color2.red(),
      w1 * color1.green() + w2 * color2.green(),
      w1 * color1.blue() + w2 * color2.blue()
    ).alpha(color1.alpha() * p + color2.alpha() * (1 - p));
  },

  toJSON: function() {
    return this.rgb();
  },

  copy: function() {
    return new Color().rgb(this.rgb());
  },

  getValues: function(space) {
    var vals = {};
    for (var i = 0; i < space.length; i++) {
      vals[space.charAt(i)] = this.values[space][i];
    }
    if (this.values.alpha != 1) {
      vals["a"] = this.values.alpha;
    }
    // {r: 255, g: 255, b: 255, a: 0.4}
    return vals;
  },

  setValues: function(space, vals) {
    var spaces = {
      rgb: ["red", "green", "blue"],
      hsl: ["hue", "saturation", "lightness"],
      hsv: ["hue", "saturation", "value"],
      hwb: ["hue", "whiteness", "blackness"],
      cmyk: ["cyan", "magenta", "yellow", "black"]
    };

    var maxes = {
      rgb: [255, 255, 255],
      hsl: [360, 100, 100],
      hsv: [360, 100, 100],
      hwb: [360, 100, 100],
      cmyk: [100, 100, 100, 100]
    };

    var alpha = 1;
    if (space == "alpha") {
      alpha = vals;
    } else if (vals.length) {
      // [10, 10, 10]
      this.values[space] = vals.slice(0, space.length);
      alpha = vals[space.length];
    } else if (vals[space.charAt(0)] !== undefined) {
      // {r: 10, g: 10, b: 10}
      for (var i = 0; i < space.length; i++) {
        this.values[space][i] = vals[space.charAt(i)];
      }
      alpha = vals.a;
    } else if (vals[spaces[space][0]] !== undefined) {
      // {red: 10, green: 10, blue: 10}
      var chans = spaces[space];
      for (var i = 0; i < space.length; i++) {
        this.values[space][i] = vals[chans[i]];
      }
      alpha = vals.alpha;
    }
    this.values.alpha = Math.max(
      0,
      Math.min(1, alpha !== undefined ? alpha : this.values.alpha)
    );
    if (space == "alpha") {
      return;
    }

    // cap values of the space prior converting all values
    for (var i = 0; i < space.length; i++) {
      var capped = Math.max(
        0,
        Math.min(maxes[space][i], this.values[space][i])
      );
      this.values[space][i] = Math.round(capped);
    }

    // convert to all the other color spaces
    for (var sname in spaces) {
      if (sname != space) {
        this.values[sname] = colorConvert[space][sname](this.values[space]);
      }

      // cap values
      for (var i = 0; i < sname.length; i++) {
        var capped = Math.max(
          0,
          Math.min(maxes[sname][i], this.values[sname][i])
        );
        this.values[sname][i] = Math.round(capped);
      }
    }
    return true;
  },

  setSpace: function(space, args) {
    var vals = args[0];
    if (vals === undefined) {
      // color.rgb()
      return this.getValues(space);
    }
    // color.rgb(10, 10, 10)
    if (typeof vals == "number") {
      vals = Array.prototype.slice.call(args);
    }
    this.setValues(space, vals);
    return this;
  },

  setChannel: function(space, index, val) {
    if (val === undefined) {
      // color.red()
      return this.values[space][index];
    }
    // color.red(100)
    this.values[space][index] = val;
    this.setValues(space, this.values[space]);
    return this;
  }
};

// Modules should be accessible through Color
Color.Convert = colorConvert;

module.exports = Color;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(31);

var convert = function() {
   return new Converter();
}

for (var func in conversions) {
  // export Raw versions
  convert[func + "Raw"] =  (function(func) {
    // accept array or plain args
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      return conversions[func](arg);
    }
  })(func);

  var pair = /(\w+)2(\w+)/.exec(func),
      from = pair[1],
      to = pair[2];

  // export rgb2hsl and ["rgb"]["hsl"]
  convert[from] = convert[from] || {};

  convert[from][to] = convert[func] = (function(func) { 
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      
      var val = conversions[func](arg);
      if (typeof val == "string" || val === undefined)
        return val; // keyword

      for (var i = 0; i < val.length; i++)
        val[i] = Math.round(val[i]);
      return val;
    }
  })(func);
}


/* Converter does lazy conversion and caching */
var Converter = function() {
   this.convs = {};
};

/* Either get the values for a space or
  set the values for a space, depending on args */
Converter.prototype.routeSpace = function(space, args) {
   var values = args[0];
   if (values === undefined) {
      // color.rgb()
      return this.getValues(space);
   }
   // color.rgb(10, 10, 10)
   if (typeof values == "number") {
      values = Array.prototype.slice.call(args);        
   }

   return this.setValues(space, values);
};
  
/* Set the values for a space, invalidating cache */
Converter.prototype.setValues = function(space, values) {
   this.space = space;
   this.convs = {};
   this.convs[space] = values;
   return this;
};

/* Get the values for a space. If there's already
  a conversion for the space, fetch it, otherwise
  compute it */
Converter.prototype.getValues = function(space) {
   var vals = this.convs[space];
   if (!vals) {
      var fspace = this.space,
          from = this.convs[fspace];
      vals = convert[fspace][space](from);

      this.convs[space] = vals;
   }
  return vals;
};

["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {
   Converter.prototype[space] = function(vals) {
      return this.routeSpace(space, arguments);
   }
});

module.exports = convert;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var assign = __webpack_require__(2);
var Shape = __webpack_require__(3);
var Styles = __webpack_require__(4);
var Parent = __webpack_require__(21);
var Utils = __webpack_require__(0);
var Vector = __webpack_require__(5);
var svg = __webpack_require__(1);

var Group = function(x, y) {
  this.shape();
  this.setupParent();
  if (typeof x !== 'undefined') this.state.x = x;
  if (typeof y !== 'undefined') this.state.y = y;
};

Group.prototype = {
  add: function(child) {
    this.addChild(child);
  },

  remove: function(child) {
    this.removeChild(child);
  },

  copy: function(parent) {
    var copy = new Group();
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].copy(copy);
    }
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  scale: function(scalar) {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].state.x *= scalar;
      this.children[i].state.y *= scalar;
      this.children[i].scale(scalar);
    }
    return this;
  },

  render: function(opts) {
    if (!this.children || this.children.length == 0) return;
    var attr = this.shapeAttributes({});
    this.stylesAttributes(attr);
    return svg('g', attr, this.renderChildren(opts));
  }
};

assign(Group.prototype, Shape, Styles, Parent, { type: 'group' });

module.exports = Group;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArray = __webpack_require__(9);

var VNode = __webpack_require__(33);
var VText = __webpack_require__(34);
var isVNode = __webpack_require__(8);
var isVText = __webpack_require__(12);
var isWidget = __webpack_require__(6);
var isHook = __webpack_require__(11);
var isVThunk = __webpack_require__(10);

var parseTag = __webpack_require__(35);
var softSetHook = __webpack_require__(37);
var evHook = __webpack_require__(38);

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}


/***/ }),
/* 20 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

var Parent = {
  setupParent: function() {
    this.children = [];
    this.changedChildren = [];
    this.renderedChildren = [];
  },

  addChild: function(child) {
    if (child.parent) child.parent.remove(child);
    this.children.push(child);
    child.parent = this;
    child.childId = this.children.length - 1;
    child.changed();
  },

  removeChild: function(child) {
    if (child.parent !== this) {
      return;
    }

    // check if it is in this parent
    this.renderedChildren.splice(child.childId, 1);
    this.children.splice(child.childId, 1);

    var childIndex = this.changedChildren.indexOf(child.childId);
    if (childIndex !== -1) {
      this.changedChildren.splice(childIndex, 1);
    }

    // Lower id's of all children above by one
    for (var i = child.childId; i < this.children.length; i++) {
      this.children[i].childId--;
    }

    // lower id's of all changedChildren by one
    for (var i = 0; i < this.changedChildren.length; i++) {
      if (this.changedChildren[i] > child.childId) this.changedChildren[i]--;
    }

    child.childId = null;
    child.parentNotified = false;
    child.parent = false;
    this.changed();
  },

  renderChildren: function(opts) {
    // loop through the changed children
    while (this.changedChildren.length > 0) {
      var childId = this.changedChildren.shift();
      this.renderedChildren[childId] = this.children[childId].render(opts);
      this.children[childId].parentNotified = false;
    }

    // FIGURE OUT HOW NOT TO FLATTEN EVERY TIME!
    return utils.flatten(this.renderedChildren, true);
  }
};

module.exports = Parent;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var assign = __webpack_require__(2);
var Shape = __webpack_require__(3);
var Box = __webpack_require__(13);
var Styles = __webpack_require__(4);
var Polygon = __webpack_require__(14);
var Utils = __webpack_require__(0);
var svg = __webpack_require__(1);

var Ellipse = function(x, y, width, height) {
  this.shape();
  this.box();
  this.styles();
  this.state.x = x;
  this.state.y = y;
  this.state.width = width;
  this.state.height = height;
}

Ellipse.prototype = {

  toPolygon: function(opts, parent) {

    var numVectors = 16;
    var rx = this.state.width/2;
    var ry = this.state.height/2;

    // if we're calculating the number of vectors based on spacing
    // find circumference and divide by spacing.
    if(opts && opts.spacing) {
      var circumference = Math.PI * (this.state.width+this.state.height);
      numVectors = circumference / opts.spacing;
    }

    var vectorAngle = 360/numVectors;

    var poly =  new Polygon(this.state.x, this.state.y);
    for(var i = 0; i < numVectors; i++) {
      var x = Math.cos(Utils.radians(i * vectorAngle)) * rx;
      var y = Math.sin(Utils.radians(i * vectorAngle)) * ry;
      poly.lineTo(x, y);
    }

    Utils.copyMixinVars(this, poly);
    Utils.groupLogic(poly, this.parent, parent);

    return poly;
  },

  scale: function(scalar) {
    this.scaleBox(scalar);
    this.scaleStyles(scalar);
    this.changed();
    return this;
  },

  copy: function(parent) {
    var copy = new Ellipse();
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  render: function(opts) {
    var attr = {
      cx: Utils.s(this.state.x),
      cy: Utils.s(this.state.y),
      rx: Utils.s(this.state.width / 2),
      ry: Utils.s(this.state.height / 2)
    }
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('ellipse', attr);
  }

}

assign(Ellipse.prototype, Shape, Box, Styles, {type: "ellipse"});

module.exports = Ellipse;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(7)

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var isVNode = __webpack_require__(8)
var isVText = __webpack_require__(12)
var isWidget = __webpack_require__(6)
var isThunk = __webpack_require__(10)

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = __webpack_require__(59);

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20)))

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(26)

var applyProperties = __webpack_require__(28)

var isVNode = __webpack_require__(8)
var isVText = __webpack_require__(12)
var isWidget = __webpack_require__(6)
var handleThunk = __webpack_require__(24)

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(25)
var isHook = __webpack_require__(11)

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var assign = __webpack_require__(2);
var Vector = __webpack_require__(5);
var Anchor = __webpack_require__(15);
var Color = __webpack_require__(16);
var Group = __webpack_require__(18);
var Grid = __webpack_require__(44);
var Utils = __webpack_require__(0);
var Events = __webpack_require__(45);
var Circle = __webpack_require__(46);
var Ellipse = __webpack_require__(22);
var Line = __webpack_require__(47);
var Triangle = __webpack_require__(48);
var Path = __webpack_require__(49);
var Polygon = __webpack_require__(14);
var Rectangle = __webpack_require__(50);
var Text = __webpack_require__(51);
var Image = __webpack_require__(52);
var Box = __webpack_require__(13);
var Shape = __webpack_require__(3);
var Styles = __webpack_require__(4);

var h = __webpack_require__(53);
var diff = __webpack_require__(54);
var patch = __webpack_require__(57);
var createElement = __webpack_require__(63);
var svg = __webpack_require__(1);

// Constructor
// --------------------------------------------------

var Rune = function(options) {
  var params = assign(
    {
      debug: false,
      frameRate: 60
    },
    options
  );

  var attrs = {
    xmlns: 'http://www.w3.org/2000/svg',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink'
  };

  if (params.width) {
    attrs.width = Utils.s(params.width);
    this.width = params.width;
  }

  if (params.height) {
    attrs.height = Utils.s(params.height);
    this.height = params.height;
  }

  if (attrs.width && attrs.height) {
    attrs.viewBox = '0 0 ' + attrs.width + ' ' + attrs.height;
  }

  var props = {
    attributes: attrs
  };

  this.tree = svg('svg', props);
  this.el = createElement(this.tree);
  this.stage = new Group();
  this.debug = params.debug;
  this.frameCount = 1;
  this.frameRate = params.frameRate;

  if (params.container && Utils.isBrowser()) {
    if (typeof params.container === 'string') {
      params.container = document.querySelector(params.container);
    }

    if (params.container) {
      this.appendTo(params.container);
      var bounds = this.el.getBoundingClientRect();
      if (!this.width) {
        this.width = bounds.width;
        this.ignoreWidth = true;
      }
      if (!this.height) {
        this.height = bounds.height;
        this.ignoreHeight = true;
      }
    } else {
      console.error('Container element not found');
    }
  }

  // last resort to catch no dimensions
  if (!this.width) this.width = 640;
  if (!this.height) this.height = 480;

  this.initEvents();
};

Rune.prototype = {
  // Helpers
  // --------------------------------------------------

  //
  handleSize: function() {},

  relativePos: function(pageX, pageY) {
    var bounds = this.el.getBoundingClientRect();
    var relX = pageX - window.scrollX - bounds.left;
    var relY = pageY - window.scrollY - bounds.top;
    return { x: relX, y: relY };
  },

  // Events
  // --------------------------------------------------

  initEvents: function() {
    // Specific browser events
    if (typeof window !== 'undefined') {
      this.initMouseEvents();
    }
  },

  initMouseEvents: function() {
    var mouseEvents = ['mousemove', 'mousedown', 'mouseup', 'click'];
    var that = this;
    for (var i = 0; i < mouseEvents.length; i++) {
      this.el.addEventListener(mouseEvents[i], function(e) {
        var rel = that.relativePos(e.pageX, e.pageY);
        that.trigger(mouseEvents[i], { x: rel.x, y: rel.y });
      });
    }
  },

  // Shape functions
  // --------------------------------------------------

  group: function(x, y, parent) {
    var g = new Group(x, y);
    Utils.groupLogic(g, this.stage, parent);
    return g;
  },

  triangle: function(x, y, x2, y2, x3, y3, parent) {
    var t = new Triangle(x, y, x2, y2, x3, y3);
    Utils.groupLogic(t, this.stage, parent);
    return t;
  },

  rect: function(x, y, width, height, parent) {
    var r = new Rectangle(x, y, width, height);
    Utils.groupLogic(r, this.stage, parent);
    return r;
  },

  ellipse: function(x, y, width, height, parent) {
    var e = new Ellipse(x, y, width, height);
    Utils.groupLogic(e, this.stage, parent);
    return e;
  },

  circle: function(x, y, radius, parent) {
    var c = new Circle(x, y, radius, parent);
    Utils.groupLogic(c, this.stage, parent);
    return c;
  },

  line: function(x1, y1, x2, y2, parent) {
    var l = new Line(x1, y1, x2, y2);
    Utils.groupLogic(l, this.stage, parent);
    return l;
  },

  polygon: function(x, y, parent) {
    var p = new Polygon(x, y);
    Utils.groupLogic(p, this.stage, parent);
    return p;
  },

  path: function(x, y, parent) {
    var p = new Path(x, y);
    Utils.groupLogic(p, this.stage, parent);
    return p;
  },

  text: function(textString, x, y, parent) {
    var t = new Text(textString, x, y);
    Utils.groupLogic(t, this.stage, parent);
    return t;
  },

  image: function(url, x, y, width, height, parent) {
    var i = new Image(url, x, y, width, height);
    Utils.groupLogic(i, this.stage, parent);
    return i;
  },

  grid: function(options, parent) {
    var g = new Grid(options);
    Utils.groupLogic(g, this.stage, parent);
    return g;
  },

  // Playhead
  // --------------------------------------------------

  // This function is a proxy function that is run on every frame
  // It has a check that delays the frame with a setTimeout if
  // the framerate is lower than 60 fps.
  play: function() {
    if (this.pauseNext) {
      this.pauseNext = false;
      return;
    }

    if (this.frameRate >= 60) {
      this.playNow();
    } else {
      var that = this;
      setTimeout(function() {
        that.playNow();
      }, 1000 / this.frameRate);
    }
  },

  playNow: function() {
    var that = this;
    this.trigger('update', { frameCount: this.frameCount });
    this.animationFrame = requestAnimationFrame(function() {
      that.play();
    });
    this.draw();
  },

  pause: function() {
    this.pauseNext = true;
  },

  // Render functions
  // --------------------------------------------------

  appendTo: function(container) {
    container.appendChild(this.el);
    return this;
  },

  draw: function() {
    var attrs = {
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink'
    };

    if (!this.ignoreWidth) attrs.width = Utils.s(this.width);
    if (!this.ignoreHeight) attrs.height = Utils.s(this.height);

    var props = {
      attributes: attrs
    };

    var newTree = svg('svg', props, [
      this.stage.renderChildren({ debug: this.debug })
    ]);
    var diffTree = diff(this.tree, newTree);
    this.el = patch(this.el, diffTree);
    this.tree = newTree;

    this.frameCount += 1;
  }
};

assign(Rune, Utils);
assign(Rune.prototype, Utils);
assign(Rune.prototype, Events);

// Modules should be accessible through Rune
Rune.Vector = Vector;
Rune.Anchor = Anchor;
Rune.Color = Color;
Rune.Group = Group;
Rune.Grid = Grid;
Rune.Circle = Circle;
Rune.Ellipse = Ellipse;
Rune.Line = Line;
Rune.Triangle = Triangle;
Rune.Path = Path;
Rune.Polygon = Polygon;
Rune.Rectangle = Rectangle;
Rune.Text = Text;
Rune.Image = Image;

// Right now I need these for mixin tests.
// Rewrite so we don't need them.
Rune.Shape = Shape;
Rune.Styles = Styles;
Rune.Box = Box;

module.exports = Rune;


/***/ }),
/* 30 */
/***/ (function(module, exports) {

// This code was extracted from Bezier.js
// A javascript Bezier curve library by Pomax.
// Based on http://pomax.github.io/bezierinfo
// http://pomax.github.io/bezierjs/

(function() {
  "use strict";

  // Math functions. I hate the Math namespace with a passion.
  var abs = Math.abs,
      min = Math.min,
      max = Math.max,
      cos = Math.cos,
      sin = Math.sin,
      acos = Math.acos,
      asin = Math.asin,
      atan2 = Math.atan2,
      sqrt = Math.sqrt,
      // cube root function yielding real roots
      crt = function(v) { if(v<0) return -Math.pow(-v,1/3); return Math.pow(v,1/3); },
      pi = Math.PI,
      tau = 2*pi,
      quart = pi/2;

  // a zero coordinate, which is surprisingly useful
  var ZERO = {x:0,y:0,z:0};

  // Bezier utility functions
  var utils = {
    // Legendre-Gauss abscissae with n=24 (x_i values, defined at i=n as the roots of the nth order Legendre polynomial Pn(x))
    Tvalues: [
      -0.0640568928626056260850430826247450385909,
       0.0640568928626056260850430826247450385909,
      -0.1911188674736163091586398207570696318404,
       0.1911188674736163091586398207570696318404,
      -0.3150426796961633743867932913198102407864,
       0.3150426796961633743867932913198102407864,
      -0.4337935076260451384870842319133497124524,
       0.4337935076260451384870842319133497124524,
      -0.5454214713888395356583756172183723700107,
       0.5454214713888395356583756172183723700107,
      -0.6480936519369755692524957869107476266696,
       0.6480936519369755692524957869107476266696,
      -0.7401241915785543642438281030999784255232,
       0.7401241915785543642438281030999784255232,
      -0.8200019859739029219539498726697452080761,
       0.8200019859739029219539498726697452080761,
      -0.8864155270044010342131543419821967550873,
       0.8864155270044010342131543419821967550873,
      -0.9382745520027327585236490017087214496548,
       0.9382745520027327585236490017087214496548,
      -0.9747285559713094981983919930081690617411,
       0.9747285559713094981983919930081690617411,
      -0.9951872199970213601799974097007368118745,
       0.9951872199970213601799974097007368118745
    ],

    // Legendre-Gauss weights with n=24 (w_i values, defined by a function linked to in the Bezier primer article)
    Cvalues: [
      0.1279381953467521569740561652246953718517,
      0.1279381953467521569740561652246953718517,
      0.1258374563468282961213753825111836887264,
      0.1258374563468282961213753825111836887264,
      0.1216704729278033912044631534762624256070,
      0.1216704729278033912044631534762624256070,
      0.1155056680537256013533444839067835598622,
      0.1155056680537256013533444839067835598622,
      0.1074442701159656347825773424466062227946,
      0.1074442701159656347825773424466062227946,
      0.0976186521041138882698806644642471544279,
      0.0976186521041138882698806644642471544279,
      0.0861901615319532759171852029837426671850,
      0.0861901615319532759171852029837426671850,
      0.0733464814110803057340336152531165181193,
      0.0733464814110803057340336152531165181193,
      0.0592985849154367807463677585001085845412,
      0.0592985849154367807463677585001085845412,
      0.0442774388174198061686027482113382288593,
      0.0442774388174198061686027482113382288593,
      0.0285313886289336631813078159518782864491,
      0.0285313886289336631813078159518782864491,
      0.0123412297999871995468056670700372915759,
      0.0123412297999871995468056670700372915759
    ],
    arcfn: function(t, derivativeFn) {
      var d = derivativeFn(t);
      var l = d.x*d.x + d.y*d.y;
      if(typeof d.z !== "undefined") {
        l += d.z*d.z;
      }
      return sqrt(l);
    },
    length: function(derivativeFn) {
      var z=0.5,sum=0,len=this.Tvalues.length,i,t;
      for(i=0; i<len; i++) {
        t = z * this.Tvalues[i] + z;
        sum += this.Cvalues[i] * this.arcfn(t,derivativeFn);
      }
      return z * sum;
    },
    angle: function(o,v1,v2) {
      var dx1 = v1.x - o.x,
          dy1 = v1.y - o.y,
          dx2 = v2.x - o.x,
          dy2 = v2.y - o.y,
          cross = dx1*dy2 - dy1*dx2,
          m1 = sqrt(dx1*dx1+dy1*dy1),
          m2 = sqrt(dx2*dx2+dy2*dy2),
          dot;
      dx1/=m1; dy1/=m1; dx2/=m2; dy2/=m2;
      dot = dx1*dx2 + dy1*dy2;
      return atan2(cross, dot);
    },
    dist: function(p1, p2) {
      var dx = p1.x - p2.x,
          dy = p1.y - p2.y;
      return sqrt(dx*dx+dy*dy);
    },
    align: function(points, line) {
      var tx = line.p1.x,
          ty = line.p1.y,
          a = -atan2(line.p2.y-ty, line.p2.x-tx),
          d = function(v) {
            return {
              x: (v.x-tx)*cos(a) - (v.y-ty)*sin(a),
              y: (v.x-tx)*sin(a) + (v.y-ty)*cos(a)
            };
          };
      return points.map(d);
    }
  };

  /**
   * Bezier curve constructor. The constructor argument can be one of three things:
   *
   * 1. array/4 of {x:..., y:..., z:...}, z optional
   * 2. numerical array/8 ordered x1,y1,x2,y2,x3,y3,x4,y4
   * 3. numerical array/12 ordered x1,y1,z1,x2,y2,z2,x3,y3,z3,x4,y4,z4
   *
   */
  var Bezier = function(coords) {
    var args = (coords && coords.forEach ? coords : arguments);
    if(typeof args[0] === "object") {
      args = [];
      for(var i=0; i<coords.length; i++) {
        ['x','y','z'].forEach(function(d) {
          if(typeof coords[i][d] !== "undefined") {
            args.push(coords[i][d]);
          }
        });
      }
    }
    var len = args.length;
    if(len!==6 && len!==8 && len!==9 && len!==12) {
      throw new Error("This Bezier curve library only supports quadratic and cubic curves (in 2d and 3d)");
    }
    var _3d = (len === 9 || len === 12);
    this._3d = _3d;
    var points = [];
    for(var idx=0, step=(_3d ? 3 : 2); idx<len; idx+=step) {
      var point = {
        x: args[idx],
        y: args[idx+1]
      };
      if(_3d) { point.z = args[idx+2] };
      points.push(point);
    }
    this.order = points.length - 1;
    this.points = points;
    var dims = ['x','y'];
    if(_3d) dims.push('z');
    this.dims = dims;
    this.dimlen = dims.length;
    (function(curve) {
      var a = utils.align(points, {p1:points[0], p2:points[curve.order]});
      for(var i=0; i<a.length; i++) {
        if(abs(a[i].y) > 0.0001) {
          curve._linear = false;
          return;
        }
      }
      curve._linear = true;
    }(this));
    this._t1 = 0;
    this._t2 = 1;
    this.update();
  };

  Bezier.utils = utils;

  Bezier.prototype = {
    update: function() {
      // one-time compute derivative coordinates
      this.dpoints = [];
      for(var p=this.points, d=p.length, c=d-1; d>1; d--, c--) {
        var list = [];
        for(var j=0, dpt; j<c; j++) {
          dpt = {
            x: c * (p[j+1].x - p[j].x),
            y: c * (p[j+1].y - p[j].y)
          };
          if(this._3d) {
            dpt.z = c * (p[j+1].z - p[j].z);
          }
          list.push(dpt);
        }
        this.dpoints.push(list);
        p = list;
      };
      this.computedirection();
    },
    computedirection: function() {
      var points = this.points;
      var angle = utils.angle(points[0], points[this.order], points[1]);
      this.clockwise = angle > 0;
    },
    length: function() {
      return utils.length(this.derivative.bind(this));
    },
    get: function(t) {
      return this.compute(t);
    },
    compute: function(t) {
      // shortcuts
      if(t===0) { return this.points[0]; }
      if(t===1) { return this.points[this.order]; }
      // plain computation
      var mt = 1-t,
          mt2 = mt*mt,
          t2 = t*t,
          a,b,c,d = 0,
          p = this.points;
      if(this.order===2) {
        p = [p[0], p[1], p[2], ZERO];
        a = mt2;
        b = mt*t*2;
        c = t2;
      }
      if(this.order===3) {
        a = mt2*mt;
        b = mt2*t*3;
        c = mt*t2*3;
        d = t*t2;
      }
      var ret = {
        x: a*p[0].x + b*p[1].x + c*p[2].x + d*p[3].x,
        y: a*p[0].y + b*p[1].y + c*p[2].y + d*p[3].y
      };
      if(this._3d) {
        ret.z = a*p[0].z + b*p[1].z + c*p[2].z + d*p[3].z;
      }
      return ret;
    },
    derivative: function(t) {
      var mt = 1-t,
          a,b,c=0,
          p = this.dpoints[0];
      if(this.order===2) { p = [p[0], p[1], ZERO]; a = mt; b = t; }
      if(this.order===3) { a = mt*mt; b = mt*t*2; c = t*t; }
      var ret = {
        x: a*p[0].x + b*p[1].x + c*p[2].x,
        y: a*p[0].y + b*p[1].y + c*p[2].y
      };
      if(this._3d) {
        ret.z = a*p[0].z + b*p[1].z + c*p[2].z;
      }
      return ret;
    }
  };

  module.exports = Bezier;

}());


/***/ }),
/* 31 */
/***/ (function(module, exports) {

/* MIT license */

module.exports = {
  rgb2hsl: rgb2hsl,
  rgb2hsv: rgb2hsv,
  rgb2hwb: rgb2hwb,
  rgb2cmyk: rgb2cmyk,
  rgb2keyword: rgb2keyword,
  rgb2xyz: rgb2xyz,
  rgb2lab: rgb2lab,
  rgb2lch: rgb2lch,

  hsl2rgb: hsl2rgb,
  hsl2hsv: hsl2hsv,
  hsl2hwb: hsl2hwb,
  hsl2cmyk: hsl2cmyk,
  hsl2keyword: hsl2keyword,

  hsv2rgb: hsv2rgb,
  hsv2hsl: hsv2hsl,
  hsv2hwb: hsv2hwb,
  hsv2cmyk: hsv2cmyk,
  hsv2keyword: hsv2keyword,

  hwb2rgb: hwb2rgb,
  hwb2hsl: hwb2hsl,
  hwb2hsv: hwb2hsv,
  hwb2cmyk: hwb2cmyk,
  hwb2keyword: hwb2keyword,

  cmyk2rgb: cmyk2rgb,
  cmyk2hsl: cmyk2hsl,
  cmyk2hsv: cmyk2hsv,
  cmyk2hwb: cmyk2hwb,
  cmyk2keyword: cmyk2keyword,

  keyword2rgb: keyword2rgb,
  keyword2hsl: keyword2hsl,
  keyword2hsv: keyword2hsv,
  keyword2hwb: keyword2hwb,
  keyword2cmyk: keyword2cmyk,
  keyword2lab: keyword2lab,
  keyword2xyz: keyword2xyz,

  xyz2rgb: xyz2rgb,
  xyz2lab: xyz2lab,
  xyz2lch: xyz2lch,

  lab2xyz: lab2xyz,
  lab2rgb: lab2rgb,
  lab2lch: lab2lch,

  lch2lab: lch2lab,
  lch2xyz: lch2xyz,
  lch2rgb: lch2rgb
}


function rgb2hsl(rgb) {
  var r = rgb[0]/255,
      g = rgb[1]/255,
      b = rgb[2]/255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, l;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g)/ delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  l = (min + max) / 2;

  if (max == min)
    s = 0;
  else if (l <= 0.5)
    s = delta / (max + min);
  else
    s = delta / (2 - max - min);

  return [h, s * 100, l * 100];
}

function rgb2hsv(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, v;

  if (max == 0)
    s = 0;
  else
    s = (delta/max * 1000)/10;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  v = ((max / 255) * 1000) / 10;

  return [h, s, v];
}

function rgb2hwb(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      h = rgb2hsl(rgb)[0],
      w = 1/255 * Math.min(r, Math.min(g, b)),
      b = 1 - 1/255 * Math.max(r, Math.max(g, b));

  return [h, w * 100, b * 100];
}

function rgb2cmyk(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      c, m, y, k;

  k = Math.min(1 - r, 1 - g, 1 - b);
  c = (1 - r - k) / (1 - k) || 0;
  m = (1 - g - k) / (1 - k) || 0;
  y = (1 - b - k) / (1 - k) || 0;
  return [c * 100, m * 100, y * 100, k * 100];
}

function rgb2keyword(rgb) {
  return reverseKeywords[JSON.stringify(rgb)];
}

function rgb2xyz(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255;

  // assume sRGB
  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return [x * 100, y *100, z * 100];
}

function rgb2lab(rgb) {
  var xyz = rgb2xyz(rgb),
        x = xyz[0],
        y = xyz[1],
        z = xyz[2],
        l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function rgb2lch(args) {
  return lab2lch(rgb2lab(args));
}

function hsl2rgb(hsl) {
  var h = hsl[0] / 360,
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      t1, t2, t3, rgb, val;

  if (s == 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5)
    t2 = l * (1 + s);
  else
    t2 = l + s - l * s;
  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1)
      val = t1 + (t2 - t1) * 6 * t3;
    else if (2 * t3 < 1)
      val = t2;
    else if (3 * t3 < 2)
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    else
      val = t1;

    rgb[i] = val * 255;
  }

  return rgb;
}

function hsl2hsv(hsl) {
  var h = hsl[0],
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      sv, v;

  if(l === 0) {
      // no need to do calc on black
      // also avoids divide by 0 error
      return [0, 0, 0];
  }

  l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  v = (l + s) / 2;
  sv = (2 * s) / (l + s);
  return [h, sv * 100, v * 100];
}

function hsl2hwb(args) {
  return rgb2hwb(hsl2rgb(args));
}

function hsl2cmyk(args) {
  return rgb2cmyk(hsl2rgb(args));
}

function hsl2keyword(args) {
  return rgb2keyword(hsl2rgb(args));
}


function hsv2rgb(hsv) {
  var h = hsv[0] / 60,
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      hi = Math.floor(h) % 6;

  var f = h - Math.floor(h),
      p = 255 * v * (1 - s),
      q = 255 * v * (1 - (s * f)),
      t = 255 * v * (1 - (s * (1 - f))),
      v = 255 * v;

  switch(hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
}

function hsv2hsl(hsv) {
  var h = hsv[0],
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      sl, l;

  l = (2 - s) * v;
  sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  sl = sl || 0;
  l /= 2;
  return [h, sl * 100, l * 100];
}

function hsv2hwb(args) {
  return rgb2hwb(hsv2rgb(args))
}

function hsv2cmyk(args) {
  return rgb2cmyk(hsv2rgb(args));
}

function hsv2keyword(args) {
  return rgb2keyword(hsv2rgb(args));
}

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
function hwb2rgb(hwb) {
  var h = hwb[0] / 360,
      wh = hwb[1] / 100,
      bl = hwb[2] / 100,
      ratio = wh + bl,
      i, v, f, n;

  // wh + bl cant be > 1
  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }

  i = Math.floor(6 * h);
  v = 1 - bl;
  f = 6 * h - i;
  if ((i & 0x01) != 0) {
    f = 1 - f;
  }
  n = wh + f * (v - wh);  // linear interpolation

  switch (i) {
    default:
    case 6:
    case 0: r = v; g = n; b = wh; break;
    case 1: r = n; g = v; b = wh; break;
    case 2: r = wh; g = v; b = n; break;
    case 3: r = wh; g = n; b = v; break;
    case 4: r = n; g = wh; b = v; break;
    case 5: r = v; g = wh; b = n; break;
  }

  return [r * 255, g * 255, b * 255];
}

function hwb2hsl(args) {
  return rgb2hsl(hwb2rgb(args));
}

function hwb2hsv(args) {
  return rgb2hsv(hwb2rgb(args));
}

function hwb2cmyk(args) {
  return rgb2cmyk(hwb2rgb(args));
}

function hwb2keyword(args) {
  return rgb2keyword(hwb2rgb(args));
}

function cmyk2rgb(cmyk) {
  var c = cmyk[0] / 100,
      m = cmyk[1] / 100,
      y = cmyk[2] / 100,
      k = cmyk[3] / 100,
      r, g, b;

  r = 1 - Math.min(1, c * (1 - k) + k);
  g = 1 - Math.min(1, m * (1 - k) + k);
  b = 1 - Math.min(1, y * (1 - k) + k);
  return [r * 255, g * 255, b * 255];
}

function cmyk2hsl(args) {
  return rgb2hsl(cmyk2rgb(args));
}

function cmyk2hsv(args) {
  return rgb2hsv(cmyk2rgb(args));
}

function cmyk2hwb(args) {
  return rgb2hwb(cmyk2rgb(args));
}

function cmyk2keyword(args) {
  return rgb2keyword(cmyk2rgb(args));
}


function xyz2rgb(xyz) {
  var x = xyz[0] / 100,
      y = xyz[1] / 100,
      z = xyz[2] / 100,
      r, g, b;

  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  // assume sRGB
  r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
    : r = (r * 12.92);

  g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
    : g = (g * 12.92);

  b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
    : b = (b * 12.92);

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return [r * 255, g * 255, b * 255];
}

function xyz2lab(xyz) {
  var x = xyz[0],
      y = xyz[1],
      z = xyz[2],
      l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function xyz2lch(args) {
  return lab2lch(xyz2lab(args));
}

function lab2xyz(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      x, y, z, y2;

  if (l <= 8) {
    y = (l * 100) / 903.3;
    y2 = (7.787 * (y / 100)) + (16 / 116);
  } else {
    y = 100 * Math.pow((l + 16) / 116, 3);
    y2 = Math.pow(y / 100, 1/3);
  }

  x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

  z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

  return [x, y, z];
}

function lab2lch(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      hr, h, c;

  hr = Math.atan2(b, a);
  h = hr * 360 / 2 / Math.PI;
  if (h < 0) {
    h += 360;
  }
  c = Math.sqrt(a * a + b * b);
  return [l, c, h];
}

function lab2rgb(args) {
  return xyz2rgb(lab2xyz(args));
}

function lch2lab(lch) {
  var l = lch[0],
      c = lch[1],
      h = lch[2],
      a, b, hr;

  hr = h / 360 * 2 * Math.PI;
  a = c * Math.cos(hr);
  b = c * Math.sin(hr);
  return [l, a, b];
}

function lch2xyz(args) {
  return lab2xyz(lch2lab(args));
}

function lch2rgb(args) {
  return lab2rgb(lch2lab(args));
}

function keyword2rgb(keyword) {
  return cssKeywords[keyword];
}

function keyword2hsl(args) {
  return rgb2hsl(keyword2rgb(args));
}

function keyword2hsv(args) {
  return rgb2hsv(keyword2rgb(args));
}

function keyword2hwb(args) {
  return rgb2hwb(keyword2rgb(args));
}

function keyword2cmyk(args) {
  return rgb2cmyk(keyword2rgb(args));
}

function keyword2lab(args) {
  return rgb2lab(keyword2rgb(args));
}

function keyword2xyz(args) {
  return rgb2xyz(keyword2rgb(args));
}

var cssKeywords = {
  aliceblue:  [240,248,255],
  antiquewhite: [250,235,215],
  aqua: [0,255,255],
  aquamarine: [127,255,212],
  azure:  [240,255,255],
  beige:  [245,245,220],
  bisque: [255,228,196],
  black:  [0,0,0],
  blanchedalmond: [255,235,205],
  blue: [0,0,255],
  blueviolet: [138,43,226],
  brown:  [165,42,42],
  burlywood:  [222,184,135],
  cadetblue:  [95,158,160],
  chartreuse: [127,255,0],
  chocolate:  [210,105,30],
  coral:  [255,127,80],
  cornflowerblue: [100,149,237],
  cornsilk: [255,248,220],
  crimson:  [220,20,60],
  cyan: [0,255,255],
  darkblue: [0,0,139],
  darkcyan: [0,139,139],
  darkgoldenrod:  [184,134,11],
  darkgray: [169,169,169],
  darkgreen:  [0,100,0],
  darkgrey: [169,169,169],
  darkkhaki:  [189,183,107],
  darkmagenta:  [139,0,139],
  darkolivegreen: [85,107,47],
  darkorange: [255,140,0],
  darkorchid: [153,50,204],
  darkred:  [139,0,0],
  darksalmon: [233,150,122],
  darkseagreen: [143,188,143],
  darkslateblue:  [72,61,139],
  darkslategray:  [47,79,79],
  darkslategrey:  [47,79,79],
  darkturquoise:  [0,206,209],
  darkviolet: [148,0,211],
  deeppink: [255,20,147],
  deepskyblue:  [0,191,255],
  dimgray:  [105,105,105],
  dimgrey:  [105,105,105],
  dodgerblue: [30,144,255],
  firebrick:  [178,34,34],
  floralwhite:  [255,250,240],
  forestgreen:  [34,139,34],
  fuchsia:  [255,0,255],
  gainsboro:  [220,220,220],
  ghostwhite: [248,248,255],
  gold: [255,215,0],
  goldenrod:  [218,165,32],
  gray: [128,128,128],
  green:  [0,128,0],
  greenyellow:  [173,255,47],
  grey: [128,128,128],
  honeydew: [240,255,240],
  hotpink:  [255,105,180],
  indianred:  [205,92,92],
  indigo: [75,0,130],
  ivory:  [255,255,240],
  khaki:  [240,230,140],
  lavender: [230,230,250],
  lavenderblush:  [255,240,245],
  lawngreen:  [124,252,0],
  lemonchiffon: [255,250,205],
  lightblue:  [173,216,230],
  lightcoral: [240,128,128],
  lightcyan:  [224,255,255],
  lightgoldenrodyellow: [250,250,210],
  lightgray:  [211,211,211],
  lightgreen: [144,238,144],
  lightgrey:  [211,211,211],
  lightpink:  [255,182,193],
  lightsalmon:  [255,160,122],
  lightseagreen:  [32,178,170],
  lightskyblue: [135,206,250],
  lightslategray: [119,136,153],
  lightslategrey: [119,136,153],
  lightsteelblue: [176,196,222],
  lightyellow:  [255,255,224],
  lime: [0,255,0],
  limegreen:  [50,205,50],
  linen:  [250,240,230],
  magenta:  [255,0,255],
  maroon: [128,0,0],
  mediumaquamarine: [102,205,170],
  mediumblue: [0,0,205],
  mediumorchid: [186,85,211],
  mediumpurple: [147,112,219],
  mediumseagreen: [60,179,113],
  mediumslateblue:  [123,104,238],
  mediumspringgreen:  [0,250,154],
  mediumturquoise:  [72,209,204],
  mediumvioletred:  [199,21,133],
  midnightblue: [25,25,112],
  mintcream:  [245,255,250],
  mistyrose:  [255,228,225],
  moccasin: [255,228,181],
  navajowhite:  [255,222,173],
  navy: [0,0,128],
  oldlace:  [253,245,230],
  olive:  [128,128,0],
  olivedrab:  [107,142,35],
  orange: [255,165,0],
  orangered:  [255,69,0],
  orchid: [218,112,214],
  palegoldenrod:  [238,232,170],
  palegreen:  [152,251,152],
  paleturquoise:  [175,238,238],
  palevioletred:  [219,112,147],
  papayawhip: [255,239,213],
  peachpuff:  [255,218,185],
  peru: [205,133,63],
  pink: [255,192,203],
  plum: [221,160,221],
  powderblue: [176,224,230],
  purple: [128,0,128],
  rebeccapurple: [102, 51, 153],
  red:  [255,0,0],
  rosybrown:  [188,143,143],
  royalblue:  [65,105,225],
  saddlebrown:  [139,69,19],
  salmon: [250,128,114],
  sandybrown: [244,164,96],
  seagreen: [46,139,87],
  seashell: [255,245,238],
  sienna: [160,82,45],
  silver: [192,192,192],
  skyblue:  [135,206,235],
  slateblue:  [106,90,205],
  slategray:  [112,128,144],
  slategrey:  [112,128,144],
  snow: [255,250,250],
  springgreen:  [0,255,127],
  steelblue:  [70,130,180],
  tan:  [210,180,140],
  teal: [0,128,128],
  thistle:  [216,191,216],
  tomato: [255,99,71],
  turquoise:  [64,224,208],
  violet: [238,130,238],
  wheat:  [245,222,179],
  white:  [255,255,255],
  whitesmoke: [245,245,245],
  yellow: [255,255,0],
  yellowgreen:  [154,205,50]
};

var reverseKeywords = {};
for (var key in cssKeywords) {
  reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
}


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var convert = __webpack_require__(17);

module.exports = function (cstr) {
    var m, conv, parts, alpha;
    if (m = /^((?:rgb|hs[lv]|cmyk|xyz|lab)a?)\s*\(([^\)]*)\)/.exec(cstr)) {
        var name = m[1];
        var base = name.replace(/a$/, '');
        var size = base === 'cmyk' ? 4 : 3;
        conv = convert[base];
        
        parts = m[2].replace(/^\s+|\s+$/g, '')
            .split(/\s*,\s*/)
            .map(function (x, i) {
                if (/%$/.test(x) && i === size) {
                    return parseFloat(x) / 100;
                }
                else if (/%$/.test(x)) {
                    return parseFloat(x);
                }
                return parseFloat(x);
            })
        ;
        if (name === base) parts.push(1);
        alpha = parts[size] === undefined ? 1 : parts[size];
        parts = parts.slice(0, size);
        
        conv[base] = function () { return parts };
    }
    else if (/^#[A-Fa-f0-9]+$/.test(cstr)) {
        var base = cstr.replace(/^#/,'');
        var size = base.length;
        conv = convert.rgb;
        parts = base.split(size === 3 ? /(.)/ : /(..)/);
        parts = parts.filter(Boolean)
            .map(function (x) {
                if (size === 3) {
                    return parseInt(x + x, 16);
                }
                else {
                    return parseInt(x, 16)
                }
            })
        ;
        alpha = 1;
        conv.rgb = function () { return parts };
        if (!parts[0]) parts[0] = 0;
        if (!parts[1]) parts[1] = 0;
        if (!parts[2]) parts[2] = 0;
    }
    else {
        conv = convert.keyword;
        conv.keyword = function () { return cstr };
        parts = cstr;
        alpha = 1;
    }
    
    var res = {
        rgb: undefined,
        hsl: undefined,
        hsv: undefined,
        cmyk: undefined,
        keyword: undefined,
        hex: undefined
    };
    try { res.rgb = conv.rgb(parts) } catch (e) {}
    try { res.hsl = conv.hsl(parts) } catch (e) {}
    try { res.hsv = conv.hsv(parts) } catch (e) {}
    try { res.cmyk = conv.cmyk(parts) } catch (e) {}
    try { res.keyword = conv.keyword(parts) } catch (e) {}
    
    if (res.rgb) res.hex = '#' + res.rgb.map(function (x) {
        var s = x.toString(16);
        if (s.length === 1) return '0' + s;
        return s;
    }).join('');
    
    if (res.rgb) res.rgba = res.rgb.concat(alpha);
    if (res.hsl) res.hsla = res.hsl.concat(alpha);
    if (res.hsv) res.hsva = res.hsv.concat(alpha);
    if (res.cmyk) res.cmyka = res.cmyk.concat(alpha);
    
    return res;
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(7)
var isVNode = __webpack_require__(8)
var isWidget = __webpack_require__(6)
var isThunk = __webpack_require__(10)
var isVHook = __webpack_require__(11)

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(7)

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var split = __webpack_require__(36);

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}


/***/ }),
/* 36 */
/***/ (function(module, exports) {

/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EvStore = __webpack_require__(39);

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var OneVersionConstraint = __webpack_require__(40);

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Individual = __webpack_require__(41);

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20)))

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DEFAULT_NAMESPACE = null;
var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

// http://www.w3.org/TR/SVGTiny12/attributeTable.html
// http://www.w3.org/TR/SVG/attindex.html
var SVG_PROPERTIES = {
    'about': DEFAULT_NAMESPACE,
    'accent-height': DEFAULT_NAMESPACE,
    'accumulate': DEFAULT_NAMESPACE,
    'additive': DEFAULT_NAMESPACE,
    'alignment-baseline': DEFAULT_NAMESPACE,
    'alphabetic': DEFAULT_NAMESPACE,
    'amplitude': DEFAULT_NAMESPACE,
    'arabic-form': DEFAULT_NAMESPACE,
    'ascent': DEFAULT_NAMESPACE,
    'attributeName': DEFAULT_NAMESPACE,
    'attributeType': DEFAULT_NAMESPACE,
    'azimuth': DEFAULT_NAMESPACE,
    'bandwidth': DEFAULT_NAMESPACE,
    'baseFrequency': DEFAULT_NAMESPACE,
    'baseProfile': DEFAULT_NAMESPACE,
    'baseline-shift': DEFAULT_NAMESPACE,
    'bbox': DEFAULT_NAMESPACE,
    'begin': DEFAULT_NAMESPACE,
    'bias': DEFAULT_NAMESPACE,
    'by': DEFAULT_NAMESPACE,
    'calcMode': DEFAULT_NAMESPACE,
    'cap-height': DEFAULT_NAMESPACE,
    'class': DEFAULT_NAMESPACE,
    'clip': DEFAULT_NAMESPACE,
    'clip-path': DEFAULT_NAMESPACE,
    'clip-rule': DEFAULT_NAMESPACE,
    'clipPathUnits': DEFAULT_NAMESPACE,
    'color': DEFAULT_NAMESPACE,
    'color-interpolation': DEFAULT_NAMESPACE,
    'color-interpolation-filters': DEFAULT_NAMESPACE,
    'color-profile': DEFAULT_NAMESPACE,
    'color-rendering': DEFAULT_NAMESPACE,
    'content': DEFAULT_NAMESPACE,
    'contentScriptType': DEFAULT_NAMESPACE,
    'contentStyleType': DEFAULT_NAMESPACE,
    'cursor': DEFAULT_NAMESPACE,
    'cx': DEFAULT_NAMESPACE,
    'cy': DEFAULT_NAMESPACE,
    'd': DEFAULT_NAMESPACE,
    'datatype': DEFAULT_NAMESPACE,
    'defaultAction': DEFAULT_NAMESPACE,
    'descent': DEFAULT_NAMESPACE,
    'diffuseConstant': DEFAULT_NAMESPACE,
    'direction': DEFAULT_NAMESPACE,
    'display': DEFAULT_NAMESPACE,
    'divisor': DEFAULT_NAMESPACE,
    'dominant-baseline': DEFAULT_NAMESPACE,
    'dur': DEFAULT_NAMESPACE,
    'dx': DEFAULT_NAMESPACE,
    'dy': DEFAULT_NAMESPACE,
    'edgeMode': DEFAULT_NAMESPACE,
    'editable': DEFAULT_NAMESPACE,
    'elevation': DEFAULT_NAMESPACE,
    'enable-background': DEFAULT_NAMESPACE,
    'end': DEFAULT_NAMESPACE,
    'ev:event': EV_NAMESPACE,
    'event': DEFAULT_NAMESPACE,
    'exponent': DEFAULT_NAMESPACE,
    'externalResourcesRequired': DEFAULT_NAMESPACE,
    'fill': DEFAULT_NAMESPACE,
    'fill-opacity': DEFAULT_NAMESPACE,
    'fill-rule': DEFAULT_NAMESPACE,
    'filter': DEFAULT_NAMESPACE,
    'filterRes': DEFAULT_NAMESPACE,
    'filterUnits': DEFAULT_NAMESPACE,
    'flood-color': DEFAULT_NAMESPACE,
    'flood-opacity': DEFAULT_NAMESPACE,
    'focusHighlight': DEFAULT_NAMESPACE,
    'focusable': DEFAULT_NAMESPACE,
    'font-family': DEFAULT_NAMESPACE,
    'font-size': DEFAULT_NAMESPACE,
    'font-size-adjust': DEFAULT_NAMESPACE,
    'font-stretch': DEFAULT_NAMESPACE,
    'font-style': DEFAULT_NAMESPACE,
    'font-variant': DEFAULT_NAMESPACE,
    'font-weight': DEFAULT_NAMESPACE,
    'format': DEFAULT_NAMESPACE,
    'from': DEFAULT_NAMESPACE,
    'fx': DEFAULT_NAMESPACE,
    'fy': DEFAULT_NAMESPACE,
    'g1': DEFAULT_NAMESPACE,
    'g2': DEFAULT_NAMESPACE,
    'glyph-name': DEFAULT_NAMESPACE,
    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
    'glyphRef': DEFAULT_NAMESPACE,
    'gradientTransform': DEFAULT_NAMESPACE,
    'gradientUnits': DEFAULT_NAMESPACE,
    'handler': DEFAULT_NAMESPACE,
    'hanging': DEFAULT_NAMESPACE,
    'height': DEFAULT_NAMESPACE,
    'horiz-adv-x': DEFAULT_NAMESPACE,
    'horiz-origin-x': DEFAULT_NAMESPACE,
    'horiz-origin-y': DEFAULT_NAMESPACE,
    'id': DEFAULT_NAMESPACE,
    'ideographic': DEFAULT_NAMESPACE,
    'image-rendering': DEFAULT_NAMESPACE,
    'in': DEFAULT_NAMESPACE,
    'in2': DEFAULT_NAMESPACE,
    'initialVisibility': DEFAULT_NAMESPACE,
    'intercept': DEFAULT_NAMESPACE,
    'k': DEFAULT_NAMESPACE,
    'k1': DEFAULT_NAMESPACE,
    'k2': DEFAULT_NAMESPACE,
    'k3': DEFAULT_NAMESPACE,
    'k4': DEFAULT_NAMESPACE,
    'kernelMatrix': DEFAULT_NAMESPACE,
    'kernelUnitLength': DEFAULT_NAMESPACE,
    'kerning': DEFAULT_NAMESPACE,
    'keyPoints': DEFAULT_NAMESPACE,
    'keySplines': DEFAULT_NAMESPACE,
    'keyTimes': DEFAULT_NAMESPACE,
    'lang': DEFAULT_NAMESPACE,
    'lengthAdjust': DEFAULT_NAMESPACE,
    'letter-spacing': DEFAULT_NAMESPACE,
    'lighting-color': DEFAULT_NAMESPACE,
    'limitingConeAngle': DEFAULT_NAMESPACE,
    'local': DEFAULT_NAMESPACE,
    'marker-end': DEFAULT_NAMESPACE,
    'marker-mid': DEFAULT_NAMESPACE,
    'marker-start': DEFAULT_NAMESPACE,
    'markerHeight': DEFAULT_NAMESPACE,
    'markerUnits': DEFAULT_NAMESPACE,
    'markerWidth': DEFAULT_NAMESPACE,
    'mask': DEFAULT_NAMESPACE,
    'maskContentUnits': DEFAULT_NAMESPACE,
    'maskUnits': DEFAULT_NAMESPACE,
    'mathematical': DEFAULT_NAMESPACE,
    'max': DEFAULT_NAMESPACE,
    'media': DEFAULT_NAMESPACE,
    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
    'mediaContentEncodings': DEFAULT_NAMESPACE,
    'mediaSize': DEFAULT_NAMESPACE,
    'mediaTime': DEFAULT_NAMESPACE,
    'method': DEFAULT_NAMESPACE,
    'min': DEFAULT_NAMESPACE,
    'mode': DEFAULT_NAMESPACE,
    'name': DEFAULT_NAMESPACE,
    'nav-down': DEFAULT_NAMESPACE,
    'nav-down-left': DEFAULT_NAMESPACE,
    'nav-down-right': DEFAULT_NAMESPACE,
    'nav-left': DEFAULT_NAMESPACE,
    'nav-next': DEFAULT_NAMESPACE,
    'nav-prev': DEFAULT_NAMESPACE,
    'nav-right': DEFAULT_NAMESPACE,
    'nav-up': DEFAULT_NAMESPACE,
    'nav-up-left': DEFAULT_NAMESPACE,
    'nav-up-right': DEFAULT_NAMESPACE,
    'numOctaves': DEFAULT_NAMESPACE,
    'observer': DEFAULT_NAMESPACE,
    'offset': DEFAULT_NAMESPACE,
    'opacity': DEFAULT_NAMESPACE,
    'operator': DEFAULT_NAMESPACE,
    'order': DEFAULT_NAMESPACE,
    'orient': DEFAULT_NAMESPACE,
    'orientation': DEFAULT_NAMESPACE,
    'origin': DEFAULT_NAMESPACE,
    'overflow': DEFAULT_NAMESPACE,
    'overlay': DEFAULT_NAMESPACE,
    'overline-position': DEFAULT_NAMESPACE,
    'overline-thickness': DEFAULT_NAMESPACE,
    'panose-1': DEFAULT_NAMESPACE,
    'path': DEFAULT_NAMESPACE,
    'pathLength': DEFAULT_NAMESPACE,
    'patternContentUnits': DEFAULT_NAMESPACE,
    'patternTransform': DEFAULT_NAMESPACE,
    'patternUnits': DEFAULT_NAMESPACE,
    'phase': DEFAULT_NAMESPACE,
    'playbackOrder': DEFAULT_NAMESPACE,
    'pointer-events': DEFAULT_NAMESPACE,
    'points': DEFAULT_NAMESPACE,
    'pointsAtX': DEFAULT_NAMESPACE,
    'pointsAtY': DEFAULT_NAMESPACE,
    'pointsAtZ': DEFAULT_NAMESPACE,
    'preserveAlpha': DEFAULT_NAMESPACE,
    'preserveAspectRatio': DEFAULT_NAMESPACE,
    'primitiveUnits': DEFAULT_NAMESPACE,
    'propagate': DEFAULT_NAMESPACE,
    'property': DEFAULT_NAMESPACE,
    'r': DEFAULT_NAMESPACE,
    'radius': DEFAULT_NAMESPACE,
    'refX': DEFAULT_NAMESPACE,
    'refY': DEFAULT_NAMESPACE,
    'rel': DEFAULT_NAMESPACE,
    'rendering-intent': DEFAULT_NAMESPACE,
    'repeatCount': DEFAULT_NAMESPACE,
    'repeatDur': DEFAULT_NAMESPACE,
    'requiredExtensions': DEFAULT_NAMESPACE,
    'requiredFeatures': DEFAULT_NAMESPACE,
    'requiredFonts': DEFAULT_NAMESPACE,
    'requiredFormats': DEFAULT_NAMESPACE,
    'resource': DEFAULT_NAMESPACE,
    'restart': DEFAULT_NAMESPACE,
    'result': DEFAULT_NAMESPACE,
    'rev': DEFAULT_NAMESPACE,
    'role': DEFAULT_NAMESPACE,
    'rotate': DEFAULT_NAMESPACE,
    'rx': DEFAULT_NAMESPACE,
    'ry': DEFAULT_NAMESPACE,
    'scale': DEFAULT_NAMESPACE,
    'seed': DEFAULT_NAMESPACE,
    'shape-rendering': DEFAULT_NAMESPACE,
    'slope': DEFAULT_NAMESPACE,
    'snapshotTime': DEFAULT_NAMESPACE,
    'spacing': DEFAULT_NAMESPACE,
    'specularConstant': DEFAULT_NAMESPACE,
    'specularExponent': DEFAULT_NAMESPACE,
    'spreadMethod': DEFAULT_NAMESPACE,
    'startOffset': DEFAULT_NAMESPACE,
    'stdDeviation': DEFAULT_NAMESPACE,
    'stemh': DEFAULT_NAMESPACE,
    'stemv': DEFAULT_NAMESPACE,
    'stitchTiles': DEFAULT_NAMESPACE,
    'stop-color': DEFAULT_NAMESPACE,
    'stop-opacity': DEFAULT_NAMESPACE,
    'strikethrough-position': DEFAULT_NAMESPACE,
    'strikethrough-thickness': DEFAULT_NAMESPACE,
    'string': DEFAULT_NAMESPACE,
    'stroke': DEFAULT_NAMESPACE,
    'stroke-dasharray': DEFAULT_NAMESPACE,
    'stroke-dashoffset': DEFAULT_NAMESPACE,
    'stroke-linecap': DEFAULT_NAMESPACE,
    'stroke-linejoin': DEFAULT_NAMESPACE,
    'stroke-miterlimit': DEFAULT_NAMESPACE,
    'stroke-opacity': DEFAULT_NAMESPACE,
    'stroke-width': DEFAULT_NAMESPACE,
    'surfaceScale': DEFAULT_NAMESPACE,
    'syncBehavior': DEFAULT_NAMESPACE,
    'syncBehaviorDefault': DEFAULT_NAMESPACE,
    'syncMaster': DEFAULT_NAMESPACE,
    'syncTolerance': DEFAULT_NAMESPACE,
    'syncToleranceDefault': DEFAULT_NAMESPACE,
    'systemLanguage': DEFAULT_NAMESPACE,
    'tableValues': DEFAULT_NAMESPACE,
    'target': DEFAULT_NAMESPACE,
    'targetX': DEFAULT_NAMESPACE,
    'targetY': DEFAULT_NAMESPACE,
    'text-anchor': DEFAULT_NAMESPACE,
    'text-decoration': DEFAULT_NAMESPACE,
    'text-rendering': DEFAULT_NAMESPACE,
    'textLength': DEFAULT_NAMESPACE,
    'timelineBegin': DEFAULT_NAMESPACE,
    'title': DEFAULT_NAMESPACE,
    'to': DEFAULT_NAMESPACE,
    'transform': DEFAULT_NAMESPACE,
    'transformBehavior': DEFAULT_NAMESPACE,
    'type': DEFAULT_NAMESPACE,
    'typeof': DEFAULT_NAMESPACE,
    'u1': DEFAULT_NAMESPACE,
    'u2': DEFAULT_NAMESPACE,
    'underline-position': DEFAULT_NAMESPACE,
    'underline-thickness': DEFAULT_NAMESPACE,
    'unicode': DEFAULT_NAMESPACE,
    'unicode-bidi': DEFAULT_NAMESPACE,
    'unicode-range': DEFAULT_NAMESPACE,
    'units-per-em': DEFAULT_NAMESPACE,
    'v-alphabetic': DEFAULT_NAMESPACE,
    'v-hanging': DEFAULT_NAMESPACE,
    'v-ideographic': DEFAULT_NAMESPACE,
    'v-mathematical': DEFAULT_NAMESPACE,
    'values': DEFAULT_NAMESPACE,
    'version': DEFAULT_NAMESPACE,
    'vert-adv-y': DEFAULT_NAMESPACE,
    'vert-origin-x': DEFAULT_NAMESPACE,
    'vert-origin-y': DEFAULT_NAMESPACE,
    'viewBox': DEFAULT_NAMESPACE,
    'viewTarget': DEFAULT_NAMESPACE,
    'visibility': DEFAULT_NAMESPACE,
    'width': DEFAULT_NAMESPACE,
    'widths': DEFAULT_NAMESPACE,
    'word-spacing': DEFAULT_NAMESPACE,
    'writing-mode': DEFAULT_NAMESPACE,
    'x': DEFAULT_NAMESPACE,
    'x-height': DEFAULT_NAMESPACE,
    'x1': DEFAULT_NAMESPACE,
    'x2': DEFAULT_NAMESPACE,
    'xChannelSelector': DEFAULT_NAMESPACE,
    'xlink:actuate': XLINK_NAMESPACE,
    'xlink:arcrole': XLINK_NAMESPACE,
    'xlink:href': XLINK_NAMESPACE,
    'xlink:role': XLINK_NAMESPACE,
    'xlink:show': XLINK_NAMESPACE,
    'xlink:title': XLINK_NAMESPACE,
    'xlink:type': XLINK_NAMESPACE,
    'xml:base': XML_NAMESPACE,
    'xml:id': XML_NAMESPACE,
    'xml:lang': XML_NAMESPACE,
    'xml:space': XML_NAMESPACE,
    'y': DEFAULT_NAMESPACE,
    'y1': DEFAULT_NAMESPACE,
    'y2': DEFAULT_NAMESPACE,
    'yChannelSelector': DEFAULT_NAMESPACE,
    'z': DEFAULT_NAMESPACE,
    'zoomAndPan': DEFAULT_NAMESPACE
};

module.exports = SVGAttributeNamespace;

function SVGAttributeNamespace(value) {
  if (SVG_PROPERTIES.hasOwnProperty(value)) {
    return SVG_PROPERTIES[value];
  }
}


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var assign = __webpack_require__(2);
var utils = __webpack_require__(0);
var Shape = __webpack_require__(3);
var Parent = __webpack_require__(21);
var Group = __webpack_require__(18);
var svg = __webpack_require__(1);

var Grid = function(options) {
  this.shape();
  this.setupParent();

  var req = assign(
    {
      x: 0,
      y: 0,
      columns: 10,
      rows: 1,
      gutterWidth: 0,
      gutterHeight: 0,
      moduleWidth: 50,
      moduleHeight: 500
    },
    options
  );

  // if gutter is set, override gutterWidth and gutterHeight
  if (typeof req.gutter !== 'undefined') {
    req.gutterWidth = req.gutter;
    req.gutterHeight = req.gutter;
  }

  // if width is set, override moduleWidth
  if (typeof req.width !== 'undefined') {
    req.moduleWidth =
      (req.width - (req.columns - 1) * req.gutterWidth) / req.columns;
  } else {
    req.width =
      req.moduleWidth * req.columns + req.gutterWidth * (req.columns - 1);
  }

  // if height is set, override moduleWidth
  if (typeof req.height !== 'undefined') {
    req.moduleHeight =
      (req.height - (req.rows - 1) * req.gutterHeight) / req.rows;
  } else {
    req.height =
      req.moduleHeight * req.rows + req.gutterHeight * (req.rows - 1);
  }

  assign(this.state, req);

  this.computeGrid();
};

Grid.prototype = {
  add: function(child, column, row) {
    if (!column) column = 1;
    if (!row) row = 1;

    // index is x + (y * width)
    var index = column - 1 + (row - 1) * this.state.columns;

    if (this.children[index]) {
      this.children[index].add(child);
    } else {
      throw new Error('Column or row does not exist');
    }
  },

  getModule: function(column, row) {
    // index is x + (y * width)
    var index = column - 1 + (row - 1) * this.state.columns;
    if (this.children[index]) return this.children[index];
    else return undefined;
  },

  computeGrid: function() {
    for (var y = 0; y < this.state.rows; y++) {
      for (var x = 0; x < this.state.columns; x++) {
        var groupX = x * this.state.moduleWidth + x * this.state.gutterWidth;
        var groupY = y * this.state.moduleHeight + y * this.state.gutterHeight;
        this.addChild(new Group(groupX, groupY));
      }
    }
  },

  render: function(opts) {
    if (!this.children || this.children.length == 0) return;
    var attr = this.shapeAttributes({});
    var groups = this.renderChildren(opts);
    if (opts.debug) groups = groups.concat(this.renderDebug());
    return svg('g', attr, utils.flatten(groups, true));
  },

  renderDebug: function() {
    var els = [];

    // draw container rect
    els.push(this.debugRect(0, 0, this.state.width, this.state.height));

    // draw lines for columns
    var x = 0;
    for (var i = 0; i < this.state.columns - 1; i++) {
      x += this.state.moduleWidth;
      els.push(this.debugLine(x, 0, x, this.state.height));
      x += this.state.gutterWidth;
      els.push(this.debugLine(x, 0, x, this.state.height));
    }

    // draw lines for rows
    var y = 0;
    for (var i = 0; i < this.state.rows - 1; i++) {
      y += this.state.moduleHeight;
      els.push(this.debugLine(0, y, this.state.width, y));
      y += this.state.gutterHeight;
      els.push(this.debugLine(0, y, this.state.width, y));
    }

    return els;
  }
};

assign(Grid.prototype, Shape, Parent, { type: 'grid' });

module.exports = Grid;


/***/ }),
/* 45 */
/***/ (function(module, exports) {

var Events = {

  on: function(name, callback) {
    if (!this._events) this._events = {};
    this._events[name] = this._events[name] || [];
    this._events[name].push(callback);
    return this;
  },

  off: function(name, callback) {
    if (this._events[name] && !callback) {
      delete this._events[name];
    } else if (this._events[name]) {
      name = this._events[name];
      var i = name.length;
      while (i--) if (name[i] === callback) name.splice(i - 1, 1);
    } else if (arguments.length === 0) {
      this._events = {};
    }
    return this;
  },

  trigger: function(name) {
    if (this._events && this._events[name]) {
      var theseEvents = this._events[name];
      var args = (arguments.length > 1) ? [arguments[1]] : [];
      var i = theseEvents.length;
      while (i--) {
        theseEvents[i].apply(this, args);
      }
    }
    return this;
  }

}

module.exports = Events;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var assign = __webpack_require__(2);
var Shape = __webpack_require__(3);
var Styles = __webpack_require__(4);
var Ellipse = __webpack_require__(22);
var Utils = __webpack_require__(0);
var svg = __webpack_require__(1);

var Circle = function(x, y, radius) {
  this.shape();
  this.styles();
  this.state.x = x;
  this.state.y = y;
  this.state.radius = radius;
};

Circle.prototype = {
  toPolygon: function(opts, parent) {
    var ellipse = new Ellipse(
      this.state.x,
      this.state.y,
      this.state.radius * 2,
      this.state.radius * 2
    );
    var poly = ellipse.toPolygon(opts, false);
    Utils.copyMixinVars(this, poly);
    Utils.groupLogic(poly, this.parent, parent);
    return poly;
  },

  radius: function(radius, relative) {
    this.state.radius = relative ? this.state.radius + radius : radius;
    this.changed();
    return this;
  },

  scale: function(scalar) {
    this.scaleStyles(scalar);
    this.state.radius *= scalar;
    this.changed();
    return this;
  },

  copy: function(parent) {
    var copy = new Circle();
    copy.state.radius = this.state.radius;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  render: function(opts) {
    var attr = {
      cx: Utils.s(this.state.x),
      cy: Utils.s(this.state.y),
      r: Utils.s(this.state.radius)
    };
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('circle', attr);
  }
};

assign(Circle.prototype, Shape, Styles, { type: 'circle' });

module.exports = Circle;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var assign = __webpack_require__(2);
var Shape = __webpack_require__(3);
var Styles = __webpack_require__(4);
var Vector = __webpack_require__(5);
var Utils = __webpack_require__(0);
var svg = __webpack_require__(1);

var Line = function(x, y, x2, y2) {
  this.shape();
  this.styles();
  this.state.x = x;
  this.state.y = y;
  this.state.x2 = x2;
  this.state.y2 = y2;
}

assign(Line.prototype, Shape, Styles, {

  type: "line",

  start: function(x, y, rel) {
    this.state.x = rel ? this.state.x + x : x;
    this.state.y = rel ? this.state.y + y : y;
    this.changed();
    return this;
  },

  end: function(x, y, rel) {
    this.state.x2 = rel ? this.state.x2 + x : x;
    this.state.y2 = rel ? this.state.y2 + y : y;
    this.changed();
    return this;
  },

  copy: function(parent) {
    var copy = new Line();
    copy.state.x2 = this.state.x2;
    copy.state.y2 = this.state.y2;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  scale: function(scalar) {
    this.scaleStyles(scalar);
    var start = new Vector(this.state.x, this.state.y)
    var end = new Vector(this.state.x2, this.state.y2)
    var vec = end.sub(start).multiply(scalar).add(start);
    this.state.x2 = vec.x;
    this.state.y2 = vec.y;
    this.changed();
    return this;
  },

  move: function(x, y, relative) {
    var change = new Vector(this.state.x2, this.state.y2).sub(new Vector(this.state.x, this.state.y));
    this.state.x = relative ? this.state.x + x : x;
    this.state.y = relative ? this.state.y + y : y;
    this.state.x2 = this.state.x + change.x;
    this.state.y2 = this.state.y + change.y;
    this.changed();
    return this;
  },

  render: function(opts) {
    var attr = {
      x1: Utils.s(this.state.x),
      y1: Utils.s(this.state.y),
      x2: Utils.s(this.state.x2),
      y2: Utils.s(this.state.y2)
    }
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('line', attr);
  }

});

module.exports = Line;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var assign = __webpack_require__(2);
var Shape = __webpack_require__(3);
var Styles = __webpack_require__(4);
var Utils = __webpack_require__(0);
var svg = __webpack_require__(1);

var Triangle = function(x, y, x2, y2, x3, y3) {
  this.shape();
  this.styles();
  this.state.x = x;
  this.state.y = y;

  // Make variables relative to 0,0 as
  // x,y will be used in transform
  this.state.x2 = x2 - x;
  this.state.y2 = y2 - y;
  this.state.x3 = x3 - x;
  this.state.y3 = y3 - y;
}

Triangle.prototype = {

  copy: function(parent) {
    var copy = new Triangle();
    copy.state.x2 = this.state.x2;
    copy.state.y2 = this.state.y2;
    copy.state.x3 = this.state.x3;
    copy.state.y3 = this.state.y3;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  scale: function(scalar) {
    this.scaleStyles(scalar);
    this.state.x2 *= scalar;
    this.state.y2 *= scalar;
    this.state.x3 *= scalar;
    this.state.y3 *= scalar;
    this.changed();
    return this;
  },

  render: function(opts) {
    var attr = {
      points: '0 0 ' + this.state.x2 + ' ' + this.state.y2 + ' ' + this.state.x3 + ' ' + this.state.y3
    };
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('polygon', attr);
  }

}

assign(Triangle.prototype, Shape, Styles, {type: "triangle"});

module.exports = Triangle;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var assign = __webpack_require__(2);
var Shape = __webpack_require__(3);
var Styles = __webpack_require__(4);
var Anchor = __webpack_require__(15);
var Vector = __webpack_require__(5);
var Polygon = __webpack_require__(14);
var Utils = __webpack_require__(0);
var svg = __webpack_require__(1);

var Path = function(x, y) {
  this.shape();
  this.styles();
  this.state.anchors = [];
  if (typeof x !== 'undefined') this.state.x = x;
  if (typeof y !== 'undefined') this.state.y = y;
};

Path.prototype = {
  moveTo: function(x, y) {
    this.state.anchors.push(new Anchor().setMove(x, y));
    this.changed();
    return this;
  },

  lineTo: function(x, y) {
    this.checkStartMove();
    this.state.anchors.push(new Anchor().setLine(x, y));
    this.changed();
    return this;
  },

  curveTo: function(a, b, c, d, e, f) {
    this.checkStartMove();
    this.state.anchors.push(new Anchor().setCurve(a, b, c, d, e, f));
    this.changed();
    return this;
  },

  closePath: function() {
    this.checkStartMove();
    this.state.anchors.push(new Anchor().setClose());
    this.changed();
    return this;
  },

  startVector: function() {
    return this.state.anchors[0] && this.state.anchors[0].command == 'move'
      ? this.state.anchors[0].vec1.copy()
      : new Vector(0, 0);
  },

  subpaths: function(parent) {
    var subs = [];
    var lastSplit = 0;

    for (var i = 0; i < this.state.anchors.length; i++) {
      var isMove = this.state.anchors[i].command == 'move';
      var isAfterClose =
        this.state.anchors[i - 1] &&
        this.state.anchors[i - 1].command == 'close';
      var isLast = i == this.state.anchors.length - 1;

      if (i > lastSplit && (isMove || isAfterClose || isLast)) {
        if (isLast) i++;
        var sub = this.copy(parent);
        sub.state.anchors = sub.state.anchors.slice(lastSplit, i);
        subs.push(sub);
        lastSplit = i;
      }
    }

    return subs;
  },

  length: function() {
    var len = 0;
    var paths = this.subpaths(false);

    for (var p = 0; p < paths.length; p++) {
      var anchors = paths[p].state.anchors;

      // find length of all anchors in subpath.
      // if last stop is close, use beginning
      for (var i = 0; i < anchors.length - 1; i++) {
        var start = anchors[i];
        var startVec = start.vec3 || start.vec2 || start.vec1;
        var stop = anchors[i + 1];

        // if stop is a close command, replace close anchor
        // with vector of first point in path.
        if (stop.command == 'close') {
          stop = paths[p].startVector();
        }

        var rel = stop.sub(startVec);
        len += rel.length();
      }
    }

    return len;
  },

  vectorAtLength: function(len) {
    var tmpLen = 0;
    var paths = this.subpaths(false);

    for (var p = 0; p < paths.length; p++) {
      var anchors = paths[p].state.anchors;

      // find length of all anchors in subpath.
      // if last stop is close, use beginning
      for (var i = 0; i < anchors.length - 1; i++) {
        var start = anchors[i];
        var startVec = start.vec3 || start.vec2 || start.vec1;
        var stop = anchors[i + 1];

        // if stop is a close command, replace close anchor
        // with vector of first point in path.
        if (stop.command == 'close') {
          var beginning = paths[p].startVector();
          stop = new Anchor().setLine(beginning.x, beginning.y);
        }

        var vec = stop.sub(startVec);
        var veclen = vec.length();

        if (tmpLen + veclen > len) {
          var remaining = len - tmpLen;
          return startVec.add(vec.vectorAt(remaining / veclen));
        }

        tmpLen += veclen;
      }
    }

    return this.startVector();
  },

  vectorAt: function(scalar) {
    return this.vectorAtLength(this.length() * scalar);
  },

  toPolygons: function(opts, parent) {
    var paths = this.subpaths(false);
    var polys = [];

    // if splitting the path into vectors with equal spacing
    if (opts && opts.spacing) {
      for (var i = 0; i < paths.length; i++) {
        var poly = new Polygon(paths[i].state.x, paths[i].state.y);
        var len = paths[i].length();
        var num = len / opts.spacing;
        for (var j = 0; j < num; j++) {
          var vec = paths[i].vectorAtLength(j * opts.spacing);
          poly.lineTo(vec.x, vec.y);
        }

        Utils.copyMixinVars(this, poly);
        Utils.groupLogic(poly, this.parent, parent);

        polys.push(poly);
      }
    }

    return polys;
  },

  copy: function(parent) {
    var copy = new Path();
    copy.state.anchors = this.state.anchors.map(function(a) {
      return a.copy();
    });
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  scale: function(scalar) {
    this.scaleStyles(scalar);
    this.state.anchors = this.state.anchors.map(function(anchor) {
      return anchor.multiply(scalar);
    });
    this.changed();
    return this;
  },

  fillRule: function(val) {
    this.state.fillRule = val;
    this.changed();
    return this;
  },

  // Paths must start with a moveTo. This function is checks if
  // there is a moveTo at the beginning, and adds one if not.
  checkStartMove: function() {
    if (this.state.anchors.length == 0) {
      this.moveTo(0, 0);
    }
  },

  render: function(opts) {
    var attr = this.shapeAttributes({});
    this.stylesAttributes(attr);

    attr.d = this.state.anchors
      .map(function(a) {
        if (a.command == 'move') {
          return 'M ' + a.vec1.x + ' ' + a.vec1.y;
        } else if (a.command == 'line') {
          return 'L ' + a.vec1.x + ' ' + a.vec1.y;
        } else if (a.command == 'cubic') {
          return (
            'C ' +
            a.vec1.x +
            ' ' +
            a.vec1.y +
            ' ' +
            a.vec2.x +
            ' ' +
            a.vec2.y +
            ' ' +
            a.vec3.x +
            ' ' +
            a.vec3.y
          );
        } else if (a.command == 'quad' && typeof a.vec2 !== 'undefined') {
          return (
            'Q ' + a.vec1.x + ' ' + a.vec1.y + ' ' + a.vec2.x + ' ' + a.vec2.y
          );
        } else if (a.command == 'quad') {
          return 'T ' + a.vec1.x + ' ' + a.vec1.y;
        } else if (a.command == 'close') {
          return 'Z';
        }
      })
      .join(' ')
      .trim();

    if (this.state.fillRule) attr['fill-rule'] = this.state.fillRule;

    var els = [svg('path', attr)];

    if (opts.debug) els = els.concat(this.renderDebug());
    return els;
  },

  renderDebug: function() {
    var t = this;
    var els = [];

    for (var j = 0; j < this.state.anchors.length; j++) {
      var a = this.state.anchors[j];
      if (a.command == 'cubic') {
        els.push(
          t.debugLine(
            t.state.x + a.vec1.x,
            t.state.y + a.vec1.y,
            t.state.x + a.vec3.x,
            t.state.y + a.vec3.y
          )
        );
        els.push(
          t.debugLine(
            t.state.x + a.vec2.x,
            t.state.y + a.vec2.y,
            t.state.x + a.vec3.x,
            t.state.y + a.vec3.y
          )
        );
        for (var i = 1; i < 4; i++) {
          els.push(
            t.debugCircle(
              t.state.x + a['vec' + i].x,
              t.state.y + a['vec' + i].y
            )
          );
        }
      } else if (a.command == 'quad' && typeof a.vec2 !== 'undefined') {
        els.push(
          t.debugLine(
            t.state.x + a.vec1.x,
            t.state.y + a.vec1.y,
            t.state.x + a.vec2.x,
            t.state.y + a.vec2.y
          )
        );
        for (var i = 1; i < 3; i++) {
          els.push(
            t.debugCircle(
              t.state.x + a['vec' + i].x,
              t.state.y + a['vec' + i].y
            )
          );
        }
      }
    }

    return els;
  }
};

assign(Path.prototype, Shape, Styles, { type: 'path' });

module.exports = Path;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var assign = __webpack_require__(2);
var Shape = __webpack_require__(3);
var Styles = __webpack_require__(4);
var Box = __webpack_require__(13);
var Polygon = __webpack_require__(14);
var Utils = __webpack_require__(0);
var svg = __webpack_require__(1);

var Rectangle = function(x, y, width, height) {
  this.shape();
  this.box();
  this.styles();
  this.state.x = x;
  this.state.y = y;
  this.state.width = width;
  this.state.height = height;
}

Rectangle.prototype = {

  round: function(rx, ry) {
    if(!ry) ry = rx;
    this.state.rx = rx;
    this.state.ry = ry;
    this.changed();
    return this;
  },

  toPolygon: function(opts, parent) {
    var poly =  new Polygon(this.state.x, this.state.y)
      .lineTo(0, 0)
      .lineTo(this.state.width, 0)
      .lineTo(this.state.width, this.state.height)
      .lineTo(0, this.state.height);

    if(opts) poly = poly.toPolygon(opts, false);

    Utils.copyMixinVars(this, poly);
    Utils.groupLogic(poly, this.parent, parent);

    return poly;
  },

  copy: function(parent) {
    var copy = new Rectangle();
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  scale: function(scalar) {
    this.scaleBox(scalar);
    this.scaleStyles(scalar);
    this.changed();
    return this;
  },

  render: function(opts) {
    var attr = {
      x: Utils.s(this.state.x),
      y: Utils.s(this.state.y),
      width: Utils.s(this.state.width),
      height: Utils.s(this.state.height)
    }
    if(this.state.rx)  attr.rx = Utils.s(this.state.rx);
    if(this.state.ry)  attr.ry = Utils.s(this.state.ry);
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('rect', attr);
  }
}

assign(Rectangle.prototype, Shape, Box, Styles, { type: "rectangle" });

module.exports = Rectangle;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var assign = __webpack_require__(2);
var Shape = __webpack_require__(3);
var Styles = __webpack_require__(4);
var Utils = __webpack_require__(0);
var svg = __webpack_require__(1);

var Text = function(text, x, y) {
  this.shape();
  this.styles();
  this.state.text = text;
  this.state.x = x;
  this.state.y = y;
  this.state.fontSize = 16;
};

Text.prototype = {
  toPolygon: function() {
    throw new Error('You need the Rune.Font plugin to convert text to polygon');
  },

  textAlign: function(textAlign) {
    this.state.textAlign = textAlign;
    this.changed();
    return this;
  },

  fontFamily: function(fontFamily) {
    this.state.fontFamily = fontFamily;
    this.changed();
    return this;
  },

  fontStyle: function(fontStyle) {
    this.state.fontStyle = fontStyle;
    this.changed();
    return this;
  },

  fontWeight: function(fontWeight) {
    this.state.fontWeight = fontWeight;
    this.changed();
    return this;
  },

  fontSize: function(fontSize) {
    this.state.fontSize = fontSize;
    this.changed();
    return this;
  },

  letterSpacing: function(letterSpacing) {
    this.state.letterSpacing = letterSpacing;
    this.changed();
    return this;
  },

  textDecoration: function(textDecoration) {
    this.state.textDecoration = textDecoration;
    this.changed();
    return this;
  },

  copy: function(parent) {
    var copy = new Text();
    copy.state.text = this.state.text;
    copy.state.textAlign = this.state.textAlign;
    copy.state.fontFamily = this.state.fontFamily;
    copy.state.fontStyle = this.state.fontStyle;
    copy.state.fontWeight = this.state.fontWeight;
    copy.state.fontSize = this.state.fontSize;
    copy.state.letterSpacing = this.state.letterSpacing;
    copy.state.textDecoration = this.state.textDecoration;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  scale: function(scalar) {
    this.scaleStyles(scalar);
    this.state.fontSize *= scalar;
    this.changed();
    return this;
  },

  render: function(opts) {
    var attr = {
      x: Utils.s(this.state.x),
      y: Utils.s(this.state.y)
    };
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);

    // attributes that need specific handling
    if (this.state.textAlign) {
      var translate = { left: 'start', center: 'middle', right: 'end' };
      attr['text-anchor'] = translate[this.state.textAlign];
    }

    if (this.state.fontFamily)
      attr['font-family'] = Utils.s(this.state.fontFamily);
    if (this.state.textAlign)
      attr['text-align'] = Utils.s(this.state.textAlign);
    if (this.state.fontStyle)
      attr['font-style'] = Utils.s(this.state.fontStyle);
    if (this.state.fontWeight)
      attr['font-weight'] = Utils.s(this.state.fontWeight);
    if (this.state.fontSize) attr['font-size'] = Utils.s(this.state.fontSize);
    if (this.state.letterSpacing)
      attr['letter-spacing'] = Utils.s(this.state.letterSpacing);
    if (this.state.textDecoration)
      attr['text-decoration'] = Utils.s(this.state.textDecoration);

    return svg('text', attr, this.state.text);
  }
};

assign(Text.prototype, Shape, Styles, { type: 'text' });

module.exports = Text;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var assign = __webpack_require__(2);
var Shape = __webpack_require__(3);
var Styles = __webpack_require__(4);
var Box = __webpack_require__(13);
var Utils = __webpack_require__(0);
var svg = __webpack_require__(1);

var Image = function(url, x, y, width, height) {
  this.shape();
  this.box();
  this.state.url = url;
  this.state.x = x;
  this.state.y = y;
  this.state.width = width;
  this.state.height = height;
};

Image.prototype = {
  scale: function(scalar) {
    this.scaleBox(scalar);
    this.changed();
    return this;
  },

  copy: function(parent) {
    var copy = new Image();
    copy.state.url = this.state.url;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  render: function(opts) {
    var attr = {
      'xlink:href': Utils.s(this.state.url),
      x: Utils.s(this.state.x),
      y: Utils.s(this.state.y)
    };
    if (this.state.width) attr.width = Utils.s(this.state.width);
    if (this.state.height) attr.height = Utils.s(this.state.height);
    this.shapeAttributes(attr);
    return svg('image', attr);
  }
};

assign(Image.prototype, Shape, Box, { type: 'image' });

module.exports = Image;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var h = __webpack_require__(19)

module.exports = h


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var diff = __webpack_require__(55)

module.exports = diff


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(9)

var VPatch = __webpack_require__(23)
var isVNode = __webpack_require__(8)
var isVText = __webpack_require__(12)
var isWidget = __webpack_require__(6)
var isThunk = __webpack_require__(10)
var handleThunk = __webpack_require__(24)

var diffProps = __webpack_require__(56)

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(25)
var isHook = __webpack_require__(11)

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var patch = __webpack_require__(58)

module.exports = patch


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(26)
var isArray = __webpack_require__(9)

var render = __webpack_require__(27)
var domIndex = __webpack_require__(60)
var patchOp = __webpack_require__(61)
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}


/***/ }),
/* 59 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 60 */
/***/ (function(module, exports) {

// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var applyProperties = __webpack_require__(28)

var isWidget = __webpack_require__(6)
var VPatch = __webpack_require__(23)

var updateWidget = __webpack_require__(62)

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var isWidget = __webpack_require__(6)

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var createElement = __webpack_require__(27)

module.exports = createElement


/***/ })
/******/ ]);