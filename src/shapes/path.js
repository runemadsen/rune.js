var assign = require('object-assign');
var Shape = require('../mixins/shape');
var Styles = require('../mixins/styles');
var Anchor = require('../anchor');
var Vector = require('../vector');
var Polygon = require('./polygon');
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

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
