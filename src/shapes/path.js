import _ from "underscore"
import { Shapeable, Moveable, Styleable } from "../mixins"
import Anchor from '../anchor'
import Vector from '../vector'
import polygon from './polygon'

class Path {

  constructor(x, y) {
    this.moveable();
    this.styleable();
    this.vars.anchors = [];
    if(!_.isUndefined(x)) this.vars.x = x;
    if(!_.isUndefined(y)) this.vars.y = y;
  }

  moveTo(x, y, relative) {
    this.vars.anchors.push(new Anchor().setMove(x, y, relative));
    return this;
  }

  lineTo(x, y, relative) {
    this.checkStartMove();
    this.vars.anchors.push(new Anchor().setLine(x, y, relative));
    return this;
  }

  curveTo(a, b, c, d, e, f, g) {
    this.checkStartMove();
    this.vars.anchors.push(new Anchor().setCurve(a, b, c, d, e, f, g));
    return this;
  }

  closePath() {
    this.checkStartMove();
    this.vars.anchors.push(new Anchor().setClose());
    return this;
  }

  startVector() {
    return this.vars.anchors[0] && this.vars.anchors[0].command == 'move' ? this.vars.anchors[0].vec1.copy() : new Vector(0, 0);
  }

  subpaths() {
    var subs = [];
    var lastSplit = 0;

    _.each(this.vars.anchors, function(anchor, i) {

      var isMove = anchor.command == 'move';
      var isAfterClose = this.vars.anchors[i-1] && this.vars.anchors[i-1].command == 'close'
      var isLast = i == this.vars.anchors.length-1;

      if(i > lastSplit && (isMove || isAfterClose || isLast)) {
        if(isLast) i++;
        var sub = this.copy(false);
        sub.vars.anchors = sub.vars.anchors.slice(lastSplit, i);
        subs.push(sub);
        lastSplit = i;
      }
    }, this);
    return subs;
  }

  length() {

    var len = 0;
    var paths = this.subpaths();

    for(var p = 0; p < paths.length; p++) {

      var anchors = paths[p].vars.anchors;

      // find length of all anchors in subpath.
      // if last stop is close, use beginning
      for(var i = 0; i < anchors.length-1; i++) {
        var start = anchors[i];
        var startVec = start.vec3 || start.vec2 || start.vec1;
        var stop = anchors[i+1];

        // if stop is a close command, replace close anchor
        // with vector of first point in path.
        if(stop.command == 'close') {
          stop = paths[p].startVector();
        }

        var rel = stop.sub(startVec);
        len += rel.length()
      }
    }

    return len;
  }

  vectorAtLength(len) {
    var tmpLen = 0;
    var paths = this.subpaths();

    for(var p = 0; p < paths.length; p++) {

      var anchors = paths[p].vars.anchors;

      // find length of all anchors in subpath.
      // if last stop is close, use beginning
      for(var i = 0; i < anchors.length-1; i++) {
        var start = anchors[i];
        var startVec = start.vec3 || start.vec2 || start.vec1;
        var stop = anchors[i+1];

        // if stop is a close command, replace close anchor
        // with vector of first point in path.
        if(stop.command == 'close') {
          var beginning = paths[p].startVector();
          stop = new Anchor().setLine(beginning.x, beginning.y)
        }

        var vec = stop.sub(startVec)
        var veclen = vec.length();

        if(tmpLen + veclen > len) {
          var remaining = len - tmpLen;
          return startVec.add(vec.vectorAt(remaining / veclen));
        }

        tmpLen += veclen;
      }
    }

    return this.startVector();
  }

  vectorAt(scalar) {
    return this.vectorAtLength(this.length() * scalar);
  }

  toPolygons(opts) {

    // use subpaths!!!

    // if splitting the path into vectors with equal spacing
    //if(opts && opts.spacing) {
//
    //  var poly = new Polygon(this.vars.x, this.vars.y);
    //  var len = this.length();
    //  var num = len / opts.spacing;
    //  for(var i = 0; i < num; i++) {
    //    var vec = this.vectorAtLength(i * opts.spacing);
    //    poly.lineTo(vec.x, vec.y)
    //  }
    //  return poly;
    //}
//
    //return this;

  }

  copy(group) {
    var s = new Path();
    s.vars.anchors = _.map(this.vars.anchors, function(a) { return a.copy(); });
    this.shapeCopy(s, group);
    return s;
  }

  fillRule(val) { this.vars.fillRule = val; return this; }

  // Paths must start with a moveTo. This function is checks if
  // there is a moveTo at the beginning, and adds one if not.
  checkStartMove() {
    if(this.vars.anchors.length == 0) {
      this.moveTo(0, 0);
    }
  }

}

_.extend(Path.prototype, Shapeable, Moveable, Styleable, { type: "path"});

export default Path;