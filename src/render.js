var flatten = require("lodash/array/flatten");
var each = require("lodash/collection/each");
var map = require("lodash/collection/map");
var Circle = require('./shapes/circle');
var Rectangle = require('./shapes/rectangle');
var Line = require('./shapes/line');

Render.prototype = {

  // Shape converters
  // --------------------------------------------------

  pathToSVG: function(path, opts) {
    var attr = {};
    this.dAttribute(path, attr);
    this.moveableAttributes(attr, path);
    this.styleableAttributes(path, attr);
    this.optionalAttributes(path, attr, {
      "fillRule" : "fill-rule"
    });

    var els = [
      svg('path', attr)
    ];

    if(opts && opts.debug) els = els.concat(this.debugPathToSVG(path));
    return els;
  },

  textToSVG: function(text, opts) {
    var attr = {
      x: Utils.s(text.vars.x),
      y: Utils.s(text.vars.y),
    }
    this.moveableAttributes(attr, text);
    this.styleableAttributes(text, attr);

    // attributes that need specific handling
    if(text.vars.textAlign) {
      var translate = { "left":"start", "center":"middle", "right":"end" };
      attr["text-anchor"] = translate[text.vars.textAlign];
    }

    this.optionalAttributes(text, attr, {
      "fontFamily" : "font-family",
      "textAlign" : "text-align",
      "fontStyle" : "font-style",
      "fontWeight" : "font-weight",
      "fontSize" : "font-size",
      "letterSpacing" : "letter-spacing",
      "textDecoration" : "text-decoration"
    });

    if(text.vars.textAlign) {
      var translate = { "left":"start", "center":"middle", "right":"end" };
      attr["text-anchor"] = translate[text.vars.textAlign];
    }

    return svg('text', attr, text.vars.text);
  },

  imageToSVG: function(img) {
    var attr = {
      "xlink:href" : Utils.s(img.vars.url),
      x: Utils.s(img.vars.x),
      y: Utils.s(img.vars.y)
    }
    this.optionalAttributes(img, attr, {
      "width" : "width",
      "height" : "height"
    });
    this.moveableAttributes(attr, img);
    return svg('image', attr);
  },

  groupToSVG: function(group, opts) {
    if(!group.children || group.children.length == 0) return;
    var attr = {}
    this.moveableAttributes(attr, group);
    return svg('g', attr, this.objectsToSVG(group.children, opts));
  },

  gridToSVG: function(grid, opts) {
    var attr = {}
    this.moveableAttributes(attr, grid);
    var groups = this.objectsToSVG(grid.modules);
    if(opts && opts.debug) groups = groups.concat(this.debugGridToSVG(grid));

    return svg('g', attr, flatten(groups, true));
  },

  // Multiple attributes
  // --------------------------------------------------

  optionalAttributes: function(object, attr, keys) {
    each(keys, function(attribute, variable) {
      if(object.vars[variable]) {
        attr[attribute] = Utils.s(object.vars[variable]);
      }
    }, this);
  },

  // Single attributes
  // --------------------------------------------------

  dAttribute: function(object, attr) {
    attr.d = map(object.vars.anchors, function(a) {
      if(a.command == 'move') {
        return "M " + a.vec1.x + " " + a.vec1.y;
      }
      else if(a.command == 'line') {
        return "L " + a.vec1.x + " " + a.vec1.y;
      }
      else if(a.command == 'cubic'){
        return "C " + a.vec1.x + " " + a.vec1.y + " " + a.vec2.x + " " + a.vec2.y + " " + a.vec3.x + " " + a.vec3.y;
      }
      else if(a.command == 'quad' && typeof a.vec2 !== 'undefined') {
        return "Q " + a.vec1.x + " " + a.vec1.y + " " + a.vec2.x + " " + a.vec2.y;
      }
      else if(a.command == 'quad'){
        return "T " + a.vec1.x + " " + a.vec1.y;
      }
      else if(a.command == 'close'){
        return "Z";
      }
    }).join(" ").trim();
  },

  // Debug
  // --------------------------------------------------

  debugPathToSVG: function(path) {

    var t = this;
    var els = [];

    each(path.vars.anchors, function(a, i) {
      if(a.command == 'cubic'){
        els.push(t.debugLine(path.vars.x + a.vec1.x, path.vars.y + a.vec1.y, path.vars.x + a.vec3.x, path.vars.y + a.vec3.y));
        els.push(t.debugLine(path.vars.x + a.vec2.x, path.vars.y + a.vec2.y, path.vars.x + a.vec3.x, path.vars.y + a.vec3.y));
        for(var i = 1; i < 4; i++) {
          els.push(t.debugCircle(path.vars.x + a["vec"+i].x, path.vars.y + a["vec"+i].y))
        }
      }
      else if(a.command == 'quad' && typeof a.vec2 !== 'undefined') {
        els.push(t.debugLine(path.vars.x + a.vec1.x, path.vars.y + a.vec1.y, path.vars.x + a.vec2.x, path.vars.y + a.vec2.y));
        for(var i = 1; i < 3; i++) {
          els.push(t.debugCircle(path.vars.x + a["vec"+i].x, path.vars.y + a["vec"+i].y))
        }
      }
    });

    return els;
  },

  debugGridToSVG: function(grid) {

    var t = this;
    var els = [];

    // draw container rect
    els.push(this.debugRect(0, 0, grid.vars.width, grid.vars.height));

    // draw lines for columns
    var x = 0;
    for(var i = 0; i < grid.vars.columns-1; i++) {
      x += grid.vars.moduleWidth;
      els.push(this.debugLine(x, 0, x, grid.vars.height));
      x += grid.vars.gutterWidth;
      els.push(this.debugLine(x, 0, x, grid.vars.height));
    }

    // draw lines for rows
    var y = 0;
    for(var i = 0; i < grid.vars.rows-1; i++) {
      y += grid.vars.moduleHeight;
      els.push(this.debugLine(0, y, grid.vars.width, y));
      y += grid.vars.gutterHeight;
      els.push(this.debugLine(0, y, grid.vars.width, y));
    }

    return els;
  },

  debugCircle: function(x, y) {
    var c = new Circle(x, y, 4)
      .fill(212, 18, 229)
      .stroke(false);
    return this.circleToSVG(c);
  },

  debugRect: function(x, y, width, height) {
    var r = new Rectangle(x, y, width, height)
      .stroke(212, 18, 229).fill(false);
    return this.rectangleToSVG(r);
  },

  debugLine: function(x1, y1, x2, y2) {
    var l = new Line(x1, y1, x2, y2)
      .stroke(212, 18, 229);
    return this.lineToSVG(l);
  },

  // Helpers
  // --------------------------------------------------



}

module.exports = Render;
