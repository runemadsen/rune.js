(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Rune = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _bezierJs = _dereq_("bezier-js");

var _bezierJs2 = _interopRequireDefault(_bezierJs);

var _vector = _dereq_("./vector");

var _vector2 = _interopRequireDefault(_vector);

var Anchor = (function () {
  function Anchor() {
    _classCallCheck(this, Anchor);
  }

  _createClass(Anchor, [{
    key: "add",
    value: function add(vec) {
      var a = this.copy();
      if (a.vec1) a.vec1 = a.vec1.add(vec);
      if (a.vec2) a.vec2 = a.vec2.add(vec);
      if (a.vec3) a.vec3 = a.vec3.add(vec);
      return a;
    }
  }, {
    key: "sub",
    value: function sub(vec) {
      var a = this.copy();
      if (a.vec1) a.vec1 = a.vec1.sub(vec);
      if (a.vec2) a.vec2 = a.vec2.sub(vec);
      if (a.vec3) a.vec3 = a.vec3.sub(vec);
      return a;
    }
  }, {
    key: "copy",
    value: function copy() {
      var a = new Anchor();
      a.command = this.command;
      if (this.vec1) a.vec1 = this.vec1.copy();
      if (this.vec2) a.vec2 = this.vec2.copy();
      if (this.vec3) a.vec3 = this.vec3.copy();
      return a;
    }
  }, {
    key: "setMove",
    value: function setMove(x, y) {
      this.command = 'move';
      this.vec1 = new _vector2["default"](x, y);
      return this;
    }
  }, {
    key: "setLine",
    value: function setLine(x, y) {
      this.command = 'line';
      this.vec1 = new _vector2["default"](x, y);
      return this;
    }
  }, {
    key: "setCurve",
    value: function setCurve(a, b, c, d, e, f) {

      // cubic bezier with two control points
      if (!_underscore2["default"].isUndefined(f)) {
        this.command = 'cubic';
        this.vec1 = new _vector2["default"](a, b);
        this.vec2 = new _vector2["default"](c, d);
        this.vec3 = new _vector2["default"](e, f);
      }

      // quad bezier with one control point
      else {
          this.command = 'quad';
          this.vec1 = new _vector2["default"](a, b);
          this.vec2 = new _vector2["default"](c, d);
        }

      return this;
    }
  }, {
    key: "setClose",
    value: function setClose() {
      this.command = 'close';
      return this;
    }
  }, {
    key: "length",
    value: function length() {
      if (this.command == 'move') {
        return 0;
      } else if (this.command == 'line') {
        return this.vec1.length();
      } else if (this.command == 'quad') {
        return new _bezierJs2["default"](0, 0, this.vec1.x, this.vec1.y, this.vec2.x, this.vec2.y).length();
      } else if (this.command == 'cubic') {
        return new _bezierJs2["default"](0, 0, this.vec1.x, this.vec1.y, this.vec2.x, this.vec2.y, this.vec3.x, this.vec3.y).length();
      } else {
        throw new Error("Cannot compute length for this type of anchor");
      }
    }
  }, {
    key: "vectorAt",
    value: function vectorAt(scalar) {

      if (scalar > 1) scalar = 1;
      if (scalar < 0) scalar = 0;

      var ax, bx, cx;
      var ay, by, cy;
      var tSquared, tDoubled, tCubed;
      var dx, dy;

      if (this.command == 'line') {
        return new _vector2["default"](this.vec1.x, this.vec1.y).multiply(scalar);
      } else if (this.command == 'quad') {
        return new _bezierJs2["default"](0, 0, this.vec1.x, this.vec1.y, this.vec2.x, this.vec2.y).get(scalar);
      } else if (this.command == 'cubic') {
        return new _bezierJs2["default"](0, 0, this.vec1.x, this.vec1.y, this.vec2.x, this.vec2.y, this.vec3.x, this.vec3.y).get(scalar);
      } else {
        throw new Error("Cannot compute vectorAt for this type of anchor");
      }
    }
  }]);

  return Anchor;
})();

exports["default"] = Anchor;
module.exports = exports["default"];

},{"./vector":18,"bezier-js":undefined,"underscore":undefined}],2:[function(_dereq_,module,exports){
// This code was adapted from the brillinat color-js by harthur
// See more here: https://github.com/harthur/color
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _colorConvert = _dereq_('color-convert');

var _colorConvert2 = _interopRequireDefault(_colorConvert);

var _colorString = _dereq_('color-string');

var _colorString2 = _interopRequireDefault(_colorString);

var Color = (function () {
  function Color(a, b, c, d, e) {
    _classCallCheck(this, Color);

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
    }

    // HSB
    else if (a == 'hsv') {
        this.setValues('hsv', { h: b % 360, s: c, v: d });
        if (e) this.setValues('alpha', e);
      }

      // HEX
      else if (_underscore2['default'].isString(a)) {
          var vals = _colorString2['default'].getRgba(a);
          if (vals) this.setValues('rgb', vals);else if (vals = _colorString2['default'].getHsla(a)) this.setValues('hsl', vals);else if (vals = _colorString2['default'].getHwb(a)) this.setValues('hwb', vals);else throw new Error("Unable to parse color from string \"" + a + "\"");
          if (b) this.setValues('alpha', b);
        }

        // GRAYSCALE
        else if (_underscore2['default'].isUndefined(c)) {
            this.setValues('rgb', { r: a, g: a, b: a });
            if (b) this.setValues('alpha', b);
          }

          // RGB
          else if (!_underscore2['default'].isUndefined(a)) {
              this.setValues('rgb', { r: a, g: b, b: c });
              if (d) this.setValues('alpha', d);
            }
  }

  // Modules should be accessible through Color

  _createClass(Color, [{
    key: 'rgb',
    value: function rgb(vals) {
      return this.setSpace("rgb", arguments);
    }
  }, {
    key: 'hsl',
    value: function hsl(vals) {
      return this.setSpace("hsl", arguments);
    }
  }, {
    key: 'hsv',
    value: function hsv(vals) {
      return this.setSpace("hsv", arguments);
    }
  }, {
    key: 'hwb',
    value: function hwb(vals) {
      return this.setSpace("hwb", arguments);
    }
  }, {
    key: 'cmyk',
    value: function cmyk(vals) {
      return this.setSpace("cmyk", arguments);
    }
  }, {
    key: 'rgbArray',
    value: function rgbArray() {
      return this.values.rgb;
    }
  }, {
    key: 'hslArray',
    value: function hslArray() {
      return this.values.hsl;
    }
  }, {
    key: 'hsvArray',
    value: function hsvArray() {
      return this.values.hsv;
    }
  }, {
    key: 'hwbArray',
    value: function hwbArray() {
      if (this.values.alpha !== 1) {
        return this.values.hwb.concat([this.values.alpha]);
      }
      return this.values.hwb;
    }
  }, {
    key: 'cmykArray',
    value: function cmykArray() {
      return this.values.cmyk;
    }
  }, {
    key: 'rgbaArray',
    value: function rgbaArray() {
      var rgb = this.values.rgb;
      return rgb.concat([this.values.alpha]);
    }
  }, {
    key: 'hslaArray',
    value: function hslaArray() {
      var hsl = this.values.hsl;
      return hsl.concat([this.values.alpha]);
    }
  }, {
    key: 'alpha',
    value: function alpha(val) {
      if (val === undefined) {
        return this.values.alpha;
      }
      this.setValues("alpha", val);
      return this;
    }
  }, {
    key: 'red',
    value: function red(val) {
      return this.setChannel("rgb", 0, val);
    }
  }, {
    key: 'green',
    value: function green(val) {
      return this.setChannel("rgb", 1, val);
    }
  }, {
    key: 'blue',
    value: function blue(val) {
      return this.setChannel("rgb", 2, val);
    }
  }, {
    key: 'hue',
    value: function hue(val) {
      return this.setChannel("hsl", 0, val);
    }
  }, {
    key: 'saturation',
    value: function saturation(val) {
      return this.setChannel("hsl", 1, val);
    }
  }, {
    key: 'lightness',
    value: function lightness(val) {
      return this.setChannel("hsl", 2, val);
    }
  }, {
    key: 'saturationv',
    value: function saturationv(val) {
      return this.setChannel("hsv", 1, val);
    }
  }, {
    key: 'whiteness',
    value: function whiteness(val) {
      return this.setChannel("hwb", 1, val);
    }
  }, {
    key: 'blackness',
    value: function blackness(val) {
      return this.setChannel("hwb", 2, val);
    }
  }, {
    key: 'value',
    value: function value(val) {
      return this.setChannel("hsv", 2, val);
    }
  }, {
    key: 'cyan',
    value: function cyan(val) {
      return this.setChannel("cmyk", 0, val);
    }
  }, {
    key: 'magenta',
    value: function magenta(val) {
      return this.setChannel("cmyk", 1, val);
    }
  }, {
    key: 'yellow',
    value: function yellow(val) {
      return this.setChannel("cmyk", 2, val);
    }
  }, {
    key: 'black',
    value: function black(val) {
      return this.setChannel("cmyk", 3, val);
    }
  }, {
    key: 'hexString',
    value: function hexString() {
      return _colorString2['default'].hexString(this.values.rgb);
    }
  }, {
    key: 'rgbString',
    value: function rgbString() {
      return _colorString2['default'].rgbString(this.values.rgb, this.values.alpha);
    }
  }, {
    key: 'rgbaString',
    value: function rgbaString() {
      return _colorString2['default'].rgbaString(this.values.rgb, this.values.alpha);
    }
  }, {
    key: 'percentString',
    value: function percentString() {
      return _colorString2['default'].percentString(this.values.rgb, this.values.alpha);
    }
  }, {
    key: 'hslString',
    value: function hslString() {
      return _colorString2['default'].hslString(this.values.hsl, this.values.alpha);
    }
  }, {
    key: 'hslaString',
    value: function hslaString() {
      return _colorString2['default'].hslaString(this.values.hsl, this.values.alpha);
    }
  }, {
    key: 'hwbString',
    value: function hwbString() {
      return _colorString2['default'].hwbString(this.values.hwb, this.values.alpha);
    }
  }, {
    key: 'keyword',
    value: function keyword() {
      return _colorString2['default'].keyword(this.values.rgb, this.values.alpha);
    }
  }, {
    key: 'rgbNumber',
    value: function rgbNumber() {
      return this.values.rgb[0] << 16 | this.values.rgb[1] << 8 | this.values.rgb[2];
    }
  }, {
    key: 'luminosity',
    value: function luminosity() {
      // http://www.w3.org/TR/WCAG20/#relativeluminancedef
      var rgb = this.values.rgb;
      var lum = [];
      for (var i = 0; i < rgb.length; i++) {
        var chan = rgb[i] / 255;
        lum[i] = chan <= 0.03928 ? chan / 12.92 : Math.pow((chan + 0.055) / 1.055, 2.4);
      }
      return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
    }
  }, {
    key: 'contrast',
    value: function contrast(color2) {
      // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
      var lum1 = this.luminosity();
      var lum2 = color2.luminosity();
      if (lum1 > lum2) {
        return (lum1 + 0.05) / (lum2 + 0.05);
      };
      return (lum2 + 0.05) / (lum1 + 0.05);
    }
  }, {
    key: 'level',
    value: function level(color2) {
      var contrastRatio = this.contrast(color2);
      return contrastRatio >= 7.1 ? 'AAA' : contrastRatio >= 4.5 ? 'AA' : '';
    }
  }, {
    key: 'dark',
    value: function dark() {
      // YIQ equation from http://24ways.org/2010/calculating-color-contrast
      var rgb = this.values.rgb,
          yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
      return yiq < 128;
    }
  }, {
    key: 'light',
    value: function light() {
      return !this.dark();
    }
  }, {
    key: 'negate',
    value: function negate() {
      var rgb = [];
      for (var i = 0; i < 3; i++) {
        rgb[i] = 255 - this.values.rgb[i];
      }
      this.setValues("rgb", rgb);
      return this;
    }
  }, {
    key: 'lighten',
    value: function lighten(ratio) {
      this.values.hsl[2] += this.values.hsl[2] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
    }
  }, {
    key: 'darken',
    value: function darken(ratio) {
      this.values.hsl[2] -= this.values.hsl[2] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
    }
  }, {
    key: 'saturate',
    value: function saturate(ratio) {
      this.values.hsl[1] += this.values.hsl[1] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
    }
  }, {
    key: 'desaturate',
    value: function desaturate(ratio) {
      this.values.hsl[1] -= this.values.hsl[1] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
    }
  }, {
    key: 'whiten',
    value: function whiten(ratio) {
      this.values.hwb[1] += this.values.hwb[1] * ratio;
      this.setValues("hwb", this.values.hwb);
      return this;
    }
  }, {
    key: 'blacken',
    value: function blacken(ratio) {
      this.values.hwb[2] += this.values.hwb[2] * ratio;
      this.setValues("hwb", this.values.hwb);
      return this;
    }
  }, {
    key: 'greyscale',
    value: function greyscale() {
      var rgb = this.values.rgb;
      // http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
      var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
      this.setValues("rgb", [val, val, val]);
      return this;
    }
  }, {
    key: 'clearer',
    value: function clearer(ratio) {
      this.setValues("alpha", this.values.alpha - this.values.alpha * ratio);
      return this;
    }
  }, {
    key: 'opaquer',
    value: function opaquer(ratio) {
      this.setValues("alpha", this.values.alpha + this.values.alpha * ratio);
      return this;
    }
  }, {
    key: 'rotate',
    value: function rotate(degrees) {
      var hue = this.values.hsl[0];
      hue = (hue + degrees) % 360;
      hue = hue < 0 ? 360 + hue : hue;
      this.values.hsl[0] = hue;
      this.setValues("hsl", this.values.hsl);
      return this;
    }

    /**
     * Ported from sass implementation in C
     * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
     */
  }, {
    key: 'mix',
    value: function mix(mixinColor, weight) {
      var color1 = this;
      var color2 = mixinColor;
      var p = weight !== undefined ? weight : 0.5;

      var w = 2 * p - 1;
      var a = color1.alpha() - color2.alpha();

      var w1 = ((w * a == -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
      var w2 = 1 - w1;

      return this.rgb(w1 * color1.red() + w2 * color2.red(), w1 * color1.green() + w2 * color2.green(), w1 * color1.blue() + w2 * color2.blue()).alpha(color1.alpha() * p + color2.alpha() * (1 - p));
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this.rgb();
    }
  }, {
    key: 'copy',
    value: function copy() {
      return new Color().rgb(this.rgb());
    }
  }, {
    key: 'getValues',
    value: function getValues(space) {
      var vals = {};
      for (var i = 0; i < space.length; i++) {
        vals[space.charAt(i)] = this.values[space][i];
      }
      if (this.values.alpha != 1) {
        vals["a"] = this.values.alpha;
      }
      // {r: 255, g: 255, b: 255, a: 0.4}
      return vals;
    }
  }, {
    key: 'setValues',
    value: function setValues(space, vals) {

      var spaces = {
        "rgb": ["red", "green", "blue"],
        "hsl": ["hue", "saturation", "lightness"],
        "hsv": ["hue", "saturation", "value"],
        "hwb": ["hue", "whiteness", "blackness"],
        "cmyk": ["cyan", "magenta", "yellow", "black"]
      };

      var maxes = {
        "rgb": [255, 255, 255],
        "hsl": [360, 100, 100],
        "hsv": [360, 100, 100],
        "hwb": [360, 100, 100],
        "cmyk": [100, 100, 100, 100]
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
      this.values.alpha = Math.max(0, Math.min(1, alpha !== undefined ? alpha : this.values.alpha));
      if (space == "alpha") {
        return;
      }

      // cap values of the space prior converting all values
      for (var i = 0; i < space.length; i++) {
        var capped = Math.max(0, Math.min(maxes[space][i], this.values[space][i]));
        this.values[space][i] = Math.round(capped);
      }

      // convert to all the other color spaces
      for (var sname in spaces) {
        if (sname != space) {
          this.values[sname] = _colorConvert2['default'][space][sname](this.values[space]);
        }

        // cap values
        for (var i = 0; i < sname.length; i++) {
          var capped = Math.max(0, Math.min(maxes[sname][i], this.values[sname][i]));
          this.values[sname][i] = Math.round(capped);
        }
      }
      return true;
    }
  }, {
    key: 'setSpace',
    value: function setSpace(space, args) {
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
    }
  }, {
    key: 'setChannel',
    value: function setChannel(space, index, val) {
      if (val === undefined) {
        // color.red()
        return this.values[space][index];
      }
      // color.red(100)
      this.values[space][index] = val;
      this.setValues(space, this.values[space]);
      return this;
    }
  }]);

  return Color;
})();

Color.Convert = _colorConvert2['default'];

exports['default'] = Color;
module.exports = exports['default'];

},{"color-convert":undefined,"color-string":undefined,"underscore":undefined}],3:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Events = {

  on: function on(name, callback) {
    if (!this._events) this._events = {};
    this._events[name] = this._events[name] || [];
    this._events[name].push(callback);
    return this;
  },

  off: function off(name, callback) {
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

  trigger: function trigger(name) {
    if (this._events && this._events[name]) {
      var theseEvents = this._events[name];
      var args = arguments.length > 1 ? [arguments[1]] : [];
      var i = theseEvents.length;
      while (i--) {
        theseEvents[i].apply(this, args);
      }
    }
    return this;
  }

};

exports["default"] = Events;
module.exports = exports["default"];

},{}],4:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _mixins = _dereq_("./mixins");

var _group = _dereq_('./group');

var _group2 = _interopRequireDefault(_group);

var Grid = (function () {
  function Grid(options) {
    _classCallCheck(this, Grid);

    this.moveable();
    this.modules = [];

    var req = _underscore2["default"].defaults(options || {}, {
      x: 0,
      y: 0,
      columns: 10,
      rows: 1,
      gutterWidth: 0,
      gutterHeight: 0,
      moduleWidth: 50,
      moduleHeight: 500
    });

    // if gutter is set, override gutterWidth and gutterHeight
    if (!_underscore2["default"].isUndefined(req.gutter)) {
      req.gutterWidth = req.gutter;
      req.gutterHeight = req.gutter;
    }

    // if width is set, override moduleWidth
    if (!_underscore2["default"].isUndefined(req.width)) {
      req.moduleWidth = (req.width - (req.columns - 1) * req.gutterWidth) / req.columns;
    } else {
      req.width = req.moduleWidth * req.columns + req.gutterWidth * (req.columns - 1);
    }

    // if height is set, override moduleWidth
    if (!_underscore2["default"].isUndefined(req.height)) {
      req.moduleHeight = (req.height - (req.rows - 1) * req.gutterHeight) / req.rows;
    } else {
      req.height = req.moduleHeight * req.rows + req.gutterHeight * (req.rows - 1);
    }

    _underscore2["default"].extend(this.vars, req);

    this.computeGrid();
  }

  _createClass(Grid, [{
    key: "add",
    value: function add(child, column, row) {

      if (!column) column = 1;
      if (!row) row = 1;

      if (this.modules[column - 1] && this.modules[column - 1][row - 1]) {
        this.modules[column - 1][row - 1].add(child);
      } else {
        throw new Error("Column or row does not exist");
      }
    }
  }, {
    key: "computeGrid",
    value: function computeGrid() {

      this.modules = [];

      for (var x = 0; x < this.vars.columns; x++) {

        this.modules.push([]);

        for (var y = 0; y < this.vars.rows; y++) {

          var groupX = x * this.vars.moduleWidth + x * this.vars.gutterWidth;
          var groupY = y * this.vars.moduleHeight + y * this.vars.gutterHeight;
          this.modules[x].push(new _group2["default"](groupX, groupY));
        }
      }
    }
  }]);

  return Grid;
})();

_underscore2["default"].extend(Grid.prototype, _mixins.Shapeable, _mixins.Moveable, { type: "grid" });

exports["default"] = Grid;
module.exports = exports["default"];

},{"./group":5,"./mixins":6,"underscore":undefined}],5:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _mixins = _dereq_("./mixins");

var _utils = _dereq_('./utils');

var _utils2 = _interopRequireDefault(_utils);

var Group = (function () {
  function Group(x, y) {
    _classCallCheck(this, Group);

    this.moveable();
    this.children = [];

    if (!_underscore2["default"].isUndefined(x)) this.vars.x = x;
    if (!_underscore2["default"].isUndefined(y)) this.vars.y = y;
  }

  // Should we figure out a better way to do mixins for ES6?

  _createClass(Group, [{
    key: "add",
    value: function add(child) {
      if (child.parent) child.parent.remove(child);
      this.children.push(child);
      child.parent = this;
    }
  }, {
    key: "remove",
    value: function remove(child) {
      this.children = _underscore2["default"].without(this.children, child);
      child.parent = false;
    }
  }, {
    key: "copy",
    value: function copy(parent) {
      var copy = new Group();
      _underscore2["default"].each(this.children, function (child) {
        child.copy(copy);
      });
      _utils2["default"].copyMixinVars(this, copy);
      _utils2["default"].groupLogic(copy, this.parent, parent);
      return copy;
    }
  }]);

  return Group;
})();

_underscore2["default"].extend(Group.prototype, _mixins.Moveable, _mixins.Groupable, { type: "group" });

exports["default"] = Group;
module.exports = exports["default"];

},{"./mixins":6,"./utils":17,"underscore":undefined}],6:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = _dereq_('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _color = _dereq_('./color');

var _color2 = _interopRequireDefault(_color);

var Moveable = {

  moveable: function moveable(copy) {
    this.vars = this.vars || {};
    this.vars.x = copy ? copy.vars.x : 0;
    this.vars.y = copy ? copy.vars.y : 0;
    this.vars.rotation = copy ? copy.vars.rotation : 0;
    this.vars.rotationX = copy ? copy.vars.rotationX : 0;
    this.vars.rotationY = copy ? copy.vars.rotationY : 0;
  },

  move: function move(x, y, relative) {
    this.vars.x = relative ? this.vars.x + x : x;
    this.vars.y = relative ? this.vars.y + y : y;
    return this;
  },

  rotate: function rotate(deg, x, y, relative) {
    this.vars.rotation = deg;
    if (x || y) {
      this.vars.rotationX = x || 0;
      this.vars.rotationY = y || 0;
    }
    if (relative) {
      this.vars.rotationX += this.vars.x;
      this.vars.rotationY += this.vars.y;
    }
    return this;
  }

};

var Sizeable = {

  sizeable: function sizeable(copy) {
    this.vars = this.vars || {};
    this.vars.width = copy ? copy.vars.width : 0;
    this.vars.height = copy ? copy.vars.height : 0;
  }

};

var Styleable = {

  styleable: function styleable(copy) {

    this.vars = this.vars || {};
    this.vars.fill = new _color2['default'](128);
    this.vars.stroke = new _color2['default'](0);

    if (copy) {
      if (copy.vars.fill === false) this.vars.fill = false;else if (copy.vars.fill) this.vars.fill = copy.vars.fill.copy();

      if (copy.vars.stroke === false) this.vars.stroke = false;else if (copy.vars.stroke) this.vars.stroke = copy.vars.stroke.copy();
    }
  },

  fill: function fill(a, b, c, d, e) {
    if (a === false) this.vars.fill = false;else this.vars.fill = new _color2['default'](a, b, c, d, e);
    return this;
  },

  stroke: function stroke(a, b, c, d, e) {
    if (a === false) this.vars.stroke = false;else this.vars.stroke = new _color2['default'](a, b, c, d, e);
    return this;
  },

  strokeWidth: function strokeWidth(val) {
    this.vars.strokeWidth = val;return this;
  },
  strokeCap: function strokeCap(val) {
    this.vars.strokeCap = val;return this;
  },
  strokeJoin: function strokeJoin(val) {
    this.vars.strokeJoin = val;return this;
  },
  strokeMiterlimit: function strokeMiterlimit(val) {
    this.vars.strokeMiterlimit = val;return this;
  },
  strokeDash: function strokeDash(val) {
    this.vars.strokeDash = val;return this;
  },
  strokeDashOffset: function strokeDashOffset(val) {
    this.vars.strokeDashOffset = val;return this;
  }
};

// Mixin for shapes that can belong to a group. This applies to
// most shapes.
var Groupable = {

  addParent: function addParent(group) {
    group.add(this);
    return this;
  },

  removeParent: function removeParent() {
    if (this.parent) this.parent.remove(this);
    return this;
  }

};

exports.Moveable = Moveable;
exports.Sizeable = Sizeable;
exports.Styleable = Styleable;
exports.Groupable = Groupable;

},{"./color":2,"./utils":17}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _shapesCircle = _dereq_('./shapes/circle');

var _shapesCircle2 = _interopRequireDefault(_shapesCircle);

var _shapesRectangle = _dereq_('./shapes/rectangle');

var _shapesRectangle2 = _interopRequireDefault(_shapesRectangle);

var _shapesLine = _dereq_('./shapes/line');

var _shapesLine2 = _interopRequireDefault(_shapesLine);

var _virtualDomH = _dereq_('virtual-dom/h');

var _virtualDomH2 = _interopRequireDefault(_virtualDomH);

var _virtualDomDiff = _dereq_('virtual-dom/diff');

var _virtualDomDiff2 = _interopRequireDefault(_virtualDomDiff);

var _virtualDomPatch = _dereq_('virtual-dom/patch');

var _virtualDomPatch2 = _interopRequireDefault(_virtualDomPatch);

var _virtualDomCreateElement = _dereq_('virtual-dom/create-element');

var _virtualDomCreateElement2 = _interopRequireDefault(_virtualDomCreateElement);

var _virtualDomVirtualHyperscriptSvg = _dereq_('virtual-dom/virtual-hyperscript/svg');

var _virtualDomVirtualHyperscriptSvg2 = _interopRequireDefault(_virtualDomVirtualHyperscriptSvg);

var Render = (function () {
  function Render(params) {
    _classCallCheck(this, Render);

    this.params = params;
    this.tree = (0, _virtualDomVirtualHyperscriptSvg2['default'])('svg', {
      width: this.s(params.width),
      height: this.s(params.height)
    });
    this.el = (0, _virtualDomCreateElement2['default'])(this.tree);
  }

  _createClass(Render, [{
    key: 'render',
    value: function render(stage, opts) {

      var newTree = (0, _virtualDomVirtualHyperscriptSvg2['default'])('svg', {
        width: this.s(this.params.width),
        height: this.s(this.params.height)
      }, [this.objectsToSVG(stage.children, opts)]);

      var diffTree = (0, _virtualDomDiff2['default'])(this.tree, newTree);
      this.el = (0, _virtualDomPatch2['default'])(this.el, diffTree);
      this.tree = newTree;
    }

    // Shape converters
    // --------------------------------------------------

  }, {
    key: 'objectToSVG',
    value: function objectToSVG(object, opts) {
      if (this[object.type + "ToSVG"]) return this[object.type + "ToSVG"](object, opts);else console.error("Rune.Render: Object not recognized", object);
    }
  }, {
    key: 'objectsToSVG',
    value: function objectsToSVG(objects, opts) {
      var objects = _underscore2['default'].map(objects, _underscore2['default'].bind(function (object) {
        return this.objectToSVG(object, opts);
      }, this));
      return _underscore2['default'].flatten(objects, true);
    }
  }, {
    key: 'rectangleToSVG',
    value: function rectangleToSVG(rect) {
      var attr = {
        x: this.s(rect.vars.x),
        y: this.s(rect.vars.y),
        width: this.s(rect.vars.width),
        height: this.s(rect.vars.height)
      };
      this.transformAttribute(attr, rect);
      this.styleableAttributes(rect, attr);
      return (0, _virtualDomVirtualHyperscriptSvg2['default'])('rect', attr);
    }
  }, {
    key: 'ellipseToSVG',
    value: function ellipseToSVG(ellipse) {
      var attr = {
        cx: this.s(ellipse.vars.x),
        cy: this.s(ellipse.vars.y),
        rx: this.s(ellipse.vars.width / 2),
        ry: this.s(ellipse.vars.height / 2)
      };
      this.transformAttribute(attr, ellipse);
      this.styleableAttributes(ellipse, attr);
      return (0, _virtualDomVirtualHyperscriptSvg2['default'])('ellipse', attr);
    }
  }, {
    key: 'circleToSVG',
    value: function circleToSVG(circle) {
      var attr = {
        cx: this.s(circle.vars.x),
        cy: this.s(circle.vars.y),
        r: this.s(circle.vars.radius)
      };
      this.transformAttribute(attr, circle);
      this.styleableAttributes(circle, attr);
      return (0, _virtualDomVirtualHyperscriptSvg2['default'])('circle', attr);
    }
  }, {
    key: 'lineToSVG',
    value: function lineToSVG(line) {
      var attr = {
        x1: this.s(line.vars.x),
        y1: this.s(line.vars.y),
        x2: this.s(line.vars.x2),
        y2: this.s(line.vars.y2)
      };
      this.transformAttribute(attr, line);
      this.styleableAttributes(line, attr);
      return (0, _virtualDomVirtualHyperscriptSvg2['default'])('line', attr);
    }
  }, {
    key: 'triangleToSVG',
    value: function triangleToSVG(tri) {
      var attr = {
        points: tri.vars.x + ' ' + tri.vars.y + ' ' + tri.vars.x2 + ' ' + tri.vars.y2 + ' ' + tri.vars.x3 + ' ' + tri.vars.y3
      };
      this.transformAttribute(attr, tri);
      this.styleableAttributes(tri, attr);
      return (0, _virtualDomVirtualHyperscriptSvg2['default'])('polygon', attr);
    }
  }, {
    key: 'polygonToSVG',
    value: function polygonToSVG(polygon) {
      var attr = {
        points: _underscore2['default'].map(polygon.vars.vectors, function (vec) {
          return vec.x + " " + vec.y;
        }).join(" ")
      };
      this.transformAttribute(attr, polygon);
      this.styleableAttributes(polygon, attr);
      return (0, _virtualDomVirtualHyperscriptSvg2['default'])('polygon', attr);
    }
  }, {
    key: 'pathToSVG',
    value: function pathToSVG(path, opts) {
      var attr = {};
      this.dAttribute(path, attr);
      this.transformAttribute(attr, path);
      this.styleableAttributes(path, attr);
      this.optionalAttributes(path, attr, {
        "fillRule": "fill-rule"
      });

      var els = [(0, _virtualDomVirtualHyperscriptSvg2['default'])('path', attr)];

      if (opts && opts.debug) els = els.concat(this.debugPathToSVG(path));
      return els;
    }
  }, {
    key: 'textToSVG',
    value: function textToSVG(text, opts) {
      var attr = {
        x: this.s(text.vars.x),
        y: this.s(text.vars.y)
      };
      this.transformAttribute(attr, text);
      this.styleableAttributes(text, attr);

      // attributes that need specific handling
      if (text.vars.textAlign) {
        var translate = { "left": "start", "center": "middle", "right": "end" };
        attr["text-anchor"] = translate[text.vars.textAlign];
      }

      this.optionalAttributes(text, attr, {
        "fontFamily": "font-family",
        "textAlign": "text-align",
        "fontStyle": "font-style",
        "fontWeight": "font-weight",
        "fontSize": "font-size",
        "letterSpacing": "letter-spacing",
        "textDecoration": "text-decoration"
      });

      if (text.vars.textAlign) {
        var translate = { "left": "start", "center": "middle", "right": "end" };
        attr["text-anchor"] = translate[text.vars.textAlign];
      }

      return (0, _virtualDomVirtualHyperscriptSvg2['default'])('text', attr, text.vars.text);
    }
  }, {
    key: 'groupToSVG',
    value: function groupToSVG(group) {
      if (_underscore2['default'].isEmpty(group.children)) return;
      var attr = {};
      this.transformAttribute(attr, group);
      return (0, _virtualDomVirtualHyperscriptSvg2['default'])('g', attr, this.objectsToSVG(group.children));
    }
  }, {
    key: 'gridToSVG',
    value: function gridToSVG(grid, opts) {
      var attr = {};
      this.transformAttribute(attr, grid);

      var groups = [];
      _underscore2['default'].each(grid.modules, _underscore2['default'].bind(function (column) {
        groups.push(this.objectsToSVG(column));
      }, this));

      if (opts && opts.debug) groups = groups.concat(this.debugGridToSVG(grid));

      return (0, _virtualDomVirtualHyperscriptSvg2['default'])('g', attr, _underscore2['default'].flatten(groups, true));
    }

    // Debug
    // --------------------------------------------------

  }, {
    key: 'debugPathToSVG',
    value: function debugPathToSVG(path) {

      var t = this;
      var els = [];

      _underscore2['default'].each(path.vars.anchors, function (a, i) {
        if (a.command == 'cubic') {
          els.push(t.debugLine(path.vars.x + a.vec1.x, path.vars.y + a.vec1.y, path.vars.x + a.vec3.x, path.vars.y + a.vec3.y));
          els.push(t.debugLine(path.vars.x + a.vec2.x, path.vars.y + a.vec2.y, path.vars.x + a.vec3.x, path.vars.y + a.vec3.y));
          for (var i = 1; i < 4; i++) {
            els.push(t.debugCircle(path.vars.x + a["vec" + i].x, path.vars.y + a["vec" + i].y));
          }
        } else if (a.command == 'quad' && !_underscore2['default'].isUndefined(a.vec2)) {
          els.push(t.debugLine(path.vars.x + a.vec1.x, path.vars.y + a.vec1.y, path.vars.x + a.vec2.x, path.vars.y + a.vec2.y));
          for (var i = 1; i < 3; i++) {
            els.push(t.debugCircle(path.vars.x + a["vec" + i].x, path.vars.y + a["vec" + i].y));
          }
        }
      });

      return els;
    }
  }, {
    key: 'debugGridToSVG',
    value: function debugGridToSVG(grid) {

      var t = this;
      var els = [];

      // draw container rect
      els.push(this.debugRect(0, 0, grid.vars.width, grid.vars.height));

      // draw lines for columns
      var x = 0;
      for (var i = 0; i < grid.vars.columns - 1; i++) {
        x += grid.vars.moduleWidth;
        els.push(this.debugLine(x, 0, x, grid.vars.height));
        x += grid.vars.gutterWidth;
        els.push(this.debugLine(x, 0, x, grid.vars.height));
      }

      // draw lines for rows
      var y = 0;
      for (var i = 0; i < grid.vars.rows - 1; i++) {
        y += grid.vars.moduleHeight;
        els.push(this.debugLine(0, y, grid.vars.width, y));
        y += grid.vars.gutterHeight;
        els.push(this.debugLine(0, y, grid.vars.width, y));
      }

      return els;
    }
  }, {
    key: 'debugCircle',
    value: function debugCircle(x, y) {
      var c = new _shapesCircle2['default'](x, y, 4).fill(212, 18, 229).stroke(false);
      return this.circleToSVG(c);
    }
  }, {
    key: 'debugRect',
    value: function debugRect(x, y, width, height) {
      var r = new _shapesRectangle2['default'](x, y, width, height).stroke(212, 18, 229).fill(false);
      return this.rectangleToSVG(r);
    }
  }, {
    key: 'debugLine',
    value: function debugLine(x1, y1, x2, y2) {
      var l = new _shapesLine2['default'](x1, y1, x2, y2).stroke(212, 18, 229);
      return this.lineToSVG(l);
    }

    // Multiple attributes
    // --------------------------------------------------

  }, {
    key: 'optionalAttributes',
    value: function optionalAttributes(object, attr, keys) {
      _underscore2['default'].each(keys, function (attribute, variable) {
        if (object.vars[variable]) {
          attr[attribute] = this.s(object.vars[variable]);
        }
      }, this);
    }
  }, {
    key: 'sizeableAttributes',
    value: function sizeableAttributes(object, attr) {
      attr.width = this.s(object.vars.width);
      attr.height = this.s(object.vars.height);
    }
  }, {
    key: 'styleableAttributes',
    value: function styleableAttributes(object, attr) {

      function rgbString(col) {
        var obj = col.rgb();
        return "rgb(" + obj.r + ", " + obj.g + ", " + obj.b + ")";
      }

      if (object.vars.fill === false) attr.fill = "none";else if (object.vars.fill) {
        attr.fill = rgbString(object.vars.fill);
        var alpha = object.vars.fill.alpha();
        if (alpha < 1) attr["fill-opacity"] = this.s(alpha);
      }

      if (object.vars.stroke === false) attr.stroke = "none";else if (object.vars.stroke) {
        attr.stroke = rgbString(object.vars.stroke);
        var alpha = object.vars.stroke.alpha();
        if (alpha < 1) attr["stroke-opacity"] = this.s(alpha);
      }

      if (object.vars.strokeWidth) attr["stroke-width"] = this.s(object.vars.strokeWidth);
      if (object.vars.strokeCap) attr["stroke-linecap"] = object.vars.strokeCap;
      if (object.vars.strokeJoin) attr["stroke-linejoin"] = object.vars.strokeJoin;
      if (object.vars.strokeMiterlimit) attr["stroke-miterlimit"] = this.s(object.vars.strokeMiterlimit);
      if (object.vars.strokeDash) attr["stroke-dasharray"] = object.vars.strokeDash;
      if (object.vars.strokeDashOffset) attr["stroke-dashoffset"] = this.s(object.vars.strokeDashOffset);
    }

    // Single attributes
    // --------------------------------------------------

  }, {
    key: 'transformAttribute',
    value: function transformAttribute(attr, shape) {

      var vars = shape.vars;
      var strings = [];

      if (vars.rotation) {
        var rot = "rotate(" + vars.rotation;
        if (vars.rotationX || vars.rotationY) rot += " " + vars.rotationX + " " + vars.rotationY;
        strings.push(rot + ")");
      }

      if ((shape.type == "group" || shape.type == "path" || shape.type == "polygon" || shape.type == "grid") && (vars.x || vars.y)) {
        strings.push("translate(" + vars.x + " " + vars.y + ")");
      }

      if (strings.length > 0) attr.transform = strings.join(" ").trim();
    }
  }, {
    key: 'dAttribute',
    value: function dAttribute(object, attr) {
      attr.d = _underscore2['default'].map(object.vars.anchors, function (a) {

        if (a.command == 'move') {
          return (a.relative ? "m" : "M") + " " + [a.vec1.x, a.vec1.y].join(' ');
        } else if (a.command == 'line') {
          return (a.relative ? "l" : "L") + " " + [a.vec1.x, a.vec1.y].join(' ');
        } else if (a.command == 'cubic') {
          return (a.relative ? "c" : "C") + " " + [a.vec1.x, a.vec1.y, a.vec2.x, a.vec2.y, a.vec3.x, a.vec3.y].join(' ');
        } else if (a.command == 'quad' && !_underscore2['default'].isUndefined(a.vec2)) {
          return (a.relative ? "q" : "Q") + " " + [a.vec1.x, a.vec1.y, a.vec2.x, a.vec2.y].join(' ');
        } else if (a.command == 'quad') {
          return (a.relative ? "t" : "T") + " " + [a.vec1.x, a.vec1.y].join(' ');
        } else if (a.command == 'close') {
          return "Z";
        }
      }).join(" ").trim();
    }

    // Helpers
    // --------------------------------------------------

    // function to turn any non-string into a string. We need
    // this when running server-side node.
  }, {
    key: 's',
    value: function s(val) {
      if (!_underscore2['default'].isString(val) && !_underscore2['default'].isUndefined(val.toString)) return val.toString();
      return val;
    }
  }]);

  return Render;
})();

exports['default'] = Render;
module.exports = exports['default'];

},{"./shapes/circle":9,"./shapes/line":11,"./shapes/rectangle":14,"underscore":undefined,"virtual-dom/create-element":undefined,"virtual-dom/diff":undefined,"virtual-dom/h":undefined,"virtual-dom/patch":undefined,"virtual-dom/virtual-hyperscript/svg":undefined}],8:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _vector = _dereq_("./vector");

var _vector2 = _interopRequireDefault(_vector);

var _anchor = _dereq_("./anchor");

var _anchor2 = _interopRequireDefault(_anchor);

var _color = _dereq_("./color");

var _color2 = _interopRequireDefault(_color);

var _group = _dereq_("./group");

var _group2 = _interopRequireDefault(_group);

var _grid = _dereq_("./grid");

var _grid2 = _interopRequireDefault(_grid);

var _utils = _dereq_("./utils");

var _utils2 = _interopRequireDefault(_utils);

var _events = _dereq_("./events");

var _events2 = _interopRequireDefault(_events);

var _render = _dereq_("./render");

var _render2 = _interopRequireDefault(_render);

var _shapesCircle = _dereq_("./shapes/circle");

var _shapesCircle2 = _interopRequireDefault(_shapesCircle);

var _shapesEllipse = _dereq_("./shapes/ellipse");

var _shapesEllipse2 = _interopRequireDefault(_shapesEllipse);

var _shapesLine = _dereq_("./shapes/line");

var _shapesLine2 = _interopRequireDefault(_shapesLine);

var _shapesTriangle = _dereq_("./shapes/triangle");

var _shapesTriangle2 = _interopRequireDefault(_shapesTriangle);

var _shapesPath = _dereq_("./shapes/path");

var _shapesPath2 = _interopRequireDefault(_shapesPath);

var _shapesPolygon = _dereq_("./shapes/polygon");

var _shapesPolygon2 = _interopRequireDefault(_shapesPolygon);

var _shapesRectangle = _dereq_("./shapes/rectangle");

var _shapesRectangle2 = _interopRequireDefault(_shapesRectangle);

var _shapesText = _dereq_("./shapes/text");

var _shapesText2 = _interopRequireDefault(_shapesText);

var _mixins = _dereq_("./mixins");

var Rune = (function () {
  function Rune(options) {
    _classCallCheck(this, Rune);

    var params = _underscore2["default"].defaults(options || {}, {
      width: 640,
      height: 480,
      debug: false,
      frameRate: 60
    });

    this.width = params.width;
    this.height = params.height;
    this.renderer = new _render2["default"](params);
    this.stage = new _group2["default"]();
    this.debug = params.debug;
    this.frameCount = 1;
    this.frameRate = params.frameRate;

    if (params.container && typeof window !== 'undefined') {

      if (_underscore2["default"].isString(params.container)) {
        params.container = document.querySelector(params.container);
      }

      if (params.container) {
        this.appendTo(params.container);
      } else {
        console.error("Container element not found");
      }
    }

    this.initEvents();
  }

  // Events
  // --------------------------------------------------

  _createClass(Rune, [{
    key: "initEvents",
    value: function initEvents() {

      // Specific browser events
      if (typeof window !== 'undefined') {
        this.initMouseMove();
      }
    }
  }, {
    key: "initMouseMove",
    value: function initMouseMove() {
      var mouseMove = _underscore2["default"].bind(function (e) {
        var bounds = this.renderer.el.getBoundingClientRect();
        this.trigger('mousemove', {
          x: e.pageX - bounds.left,
          y: e.pageY - bounds.top
        });
      }, this);
      document.addEventListener('mousemove', mouseMove, false);
    }

    // Shape functions
    // --------------------------------------------------

  }, {
    key: "group",
    value: function group(x, y, parent) {
      var group = new _group2["default"](x, y);
      _utils2["default"].groupLogic(group, this.stage, parent);
      return group;
    }
  }, {
    key: "triangle",
    value: function triangle(x, y, x2, y2, x3, y3, parent) {
      var tri = new _shapesTriangle2["default"](x, y, x2, y2, x3, y3);
      _utils2["default"].groupLogic(tri, this.stage, parent);
      return tri;
    }
  }, {
    key: "rect",
    value: function rect(x, y, width, height, parent) {
      var rect = new _shapesRectangle2["default"](x, y, width, height);
      _utils2["default"].groupLogic(rect, this.stage, parent);
      return rect;
    }
  }, {
    key: "ellipse",
    value: function ellipse(x, y, width, height, parent) {
      var ell = new _shapesEllipse2["default"](x, y, width, height);
      _utils2["default"].groupLogic(ell, this.stage, parent);
      return ell;
    }
  }, {
    key: "circle",
    value: function circle(x, y, radius, parent) {
      var circ = new _shapesCircle2["default"](x, y, radius);
      _utils2["default"].groupLogic(circ, this.stage, parent);
      return circ;
    }
  }, {
    key: "line",
    value: function line(x1, y1, x2, y2, parent) {
      var line = new _shapesLine2["default"](x1, y1, x2, y2);
      _utils2["default"].groupLogic(line, this.stage, parent);
      return line;
    }
  }, {
    key: "polygon",
    value: function polygon(x, y, parent) {
      var poly = new _shapesPolygon2["default"](x, y);
      _utils2["default"].groupLogic(poly, this.stage, parent);
      return poly;
    }
  }, {
    key: "path",
    value: function path(x, y, parent) {
      var path = new _shapesPath2["default"](x, y);
      _utils2["default"].groupLogic(path, this.stage, parent);
      return path;
    }
  }, {
    key: "text",
    value: function text(text, x, y, parent) {
      var text = new _shapesText2["default"](text, x, y);
      _utils2["default"].groupLogic(text, this.stage, parent);
      return text;
    }
  }, {
    key: "grid",
    value: function grid(options, parent) {
      var grid = new _grid2["default"](options);
      _utils2["default"].groupLogic(grid, this.stage, parent);
      return grid;
    }

    // Playhead
    // --------------------------------------------------

  }, {
    key: "play",
    value: function play() {
      if (this.frameRate >= 60) this.playNow();else setTimeout(_underscore2["default"].bind(this.playNow, this), 1000 / this.frameRate);
    }
  }, {
    key: "playNow",
    value: function playNow() {
      this.trigger('draw', { frameCount: this.frameCount });
      this.animationFrame = requestAnimationFrame(_underscore2["default"].bind(this.play, this));
      this.draw();
    }
  }, {
    key: "pause",
    value: function pause() {
      cancelAnimationFrame(this.animationFrame);
    }

    // Render functions
    // --------------------------------------------------

  }, {
    key: "getEl",
    value: function getEl() {
      return this.renderer.el;
    }
  }, {
    key: "appendTo",
    value: function appendTo(container) {
      container.appendChild(this.renderer.el);
      return this;
    }
  }, {
    key: "draw",
    value: function draw() {
      this.renderer.render(this.stage, { debug: this.debug });
      this.frameCount += 1;
    }
  }]);

  return Rune;
})();

_underscore2["default"].extend(Rune, _utils2["default"]);
_underscore2["default"].extend(Rune.prototype, _events2["default"]);

// Modules should be accessible through Rune
Rune.Vector = _vector2["default"];
Rune.Anchor = _anchor2["default"];
Rune.Color = _color2["default"];
Rune.Group = _group2["default"];
Rune.Grid = _grid2["default"];
Rune.Circle = _shapesCircle2["default"];
Rune.Ellipse = _shapesEllipse2["default"];
Rune.Line = _shapesLine2["default"];
Rune.Triangle = _shapesTriangle2["default"];
Rune.Path = _shapesPath2["default"];
Rune.Polygon = _shapesPolygon2["default"];
Rune.Rectangle = _shapesRectangle2["default"];
Rune.Text = _shapesText2["default"];

// Right now I need these for mixin tests.
// Rewrite so we don't need them.
Rune.Moveable = _mixins.Moveable;
Rune.Styleable = _mixins.Styleable;
Rune.Sizeable = _mixins.Sizeable;
Rune.Groupable = _mixins.Groupable;

exports["default"] = Rune;
module.exports = exports["default"];

},{"./anchor":1,"./color":2,"./events":3,"./grid":4,"./group":5,"./mixins":6,"./render":7,"./shapes/circle":9,"./shapes/ellipse":10,"./shapes/line":11,"./shapes/path":12,"./shapes/polygon":13,"./shapes/rectangle":14,"./shapes/text":15,"./shapes/triangle":16,"./utils":17,"./vector":18,"underscore":undefined}],9:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _mixins = _dereq_("../mixins");

var _ellipse = _dereq_("./ellipse");

var _ellipse2 = _interopRequireDefault(_ellipse);

var _utils = _dereq_('../utils');

var _utils2 = _interopRequireDefault(_utils);

var Circle = (function () {
  function Circle(x, y, radius) {
    _classCallCheck(this, Circle);

    this.moveable();
    this.styleable();

    this.vars.x = x;
    this.vars.y = y;
    this.vars.radius = radius;
  }

  // Should we figure out a better way to do mixins for ES6?

  _createClass(Circle, [{
    key: "toPolygon",
    value: function toPolygon(opts, parent) {
      var ellipse = new _ellipse2["default"](this.vars.x, this.vars.y, this.vars.radius * 2, this.vars.radius * 2);
      var poly = ellipse.toPolygon(opts, false);
      _utils2["default"].copyMixinVars(this, poly);
      _utils2["default"].groupLogic(poly, this.parent, parent);
      return poly;
    }
  }, {
    key: "copy",
    value: function copy(parent) {
      var copy = new Circle();
      copy.vars.radius = this.vars.radius;
      _utils2["default"].copyMixinVars(this, copy);
      _utils2["default"].groupLogic(copy, this.parent, parent);
      return copy;
    }
  }]);

  return Circle;
})();

_underscore2["default"].extend(Circle.prototype, _mixins.Moveable, _mixins.Styleable, _mixins.Groupable, { type: "circle" });

exports["default"] = Circle;
module.exports = exports["default"];

},{"../mixins":6,"../utils":17,"./ellipse":10,"underscore":undefined}],10:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _mixins = _dereq_("../mixins");

var _polygon = _dereq_('./polygon');

var _polygon2 = _interopRequireDefault(_polygon);

var _utils = _dereq_('../utils');

var _utils2 = _interopRequireDefault(_utils);

var Ellipse = (function () {
  function Ellipse(x, y, width, height) {
    _classCallCheck(this, Ellipse);

    this.moveable();
    this.sizeable();
    this.styleable();
    this.vars.x = x;
    this.vars.y = y;
    this.vars.width = width;
    this.vars.height = height;
  }

  // Should we figure out a better way to do mixins for ES6?

  _createClass(Ellipse, [{
    key: "toPolygon",
    value: function toPolygon(opts, parent) {

      var numVectors = 16;

      // if we're calculating the number of vectors based on spacing
      // find circumference and divide by spacing.
      if (opts && opts.spacing) {
        var circumference = Math.PI * (this.vars.width + this.vars.height);
        numVectors = circumference / opts.spacing;
      }

      var vectorAngle = 360 / numVectors;

      var poly = new _polygon2["default"](this.vars.x, this.vars.y);
      for (var i = 0; i < numVectors; i++) {
        var x = Math.cos(_utils2["default"].radians(i * vectorAngle)) * this.vars.width;
        var y = Math.sin(_utils2["default"].radians(i * vectorAngle)) * this.vars.height;
        poly.lineTo(x, y);
      }

      _utils2["default"].copyMixinVars(this, poly);
      _utils2["default"].groupLogic(poly, this.parent, parent);

      return poly;
    }
  }, {
    key: "copy",
    value: function copy(parent) {
      var copy = new Ellipse();
      _utils2["default"].copyMixinVars(this, copy);
      _utils2["default"].groupLogic(copy, this.parent, parent);
      return copy;
    }
  }]);

  return Ellipse;
})();

_underscore2["default"].extend(Ellipse.prototype, _mixins.Moveable, _mixins.Sizeable, _mixins.Styleable, _mixins.Groupable, { type: "ellipse" });

exports["default"] = Ellipse;
module.exports = exports["default"];

},{"../mixins":6,"../utils":17,"./polygon":13,"underscore":undefined}],11:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _mixins = _dereq_("../mixins");

var _utils = _dereq_('../utils');

var _utils2 = _interopRequireDefault(_utils);

var Line = (function () {
  function Line(x, y, x2, y2) {
    _classCallCheck(this, Line);

    this.moveable();
    this.styleable();
    this.vars.x = x;
    this.vars.y = y;
    this.vars.x2 = x2;
    this.vars.y2 = y2;
  }

  _createClass(Line, [{
    key: "copy",
    value: function copy(parent) {
      var copy = new Line();
      copy.vars.x2 = this.vars.x2;
      copy.vars.y2 = this.vars.y2;
      _utils2["default"].copyMixinVars(this, copy);
      _utils2["default"].groupLogic(copy, this.parent, parent);
      return copy;
    }
  }]);

  return Line;
})();

_underscore2["default"].extend(Line.prototype, _mixins.Moveable, _mixins.Styleable, _mixins.Groupable, { type: "line" });

exports["default"] = Line;
module.exports = exports["default"];

},{"../mixins":6,"../utils":17,"underscore":undefined}],12:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _mixins = _dereq_("../mixins");

var _anchor = _dereq_('../anchor');

var _anchor2 = _interopRequireDefault(_anchor);

var _vector = _dereq_('../vector');

var _vector2 = _interopRequireDefault(_vector);

var _polygon = _dereq_('./polygon');

var _polygon2 = _interopRequireDefault(_polygon);

var _utils = _dereq_('../utils');

var _utils2 = _interopRequireDefault(_utils);

var Path = (function () {
  function Path(x, y) {
    _classCallCheck(this, Path);

    this.moveable();
    this.styleable();
    this.vars.anchors = [];
    if (!_underscore2["default"].isUndefined(x)) this.vars.x = x;
    if (!_underscore2["default"].isUndefined(y)) this.vars.y = y;
  }

  _createClass(Path, [{
    key: "moveTo",
    value: function moveTo(x, y) {
      this.vars.anchors.push(new _anchor2["default"]().setMove(x, y));
      return this;
    }
  }, {
    key: "lineTo",
    value: function lineTo(x, y) {
      this.checkStartMove();
      this.vars.anchors.push(new _anchor2["default"]().setLine(x, y));
      return this;
    }
  }, {
    key: "curveTo",
    value: function curveTo(a, b, c, d, e, f) {
      this.checkStartMove();
      this.vars.anchors.push(new _anchor2["default"]().setCurve(a, b, c, d, e, f));
      return this;
    }
  }, {
    key: "closePath",
    value: function closePath() {
      this.checkStartMove();
      this.vars.anchors.push(new _anchor2["default"]().setClose());
      return this;
    }
  }, {
    key: "startVector",
    value: function startVector() {
      return this.vars.anchors[0] && this.vars.anchors[0].command == 'move' ? this.vars.anchors[0].vec1.copy() : new _vector2["default"](0, 0);
    }
  }, {
    key: "subpaths",
    value: function subpaths(parent) {
      var subs = [];
      var lastSplit = 0;

      _underscore2["default"].each(this.vars.anchors, function (anchor, i) {

        var isMove = anchor.command == 'move';
        var isAfterClose = this.vars.anchors[i - 1] && this.vars.anchors[i - 1].command == 'close';
        var isLast = i == this.vars.anchors.length - 1;

        if (i > lastSplit && (isMove || isAfterClose || isLast)) {
          if (isLast) i++;
          var sub = this.copy(parent);
          sub.vars.anchors = sub.vars.anchors.slice(lastSplit, i);
          subs.push(sub);
          lastSplit = i;
        }
      }, this);
      return subs;
    }
  }, {
    key: "length",
    value: function length() {

      var len = 0;
      var paths = this.subpaths(false);

      for (var p = 0; p < paths.length; p++) {

        var anchors = paths[p].vars.anchors;

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
    }
  }, {
    key: "vectorAtLength",
    value: function vectorAtLength(len) {
      var tmpLen = 0;
      var paths = this.subpaths(false);

      for (var p = 0; p < paths.length; p++) {

        var anchors = paths[p].vars.anchors;

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
            stop = new _anchor2["default"]().setLine(beginning.x, beginning.y);
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
    }
  }, {
    key: "vectorAt",
    value: function vectorAt(scalar) {
      return this.vectorAtLength(this.length() * scalar);
    }
  }, {
    key: "toPolygons",
    value: function toPolygons(opts, parent) {

      var paths = this.subpaths(false);
      var polys = [];

      // if splitting the path into vectors with equal spacing
      if (opts && opts.spacing) {

        _underscore2["default"].each(paths, function (path) {
          var poly = new _polygon2["default"](path.vars.x, path.vars.y);
          var len = path.length();
          var num = len / opts.spacing;
          for (var i = 0; i < num; i++) {
            var vec = path.vectorAtLength(i * opts.spacing);
            poly.lineTo(vec.x, vec.y);
          }

          _utils2["default"].copyMixinVars(this, poly);
          _utils2["default"].groupLogic(poly, this.parent, parent);

          polys.push(poly);
        }, this);
      }

      return polys;
    }
  }, {
    key: "copy",
    value: function copy(parent) {
      var copy = new Path();
      copy.vars.anchors = _underscore2["default"].map(this.vars.anchors, function (a) {
        return a.copy();
      });
      _utils2["default"].copyMixinVars(this, copy);
      _utils2["default"].groupLogic(copy, this.parent, parent);
      return copy;
    }
  }, {
    key: "fillRule",
    value: function fillRule(val) {
      this.vars.fillRule = val;return this;
    }

    // Paths must start with a moveTo. This function is checks if
    // there is a moveTo at the beginning, and adds one if not.
  }, {
    key: "checkStartMove",
    value: function checkStartMove() {
      if (this.vars.anchors.length == 0) {
        this.moveTo(0, 0);
      }
    }
  }]);

  return Path;
})();

_underscore2["default"].extend(Path.prototype, _mixins.Moveable, _mixins.Styleable, _mixins.Groupable, { type: "path" });

exports["default"] = Path;
module.exports = exports["default"];

},{"../anchor":1,"../mixins":6,"../utils":17,"../vector":18,"./polygon":13,"underscore":undefined}],13:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _mixins = _dereq_("../mixins");

var _vector = _dereq_('../vector');

var _vector2 = _interopRequireDefault(_vector);

var _utils = _dereq_('../utils');

var _utils2 = _interopRequireDefault(_utils);

var Polygon = (function () {
  function Polygon(x, y) {
    _classCallCheck(this, Polygon);

    this.moveable();
    this.styleable();
    this.vars.vectors = [];
    if (!_underscore2["default"].isUndefined(x)) this.vars.x = x;
    if (!_underscore2["default"].isUndefined(y)) this.vars.y = y;
  }

  _createClass(Polygon, [{
    key: "lineTo",
    value: function lineTo(x, y) {
      this.vars.vectors.push(new _vector2["default"](x, y));
      return this;
    }
  }, {
    key: "length",
    value: function length() {
      var len = 0;
      for (var i = 0; i < this.vars.vectors.length; i++) {
        var start = this.vars.vectors[i];
        var stop = this.vars.vectors[(i + 1) % this.vars.vectors.length];
        len += stop.sub(start).length();
      }
      return len;
    }
  }, {
    key: "vectorAtLength",
    value: function vectorAtLength(len) {

      var tmpLen = 0;

      for (var i = 0; i < this.vars.vectors.length; i++) {
        var start = this.vars.vectors[i];
        var stop = this.vars.vectors[(i + 1) % this.vars.vectors.length];
        var vec = stop.sub(start);
        var veclen = vec.length();

        if (tmpLen + veclen > len) {
          var remaining = len - tmpLen;
          return start.add(vec.normalize().multiply(remaining));
        }

        tmpLen += veclen;
      }

      return _underscore2["default"].first(this.vars.vectors).copy();
    }
  }, {
    key: "vectorAt",
    value: function vectorAt(scalar) {
      return this.vectorAtLength(this.length() * scalar);
    }
  }, {
    key: "bounds",
    value: function bounds() {
      var xmax = undefined;
      var ymax = undefined;
      var xmin = undefined;
      var ymin = undefined;

      _underscore2["default"].each(this.vars.vectors, function (vec) {
        if (_underscore2["default"].isUndefined(xmin) || vec.x < xmin) xmin = vec.x;
        if (_underscore2["default"].isUndefined(xmax) || vec.x > xmax) xmax = vec.x;
        if (_underscore2["default"].isUndefined(ymin) || vec.y < ymin) ymin = vec.y;
        if (_underscore2["default"].isUndefined(ymax) || vec.y > ymax) ymax = vec.y;
      });

      return {
        x: xmin,
        y: ymin,
        width: xmax - xmin,
        height: ymax - ymin
      };
    }
  }, {
    key: "centroid",
    value: function centroid() {
      var ps = this.vars.vectors;
      var areaAcc = 0.0;
      var xAcc = 0.0;
      var yAcc = 0.0;

      for (var i = 0; i < ps.length - 1; i++) {
        areaAcc += ps[i].x * ps[i + 1].y - ps[i + 1].x * ps[i].y;
        xAcc += (ps[i].x + ps[i + 1].x) * (ps[i].x * ps[i + 1].y - ps[i + 1].x * ps[i].y);
        yAcc += (ps[i].y + ps[i + 1].y) * (ps[i].x * ps[i + 1].y - ps[i + 1].x * ps[i].y);
      }

      areaAcc /= 2.0;
      var x = xAcc / (6.0 * areaAcc);
      var y = yAcc / (6.0 * areaAcc);

      return new _vector2["default"](x, y);
    }
  }, {
    key: "toPolygon",
    value: function toPolygon(opts, parent) {

      if (opts && opts.spacing) {

        var poly = new Polygon(this.vars.x, this.vars.y);
        var len = this.length();
        var num = len / opts.spacing;
        for (var i = 0; i < num; i++) {
          var vec = this.vectorAtLength(i * opts.spacing);
          poly.lineTo(vec.x, vec.y);
        }

        _utils2["default"].copyMixinVars(this, poly);
        _utils2["default"].groupLogic(poly, this.parent, parent);

        return poly;
      }

      return this;
    }
  }, {
    key: "copy",
    value: function copy(parent) {
      var copy = new Polygon();
      copy.vars.vectors = _underscore2["default"].map(this.vars.vectors, function (v) {
        return v.copy();
      });
      _utils2["default"].copyMixinVars(this, copy);
      _utils2["default"].groupLogic(copy, this.parent, parent);
      return copy;
    }
  }]);

  return Polygon;
})();

_underscore2["default"].extend(Polygon.prototype, _mixins.Moveable, _mixins.Styleable, _mixins.Groupable, { type: "polygon" });

exports["default"] = Polygon;
module.exports = exports["default"];

},{"../mixins":6,"../utils":17,"../vector":18,"underscore":undefined}],14:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _mixins = _dereq_("../mixins");

var _polygon = _dereq_('./polygon');

var _polygon2 = _interopRequireDefault(_polygon);

var _utils = _dereq_('../utils');

var _utils2 = _interopRequireDefault(_utils);

var Rectangle = (function () {
  function Rectangle(x, y, width, height) {
    _classCallCheck(this, Rectangle);

    this.moveable();
    this.sizeable();
    this.styleable();
    this.vars.x = x;
    this.vars.y = y;
    this.vars.width = width;
    this.vars.height = height;
  }

  _createClass(Rectangle, [{
    key: "toPolygon",
    value: function toPolygon(opts, parent) {
      var poly = new _polygon2["default"](this.vars.x, this.vars.y).lineTo(0, 0).lineTo(this.vars.width, 0).lineTo(this.vars.width, this.vars.height).lineTo(0, this.vars.height);

      if (opts) poly = poly.toPolygon(opts, false);

      _utils2["default"].copyMixinVars(this, poly);
      _utils2["default"].groupLogic(poly, this.parent, parent);

      return poly;
    }
  }, {
    key: "copy",
    value: function copy(parent) {
      var copy = new Rectangle();
      _utils2["default"].copyMixinVars(this, copy);
      _utils2["default"].groupLogic(copy, this.parent, parent);
      return copy;
    }
  }]);

  return Rectangle;
})();

_underscore2["default"].extend(Rectangle.prototype, _mixins.Moveable, _mixins.Sizeable, _mixins.Styleable, _mixins.Groupable, { type: "rectangle" });

exports["default"] = Rectangle;
module.exports = exports["default"];

},{"../mixins":6,"../utils":17,"./polygon":13,"underscore":undefined}],15:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _mixins = _dereq_("../mixins");

var _utils = _dereq_('../utils');

var _utils2 = _interopRequireDefault(_utils);

var Text = (function () {
  function Text(text, x, y) {
    _classCallCheck(this, Text);

    this.moveable();
    this.styleable();
    this.vars.text = text;
    this.vars.x = x;
    this.vars.y = y;
  }

  _createClass(Text, [{
    key: "toPolygon",
    value: function toPolygon() {
      throw new Error("You need the Rune.Font plugin to convert text to polygon");
    }
  }, {
    key: "textAlign",
    value: function textAlign(_textAlign) {
      this.vars.textAlign = _textAlign;return this;
    }
  }, {
    key: "fontFamily",
    value: function fontFamily(_fontFamily) {
      this.vars.fontFamily = _fontFamily;return this;
    }
  }, {
    key: "fontStyle",
    value: function fontStyle(_fontStyle) {
      this.vars.fontStyle = _fontStyle;return this;
    }
  }, {
    key: "fontWeight",
    value: function fontWeight(_fontWeight) {
      this.vars.fontWeight = _fontWeight;return this;
    }
  }, {
    key: "fontSize",
    value: function fontSize(_fontSize) {
      this.vars.fontSize = _fontSize;return this;
    }
  }, {
    key: "letterSpacing",
    value: function letterSpacing(_letterSpacing) {
      this.vars.letterSpacing = _letterSpacing;return this;
    }
  }, {
    key: "textDecoration",
    value: function textDecoration(_textDecoration) {
      this.vars.textDecoration = _textDecoration;return this;
    }
  }, {
    key: "copy",
    value: function copy(parent) {
      var copy = new Text();
      copy.vars.text = this.vars.text;
      _utils2["default"].copyMixinVars(this, copy);
      _utils2["default"].groupLogic(copy, this.parent, parent);
      return copy;
    }
  }]);

  return Text;
})();

_underscore2["default"].extend(Text.prototype, _mixins.Moveable, _mixins.Styleable, _mixins.Groupable, { type: "text" });

exports["default"] = Text;
module.exports = exports["default"];

},{"../mixins":6,"../utils":17,"underscore":undefined}],16:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _mixins = _dereq_("../mixins");

var _utils = _dereq_('../utils');

var _utils2 = _interopRequireDefault(_utils);

var Triangle = (function () {
  function Triangle(x, y, x2, y2, x3, y3) {
    _classCallCheck(this, Triangle);

    this.moveable();
    this.styleable();
    this.vars.x = x;
    this.vars.y = y;
    this.vars.x2 = x2;
    this.vars.y2 = y2;
    this.vars.x3 = x3;
    this.vars.y3 = y3;
  }

  _createClass(Triangle, [{
    key: "copy",
    value: function copy(parent) {
      var copy = new Triangle();
      copy.vars.x2 = this.vars.x2;
      copy.vars.y2 = this.vars.y2;
      copy.vars.x3 = this.vars.x3;
      copy.vars.y3 = this.vars.y3;
      _utils2["default"].copyMixinVars(this, copy);
      _utils2["default"].groupLogic(copy, this.parent, parent);
      return copy;
    }
  }]);

  return Triangle;
})();

_underscore2["default"].extend(Triangle.prototype, _mixins.Moveable, _mixins.Styleable, _mixins.Groupable, { type: "triangle" });

exports["default"] = Triangle;
module.exports = exports["default"];

},{"../mixins":6,"../utils":17,"underscore":undefined}],17:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var Utils = {

  random: function random(a, b) {
    if (_underscore2["default"].isUndefined(b)) {
      b = a;
      a = 0;
    }
    return a + Math.random() * (b - a);
  },

  degrees: function degrees(radians) {
    return radians * (180 / Math.PI);
  },

  radians: function radians(degrees) {
    return degrees * (Math.PI / 180);
  },

  groupLogic: function groupLogic(child, fallback, group) {

    if (group && group.type == "group") {
      group.add(child);
    } else if (group !== false && fallback && fallback.type == "group") {
      fallback.add(child);
    }
  },

  copyMixinVars: function copyMixinVars(a, b) {
    if (a.moveable && b.moveable) b.moveable(a);
    if (a.sizeable && b.sizeable) b.sizeable(a);
    if (a.styleable && b.styleable) b.styleable(a);
  }

};

exports["default"] = Utils;
module.exports = exports["default"];

},{"underscore":undefined}],18:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _underscore = _dereq_("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _utils = _dereq_('./utils');

var _utils2 = _interopRequireDefault(_utils);

var Vector = (function () {
  function Vector(x, y) {
    _classCallCheck(this, Vector);

    this.x = x || 0;
    this.y = y || 0;
  }

  _createClass(Vector, [{
    key: "set",
    value: function set(x, y) {
      this.x = x;
      this.y = y;
    }
  }, {
    key: "add",
    value: function add(vec) {
      return new Vector(this.x + vec.x, this.y + vec.y);
    }
  }, {
    key: "sub",
    value: function sub(vec) {
      return new Vector(this.x - vec.x, this.y - vec.y);
    }
  }, {
    key: "multiply",
    value: function multiply(scalar) {
      return new Vector(this.x * scalar, this.y * scalar);
    }
  }, {
    key: "divide",
    value: function divide(scalar) {
      var vec = new Vector(0, 0);
      if (scalar) {
        vec.x = this.x / scalar;
        vec.y = this.y / scalar;
      }
      return vec;
    }
  }, {
    key: "distance",
    value: function distance(vec) {
      return Math.sqrt(this.distanceSquared(vec));
    }
  }, {
    key: "distanceSquared",
    value: function distanceSquared(vec) {
      var dx = this.x - vec.x;
      var dy = this.y - vec.y;
      return dx * dx + dy * dy;
    }
  }, {
    key: "lerp",
    value: function lerp(vec, scalar) {
      var x = (vec.x - this.x) * scalar + this.x;
      var y = (vec.y - this.y) * scalar + this.y;
      return new Vector(x, y);
    }
  }, {
    key: "dot",
    value: function dot(vec) {
      return this.x * vec.x + this.y * vec.y;
    }
  }, {
    key: "length",
    value: function length() {
      return Math.sqrt(this.lengthSquared());
    }
  }, {
    key: "lengthSquared",
    value: function lengthSquared() {
      return this.x * this.x + this.y * this.y;
    }
  }, {
    key: "normalize",
    value: function normalize() {
      return this.divide(this.length());
    }
  }, {
    key: "rotation",
    value: function rotation() {
      return _utils2["default"].degrees(Math.atan2(this.y, this.x));
    }
  }, {
    key: "rotate",
    value: function rotate(degrees) {
      var rad = _utils2["default"].radians(this.rotation() + degrees);
      var len = this.length();
      var x = Math.cos(rad) * len;
      var y = Math.sin(rad) * len;
      return new Vector(x, y);
    }
  }, {
    key: "copy",
    value: function copy() {
      return new Vector(this.x, this.y);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "(x: " + this.x + ", y: " + this.y + ")";
    }
  }]);

  return Vector;
})();

exports["default"] = Vector;
module.exports = exports["default"];

},{"./utils":17,"underscore":undefined}]},{},[8])(8)
});


//# sourceMappingURL=rune.node.js.map