// This code was adapted from the brillinat color-js by harthur
// See more here: https://github.com/harthur/color
import _ from "underscore";
import colorConvert from 'color-convert';
import colorString from 'color-string';

class Color {

  constructor(a, b, c, d, e) {

    this.values = {
      rgb: [0, 0, 0],
      hsl: [0, 0, 0],
      hsv: [0, 0, 0],
      hwb: [0, 0, 0],
      cmyk: [0, 0, 0, 0],
      alpha: 1
    }

    // COLOR
    if(a instanceof Color) {
      return a;
    }

    // HSB
    else if(a == 'hsv') {
      this.setValues('hsv', {h:b % 360, s:c, v:d});
      if(e) this.setValues('alpha', e);
    }

    // HEX
    else if(_.isString(a)) {
      var vals = colorString.getRgba(a);
      if (vals)                             this.setValues('rgb', vals);
      else if (vals = colorString.getHsla(a))  this.setValues('hsl', vals);
      else if(vals = colorString.getHwb(a))    this.setValues('hwb', vals);
      else throw new Error("Unable to parse color from string \"" + a + "\"");
      if(b) this.setValues('alpha', b);
    }

    // GRAYSCALE
    else if(_.isUndefined(c)) {
      this.setValues('rgb', {r:a, g:a, b:a});
      if(b) this.setValues('alpha', b);
    }

    // RGB
    else if(!_.isUndefined(a)) {
      this.setValues('rgb', {r:a, g:b, b:c});
      if(d) this.setValues('alpha', d);
    }

  }

  rgb(vals) {
    return this.setSpace("rgb", arguments);
  }

  hsl(vals) {
    return this.setSpace("hsl", arguments);
  }

  hsv(vals) {
    return this.setSpace("hsv", arguments);
  }

  hwb(vals) {
    return this.setSpace("hwb", arguments);
  }

  cmyk(vals) {
    return this.setSpace("cmyk", arguments);
  }

  rgbArray() {
    return this.values.rgb;
  }

  hslArray() {
    return this.values.hsl;
  }

  hsvArray() {
    return this.values.hsv;
  }

  hwbArray() {
    if (this.values.alpha !== 1) {
      return this.values.hwb.concat([this.values.alpha])
    }
    return this.values.hwb;
  }

  cmykArray() {
    return this.values.cmyk;
  }

  rgbaArray() {
    var rgb = this.values.rgb;
    return rgb.concat([this.values.alpha]);
  }

  hslaArray() {
    var hsl = this.values.hsl;
    return hsl.concat([this.values.alpha]);
  }

  alpha(val) {
    if (val === undefined) {
       return this.values.alpha;
    }
    this.setValues("alpha", val);
    return this;
  }

  red(val) {
    return this.setChannel("rgb", 0, val);
  }

  green(val) {
    return this.setChannel("rgb", 1, val);
  }

  blue(val) {
    return this.setChannel("rgb", 2, val);
  }

  hue(val) {
    return this.setChannel("hsl", 0, val);
  }

  saturation(val) {
    return this.setChannel("hsl", 1, val);
  }

  lightness(val) {
    return this.setChannel("hsl", 2, val);
  }

  saturationv(val) {
    return this.setChannel("hsv", 1, val);
  }

  whiteness(val) {
    return this.setChannel("hwb", 1, val);
  }

  blackness(val) {
    return this.setChannel("hwb", 2, val);
  }

  value(val) {
    return this.setChannel("hsv", 2, val);
  }

  cyan(val) {
    return this.setChannel("cmyk", 0, val);
  }

  magenta(val) {
    return this.setChannel("cmyk", 1, val);
  }

  yellow(val) {
    return this.setChannel("cmyk", 2, val);
  }

  black(val) {
    return this.setChannel("cmyk", 3, val);
  }

  hexString() {
    return colorString.hexString(this.values.rgb);
  }

  rgbString() {
    return colorString.rgbString(this.values.rgb, this.values.alpha);
  }

  rgbaString() {
    return colorString.rgbaString(this.values.rgb, this.values.alpha);
  }

  percentString() {
    return colorString.percentString(this.values.rgb, this.values.alpha);
  }

  hslString() {
    return colorString.hslString(this.values.hsl, this.values.alpha);
  }

  hslaString() {
    return colorString.hslaString(this.values.hsl, this.values.alpha);
  }

  hwbString() {
    return colorString.hwbString(this.values.hwb, this.values.alpha);
  }

  keyword() {
    return colorString.keyword(this.values.rgb, this.values.alpha);
  }

  rgbNumber() {
    return (this.values.rgb[0] << 16) | (this.values.rgb[1] << 8) | this.values.rgb[2];
  }

  luminosity() {
    // http://www.w3.org/TR/WCAG20/#relativeluminancedef
    var rgb = this.values.rgb;
    var lum = [];
    for (var i = 0; i < rgb.length; i++) {
      var chan = rgb[i] / 255;
      lum[i] = (chan <= 0.03928) ? chan / 12.92
                : Math.pow(((chan + 0.055) / 1.055), 2.4)
    }
    return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
  }

  contrast(color2) {
    // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
    var lum1 = this.luminosity();
    var lum2 = color2.luminosity();
    if (lum1 > lum2) {
       return (lum1 + 0.05) / (lum2 + 0.05)
    };
    return (lum2 + 0.05) / (lum1 + 0.05);
  }

  level(color2) {
    var contrastRatio = this.contrast(color2);
    return (contrastRatio >= 7.1)
      ? 'AAA'
      : (contrastRatio >= 4.5)
       ? 'AA'
       : '';
  }

  dark() {
    // YIQ equation from http://24ways.org/2010/calculating-color-contrast
    var rgb = this.values.rgb,
        yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return yiq < 128;
  }

  light() {
    return !this.dark();
  }

  negate() {
    var rgb = []
    for (var i = 0; i < 3; i++) {
       rgb[i] = 255 - this.values.rgb[i];
    }
    this.setValues("rgb", rgb);
    return this;
  }

  lighten(ratio) {
    this.values.hsl[2] += this.values.hsl[2] * ratio;
    this.setValues("hsl", this.values.hsl);
    return this;
  }

  darken(ratio) {
    this.values.hsl[2] -= this.values.hsl[2] * ratio;
    this.setValues("hsl", this.values.hsl);
    return this;
  }

  saturate(ratio) {
    this.values.hsl[1] += this.values.hsl[1] * ratio;
    this.setValues("hsl", this.values.hsl);
    return this;
  }

  desaturate(ratio) {
    this.values.hsl[1] -= this.values.hsl[1] * ratio;
    this.setValues("hsl", this.values.hsl);
    return this;
  }

  whiten(ratio) {
    this.values.hwb[1] += this.values.hwb[1] * ratio;
    this.setValues("hwb", this.values.hwb);
    return this;
  }

  blacken(ratio) {
    this.values.hwb[2] += this.values.hwb[2] * ratio;
    this.setValues("hwb", this.values.hwb);
    return this;
  }

  greyscale() {
    var rgb = this.values.rgb;
    // http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
    var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
    this.setValues("rgb", [val, val, val]);
    return this;
  }

  clearer(ratio) {
    this.setValues("alpha", this.values.alpha - (this.values.alpha * ratio));
    return this;
  }

  opaquer(ratio) {
    this.setValues("alpha", this.values.alpha + (this.values.alpha * ratio));
    return this;
  }

  rotate(degrees) {
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
  mix(mixinColor, weight) {
    var color1 = this;
    var color2 = mixinColor;
    var p = weight !== undefined ? weight : 0.5;

    var w = 2 * p - 1;
    var a = color1.alpha() - color2.alpha();

    var w1 = (((w * a == -1) ? w : (w + a)/(1 + w*a)) + 1) / 2.0;
    var w2 = 1 - w1;

    return this
      .rgb(
        w1 * color1.red() + w2 * color2.red(),
        w1 * color1.green() + w2 * color2.green(),
        w1 * color1.blue() + w2 * color2.blue()
      )
      .alpha(color1.alpha() * p + color2.alpha() * (1 - p));
  }

  toJSON() {
    return this.rgb();
  }

  copy() {
    return new Color().rgb(this.rgb());
  }

  getValues(space) {
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

  setValues(space, vals) {

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
    }
    else if (vals.length) {
      // [10, 10, 10]
      this.values[space] = vals.slice(0, space.length);
      alpha = vals[space.length];
    }
    else if (vals[space.charAt(0)] !== undefined) {
      // {r: 10, g: 10, b: 10}
      for (var i = 0; i < space.length; i++) {
        this.values[space][i] = vals[space.charAt(i)];
      }
      alpha = vals.a;
    }
    else if (vals[spaces[space][0]] !== undefined) {
      // {red: 10, green: 10, blue: 10}
      var chans = spaces[space];
      for (var i = 0; i < space.length; i++) {
        this.values[space][i] = vals[chans[i]];
      }
      alpha = vals.alpha;
    }
    this.values.alpha = Math.max(0, Math.min(1, (alpha !== undefined ? alpha : this.values.alpha) ));
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
        this.values[sname] = colorConvert[space][sname](this.values[space])
      }

      // cap values
      for (var i = 0; i < sname.length; i++) {
        var capped = Math.max(0, Math.min(maxes[sname][i], this.values[sname][i]));
        this.values[sname][i] = Math.round(capped);
      }
    }
    return true;
  }

  setSpace(space, args) {
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

  setChannel(space, index, val) {
    if (val === undefined) {
      // color.red()
      return this.values[space][index];
    }
    // color.red(100)
    this.values[space][index] = val;
    this.setValues(space, this.values[space]);
    return this;
  }

}

// Modules should be accessible through Color
Color.Convert = colorConvert;

export default Color;