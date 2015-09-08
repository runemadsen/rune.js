import _ from "underscore"
import { Moveable, Styleable, Groupable } from "../mixins"
import Vector from '../vector'
import Utils from '../utils'

class Polygon {

  constructor(x, y) {
    this.moveable();
    this.styleable();
    this.vars.vectors = [];
    if(!_.isUndefined(x)) this.vars.x = x;
    if(!_.isUndefined(y)) this.vars.y = y;
  }

  lineTo(x, y) {
    this.vars.vectors.push(new Vector(x, y));
    return this;
  }

  length() {
    var len = 0;
    for(var i = 0; i < this.vars.vectors.length; i++) {
      var start = this.vars.vectors[i];
      var stop = this.vars.vectors[(i+1)%this.vars.vectors.length];
      len += stop.sub(start).length();
    }
    return len;
  }

  vectorAtLength(len) {

    var tmpLen = 0;

    for(var i = 0; i < this.vars.vectors.length; i++) {
      var start = this.vars.vectors[i];
      var stop = this.vars.vectors[(i+1)%this.vars.vectors.length];
      var vec = stop.sub(start);
      var veclen = vec.length();

      if(tmpLen + veclen > len) {
        var remaining = len - tmpLen;
        return start.add(vec.normalize().multiply(remaining));
      }

      tmpLen += veclen;
    }

    return _.first(this.vars.vectors).copy();
  }

  vectorAt(scalar) {
    return this.vectorAtLength(this.length() * scalar);
  }

  bounds() {
    var xmax = undefined;
    var ymax = undefined;
    var xmin = undefined;
    var ymin = undefined;

    _.each(this.vars.vectors, function(vec) {
      if(_.isUndefined(xmin) || vec.x < xmin)  xmin = vec.x;
      if(_.isUndefined(xmax) || vec.x > xmax)  xmax = vec.x;
      if(_.isUndefined(ymin) || vec.y < ymin)  ymin = vec.y;
      if(_.isUndefined(ymax) || vec.y > ymax)  ymax = vec.y;
    });

    return {
      x: xmin,
      y: ymin,
      width: xmax - xmin,
      height: ymax - ymin
    };
  }

  centroid() {
    var ps = this.vars.vectors;
    var areaAcc = 0.0;
    var xAcc = 0.0;
    var yAcc = 0.0;

    for(var i = 0; i < ps.length-1; i++)
    {
      areaAcc += ps[i].x * ps[i+1].y - ps[i+1].x * ps[i].y;
      xAcc += (ps[i].x + ps[i+1].x) * (ps[i].x * ps[i+1].y - ps[i+1].x * ps[i].y);
      yAcc += (ps[i].y + ps[i+1].y) * (ps[i].x * ps[i+1].y - ps[i+1].x * ps[i].y);
    }

    areaAcc /= 2.0;
    var x = xAcc/(6.0*areaAcc);
    var y = yAcc/(6.0*areaAcc);

    return new Vector(x, y);
  }

  toPolygon(opts, parent) {

    if(opts && opts.spacing) {

      var poly = new Polygon(this.vars.x, this.vars.y);
      var len = this.length();
      var num = len / opts.spacing;
      for(var i = 0; i < num; i++) {
        var vec = this.vectorAtLength(i * opts.spacing);
        poly.lineTo(vec.x, vec.y)
      }

      Utils.copyMixinVars(this, poly);
      Utils.groupLogic(poly, this.parent, parent);

      return poly;
    }

    return this;
  }

  copy(parent) {
    var copy = new Polygon();
    copy.vars.vectors = _.map(this.vars.vectors, function(v) { return v.copy(); });
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }
}

_.extend(Polygon.prototype, Moveable, Styleable, Groupable, { type: "polygon" });

export default Polygon;
