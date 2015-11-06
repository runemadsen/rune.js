import assign from "lodash/object/assign"
import each from "lodash/collection/each"
import map from "lodash/collection/map"
import flatten from "lodash/array/flatten"
import { Moveable, Styleable } from "../mixins"
import Vector from '../vector'
import Utils from '../utils'

class Polygon {

  constructor(x, y) {
    this.moveable();
    this.styleable();
    this.vars.vectors = [];
    if(typeof x !== 'undefined') this.vars.x = x;
    if(typeof y !== 'undefined') this.vars.y = y;
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

    return this.vars.vectors[0].copy();
  }

  vectorAt(scalar) {
    return this.vectorAtLength(this.length() * scalar);
  }

  bounds() {
    var xmax = undefined;
    var ymax = undefined;
    var xmin = undefined;
    var ymin = undefined;

    each(this.vars.vectors, function(vec) {
      if(typeof xmin === 'undefined' || vec.x < xmin)  xmin = vec.x;
      if(typeof xmax === 'undefined' || vec.x > xmax)  xmax = vec.x;
      if(typeof ymin === 'undefined' || vec.y < ymin)  ymin = vec.y;
      if(typeof ymax === 'undefined' || vec.y > ymax)  ymax = vec.y;
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
    copy.vars.vectors = map(this.vars.vectors, function(v) { return v.copy(); });
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }

  // Code from ContainsPoint function here:
  // http://polyk.ivank.net
  contains(x, y) {

    // get stage position
    var addPos = this.stagepos();

    // map array of vectors to flat array of xy numbers
    // This might be slow, so let's rewrite this at some point.


    var p = flatten(map(this.vars.vectors, function(vector) {
      return [addPos.x + vector.x, addPos.y + vector.y]
    }, this));

    var n = p.length>>1;
		var ax, ay = p[2*n-3]-y, bx = p[2*n-2]-x, by = p[2*n-1]-y;

		var lup;
		for(var i=0; i<n; i++)
		{
			ax = bx;  ay = by;
			bx = p[2*i  ] - x;
			by = p[2*i+1] - y;
			if(ay==by) continue;
			lup = by>ay;
		}

		var depth = 0;
		for(var i=0; i<n; i++)
		{
			ax = bx;  ay = by;
			bx = p[2*i  ] - x;
			by = p[2*i+1] - y;
			if(ay< 0 && by< 0) continue;	// both "up" or both "down"
			if(ay> 0 && by> 0) continue;	// both "up" or both "down"
			if(ax< 0 && bx< 0) continue; 	// both points on the left

			if(ay==by && Math.min(ax,bx)<=0) return true;
			if(ay==by) continue;

			var lx = ax + (bx-ax)*(-ay)/(by-ay);
			if(lx==0) return true;			// point on edge
			if(lx> 0) depth++;
			if(ay==0 &&  lup && by>ay) depth--;	// hit vertex, both up
			if(ay==0 && !lup && by<ay) depth--; // hit vertex, both down
			lup = by>ay;
		}

		return (depth & 1) == 1;
  }
}

assign(Polygon.prototype, Moveable, Styleable, { type: "polygon" });

export default Polygon;
