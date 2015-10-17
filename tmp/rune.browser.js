(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Rune = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
  A javascript Bezier curve library by Pomax.

  Based on http://pomax.github.io/bezierinfo

  This code is MIT licensed.
**/
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
    map: function(v, ds,de, ts,te) {
      var d1 = de-ds, d2 = te-ts, v2 =  v-ds, r = v2/d1;
      return ts + d2*r;
    },
    lerp: function(r, v1, v2) {
      var ret = {
        x: v1.x + r*(v2.x-v1.x),
        y: v1.y + r*(v2.y-v1.y)
      };
      if(!!v1.z && !!v2.z) {
        ret.z =  v1.z + r*(v2.z-v1.z);
      }
      return ret;
    },
    pointToString: function(p) {
      var s = p.x+"/"+p.y;
      if(typeof p.z !== "undefined") {
        s += "/"+p.z;
      }
      return s;
    },
    pointsToString: function(points) {
      return "[" + points.map(this.pointToString).join(", ") + "]";
    },
    copy: function(obj) {
      return JSON.parse(JSON.stringify(obj));
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
    lli8: function(x1,y1,x2,y2,x3,y3,x4,y4) {
      var nx=(x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4),
          ny=(x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4),
          d=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
      if(d==0) { return false; }
      return { x: nx/d, y: ny/d };
    },
    lli4: function(p1,p2,p3,p4) {
      var x1 = p1.x, y1 = p1.y,
          x2 = p2.x, y2 = p2.y,
          x3 = p3.x, y3 = p3.y,
          x4 = p4.x, y4 = p4.y;
      return this.lli8(x1,y1,x2,y2,x3,y3,x4,y4);
    },
    lli: function(v1, v2) {
      return this.lli4(v1,v1.c,v2,v2.c);
    },
    makeline: function(p1,p2) {
      var x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y, dx = (x2-x1)/3, dy = (y2-y1)/3;
      return new Bezier(x1, y1, x1+dx, y1+dy, x1+2*dx, y1+2*dy, x2, y2);
    },
    findbbox: function(sections) {
      var mx=99999999,my=mx,MX=-mx,MY=MX;
      sections.forEach(function(s) {
        var bbox = s.bbox();
        if(mx > bbox.x.min) mx = bbox.x.min;
        if(my > bbox.y.min) my = bbox.y.min;
        if(MX < bbox.x.max) MX = bbox.x.max;
        if(MY < bbox.y.max) MY = bbox.y.max;
      });
      return {
        x: { min: mx, mid:(mx+MX)/2, max: MX, size:MX-mx },
        y: { min: my, mid:(my+MY)/2, max: MY, size:MY-my }
      }
    },
    shapeintersections: function(s1, bbox1, s2, bbox2) {
      if(!this.bboxoverlap(bbox1, bbox2)) return [];
      var intersections = [];
      var a1 = [s1.startcap, s1.forward, s1.back, s1.endcap];
      var a2 = [s2.startcap, s2.forward, s2.back, s2.endcap];
      a1.forEach(function(l1) {
        if(l1.virtual) return;
        a2.forEach(function(l2) {
          if(l2.virtual) return;
          var iss = l1.intersects(l2);
          if(iss.length>0) {
            iss.c1 = l1;
            iss.c2 = l2;
            iss.s1 = s1;
            iss.s2 = s2;
            intersections.push(iss);
          }
        });
      });
      return intersections;
    },
    makeshape: function(forward, back) {
      var bpl = back.points.length;
      var fpl = forward.points.length;
      var start  = this.makeline(back.points[bpl-1], forward.points[0]);
      var end    = this.makeline(forward.points[fpl-1], back.points[0]);
      var shape  = {
        startcap: start,
        forward: forward,
        back: back,
        endcap: end,
        bbox: this.findbbox([start, forward, back, end])
      };
      var self = this;
      shape.intersections = function(s2) {
        return self.shapeintersections(shape,shape.bbox,s2,s2.bbox);
      };
      return shape;
    },
    getminmax: function(curve, d, list) {
      if(!list) return { min:0, max:0 };
      var min=0xFFFFFFFFFFFFFFFF, max=-min,t,c;
      if(list.indexOf(0)===-1) { list = [0].concat(list); }
      if(list.indexOf(1)===-1) { list.push(1); }
      for(var i=0,len=list.length; i<len; i++) {
        t = list[i];
        c = curve.get(t);
        if(c[d] < min) { min = c[d]; }
        if(c[d] > max) { max = c[d]; }
      }
      return { min:min, mid:(min+max)/2, max:max, size:max-min };
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
    },
    roots: function(points, line) {
      line = line || {p1:{x:0,y:0},p2:{x:1,y:0}};
      var order = points.length - 1;
      var p = this.align(points, line);
      var reduce = function(t) { return 0<=t && t <=1; };

      if (order === 2) {
        var a = p[0].y,
            b = p[1].y,
            c = p[2].y,
            d = a - 2*b + c;
        if(d!==0) {
          var m1 = -sqrt(b*b-a*c),
              m2 = -a+b,
              v1 = -( m1+m2)/d,
              v2 = -(-m1+m2)/d;
          return [v1, v2].filter(reduce);
        }
        else if(b!==c && d===0) {
          return [ (2*b-c)/2*(b-c) ].filter(reduce);
        }
        return [];
      }

      // see http://www.trans4mind.com/personal_development/mathematics/polynomials/cubicAlgebra.htm
      var pa = p[0].y,
          pb = p[1].y,
          pc = p[2].y,
          pd = p[3].y,
          d = (-pa + 3*pb - 3*pc + pd),
          a = (3*pa - 6*pb + 3*pc) / d,
          b = (-3*pa + 3*pb) / d,
          c = pa / d,
          p = (3*b - a*a)/3,
          p3 = p/3,
          q = (2*a*a*a - 9*a*b + 27*c)/27,
          q2 = q/2,
          discriminant = q2*q2 + p3*p3*p3,
          u1,v1,x1,x2,x3;
       if (discriminant < 0) {
        var mp3 = -p/3,
            mp33 = mp3*mp3*mp3,
            r = sqrt( mp33 ),
            t = -q/(2*r),
            cosphi = t<-1 ? -1 : t>1 ? 1 : t,
            phi = acos(cosphi),
            crtr = crt(r),
            t1 = 2*crtr;
        x1 = t1 * cos(phi/3) - a/3;
        x2 = t1 * cos((phi+tau)/3) - a/3;
        x3 = t1 * cos((phi+2*tau)/3) - a/3;
        return [x1, x2, x3].filter(reduce);
      } else if(discriminant === 0) {
        u1 = q2 < 0 ? crt(-q2) : -crt(q2);
        x1 = 2*u1-a/3;
        x2 = -u1 - a/3;
        return [x1,x2].filter(reduce);
      } else {
        var sd = sqrt(discriminant);
        u1 = crt(-q2+sd);
        v1 = crt(q2+sd);
        return [u1-v1-a/3].filter(reduce);;
      }
    },
    droots: function(p) {
      // quadratic roots are easy
      if(p.length === 3) {
        var a = p[0],
            b = p[1],
            c = p[2],
            d = a - 2*b + c;
        if(d!==0) {
          var m1 = -sqrt(b*b-a*c),
              m2 = -a+b,
              v1 = -( m1+m2)/d,
              v2 = -(-m1+m2)/d;
          return [v1, v2];
        }
        else if(b!==c && d===0) {
          return [ (2*b-c)/(2*(b-c)) ];
        }
        return [];
      }

      // linear roots are even easier
      if(p.length === 2) {
        var a = p[0], b = p[1];
        if(a!==b) { return [a/(a-b)]; }
        return [];
      }
    },
    bboxoverlap: function(b1,b2) {
      var dims=['x','y'],len=dims.length,i,dim,l,t,d
      for(i=0; i<len; i++) {
        dim = dims[i];
        l = b1[dim].mid;
        t = b2[dim].mid;
        d = (b1[dim].size + b2[dim].size)/2;
        if(abs(l-t) >= d) return false;
      }
      return true;
    },
    expandbox: function(bbox, _bbox) {
      if(_bbox.x.min < bbox.x.min) { bbox.x.min = _bbox.x.min; }
      if(_bbox.y.min < bbox.y.min) { bbox.y.min = _bbox.y.min; }
      if(_bbox.z && _bbox.z.min < bbox.z.min) { bbox.z.min = _bbox.z.min; }
      if(_bbox.x.max > bbox.x.max) { bbox.x.max = _bbox.x.max; }
      if(_bbox.y.max > bbox.y.max) { bbox.y.max = _bbox.y.max; }
      if(_bbox.z && _bbox.z.max > bbox.z.max) { bbox.z.max = _bbox.z.max; }
      bbox.x.mid = (bbox.x.min + bbox.x.max)/2;
      bbox.y.mid = (bbox.y.min + bbox.y.max)/2;
      if(bbox.z) { bbox.z.mid = (bbox.z.min + bbox.z.max)/2; }
      bbox.x.size = bbox.x.max - bbox.x.min;
      bbox.y.size = bbox.y.max - bbox.y.min;
      if(bbox.z) { bbox.z.size = bbox.z.max - bbox.z.min; }
    },
    pairiteration: function(c1,c2) {
      var c1b = c1.bbox(),
          c2b = c2.bbox(),
          r = 100000,
          threshold = 0.5;
      if(c1b.x.size + c1b.y.size < threshold && c2b.x.size + c2b.y.size < threshold) {
        return [ ((r * (c1._t1+c1._t2)/2)|0)/r + "/" + ((r * (c2._t1+c2._t2)/2)|0)/r ];
      }
      var cc1 = c1.split(0.5),
          cc2 = c2.split(0.5),
          pairs = [
            {left: cc1.left, right: cc2.left },
            {left: cc1.left, right: cc2.right },
            {left: cc1.right, right: cc2.right },
            {left: cc1.right, right: cc2.left }];
      pairs = pairs.filter(function(pair) {
        return utils.bboxoverlap(pair.left.bbox(),pair.right.bbox());
      });
      var results = [];
      if(pairs.length === 0) return results;
      pairs.forEach(function(pair) {
        results = results.concat(
          utils.pairiteration(pair.left, pair.right)
        );
      })
      results = results.filter(function(v,i) {
        return results.indexOf(v) === i;
      });
      return results;
    },
    getccenter: function(p1,p2,p3) {
      var dx1 = (p2.x - p1.x),
          dy1 = (p2.y - p1.y),
          dx2 = (p3.x - p2.x),
          dy2 = (p3.y - p2.y);
      var dx1p = dx1 * cos(quart) - dy1 * sin(quart),
          dy1p = dx1 * sin(quart) + dy1 * cos(quart),
          dx2p = dx2 * cos(quart) - dy2 * sin(quart),
          dy2p = dx2 * sin(quart) + dy2 * cos(quart);
      // chord midpoints
      var mx1 = (p1.x + p2.x)/2,
          my1 = (p1.y + p2.y)/2,
          mx2 = (p2.x + p3.x)/2,
          my2 = (p2.y + p3.y)/2;
      // midpoint offsets
      var mx1n = mx1 + dx1p,
          my1n = my1 + dy1p,
          mx2n = mx2 + dx2p,
          my2n = my2 + dy2p;
      // intersection of these lines:
      var arc = utils.lli8(mx1,my1,mx1n,my1n, mx2,my2,mx2n,my2n),
          r = utils.dist(arc,p1),
          // arc start/end values, over mid point:
          s = atan2(p1.y - arc.y, p1.x - arc.x),
          m = atan2(p2.y - arc.y, p2.x - arc.x),
          e = atan2(p3.y - arc.y, p3.x - arc.x),
          _;
      // determine arc direction (cw/ccw correction)
      if (s<e) {
        // if s<m<e, arc(s, e)
        // if m<s<e, arc(e, s + tau)
        // if s<e<m, arc(e, s + tau)
        if (s>m || m>e) { s += tau; }
        if (s>e) { _=e; e=s; s=_; }
      } else {
        // if e<m<s, arc(e, s)
        // if m<e<s, arc(s, e + tau)
        // if e<s<m, arc(s, e + tau)
        if (e<m && m<s) { _=e; e=s; s=_; } else { e += tau; }
      }
      // assign and done.
      arc.s = s;
      arc.e = e;
      arc.r = r;
      return arc;
    }
  };

  /**
   * Poly Bezier
   * @param {[type]} curves [description]
   */
  var PolyBezier = function(curves) {
    this.curves = [];
    this._3d = false;
    if(!!curves) {
      this.curves = curves;
      this._3d = this.curves[0]._3d;
    }
  }

  PolyBezier.prototype = {
    valueOf: function() {
      return this.toString();
    },
    toString: function() {
      return utils.pointsToString(this.points);
    },
    addCurve: function(curve) {
      this.curves.push(curve);
      this._3d = this._3d || curve._3d;
    },
    length: function() {
      return this.curves.map(function(v) { return v.length(); }).reduce(function(a,b) { return a+b; });
    },
    curve: function(idx) {
      return this.curves[idx];
    },
    bbox: function() {
      var c = this.curves;
      var bbox = c[0].bbox();
      for(var i=1; i<c.length; i++) {
        utils.expandbox(bbox, c[i].bbox());
      }
      return bbox;
    },
    offset: function(d) {
      var offset = [];
      this.curves.forEach(function(v) {
        offset = offset.concat(v.offset(d));
      });
      return new PolyBezier(offset);
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
      console.log(coords);
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

  Bezier.fromSVG = function(svgString) {
    var list = svgString.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g).map(parseFloat);
    var relative = /[cq]/.test(svgString);
    if(!relative) return new Bezier(list);
    list = list.map(function(v,i) {
      return i < 2 ? v : v + list[i % 2];
    });
    return new Bezier(list);
  };

  Bezier.utils = utils;

  Bezier.prototype = {
    valueOf: function() {
      return this.toString();
    },
    toString: function() {
      return utils.pointsToString(this.points);
    },
    toSVG: function(relative) {
      if(this._3d) return false;
      var p = this.points,
          x = p[0].x,
          y = p[0].y,
          s = ["M", x, y, (this.order===2 ? "Q":"C")];
      for(var i=1, last=p.length; i<last; i++) {
        s.push(p[i].x);
        s.push(p[i].y);
      }
      return s.join(" ");
    },
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
    getLUT: function(steps) {
      steps = steps || 100;
      var points = [];
      for(var t=0; t<=steps; t++) {
        points.push(this.compute(t/steps));
      }
      return points;
    },
    get: function(t) {
      return this.compute(t);
    },
    point: function(idx) {
      return this.points[idx];
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
    raise: function() {
      var p = this.points, np = [p[0]], i, k=p.length, pi, pim;
      for (var i=1; i<k; i++) {
        pi = p[i];
        pim = p[i-1];
        np[i] = {
          x: (k-i)/k * pi.x + i/k * pim.x,
          y: (k-i)/k * pi.y + i/k * pim.y
        };
      }
      np[k] = p[k-1];
      return new Bezier(np);
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
    },
    normal: function(t) {
      return this._3d ? this.__normal3(t) : this.__normal2(t);
    },
    __normal2: function(t) {
      var d = this.derivative(t);
      var q = sqrt(d.x*d.x + d.y*d.y)
      return { x: -d.y/q, y: d.x/q };
    },
    __normal3: function() {
      // see http://stackoverflow.com/questions/25453159
      var r1 = this.derivative(t),
          r2 = this.derivative(t+0.01),
          q1 = sqrt(r1.x*r1.x + r1.y*r1.y + r1.z*r1.z),
          q2 = sqrt(r2.x*r2.x + r2.y*r2.y + r2.z*r2.z);
      r1.x /= q1; r1.y /= q1; r1.z /= q1;
      r2.x /= q2; r2.y /= q2; r2.z /= q2;
      // cross product
      var c = {
        x: r2.y*r1.z - r2.z*r1.y,
        y: r2.z*r1.x - r2.x*r1.z,
        z: r2.x*r1.y - r2.y*r1.x
      };
      var m = sqrt(c.x*c.x + c.y*c.y + c.z*c.z);
      c.x /= m; c.y /= m; c.z /= m;
      // rotation matrix
      var R = [   c.x*c.x,   c.x*c.y-c.z, c.x*c.z+c.y,
                c.x*c.y+c.z,   c.y*c.y,   c.y*c.z-c.x,
                c.x*c.z-c.y, c.y*c.z+c.x,   c.z*c.z    ];
      // normal vector:
      var n = {
        x: R[0] * r1.x + R[1] * r1.y + R[2] * r1.z,
        y: R[3] * r1.x + R[4] * r1.y + R[5] * r1.z,
        z: R[6] * r1.x + R[7] * r1.y + R[8] * r1.z
      };
      return n;
    },
    split: function(t1, t2) {
      // shortcuts
      if(t1===0 && !!t2) { return this.split(t2).left; }
      if(t2===1) { return this.split(t1).right; }
      // no shortcut: use "de Casteljau" iteration.
      var p = this.points,
          _p = [],
          pt,
          q = [],
          idx = 0,
          i=0,
          l=0;
      q[idx++] = p[0];
      q[idx++] = p[1];
      q[idx++] = p[2];
      if(this.order === 3) { q[idx++] = p[3]; }
      // we lerp between all points at each iteration, until we have 1 point left.
      while(p.length>1) {
        _p = [];
        for(i=0, l=p.length-1; i<l; i++) {
          pt = utils.lerp(t1,p[i],p[i+1]);
          q[idx++] = pt;
          _p.push(pt);
        }
        p = _p;
      }
      var result = {
        left: this.order === 2 ? new Bezier([q[0],q[3],q[5]]) : new Bezier([q[0],q[4],q[7],q[9]]),
        right: this.order === 2 ? new Bezier([q[5],q[4],q[2]]) : new Bezier([q[9],q[8],q[6],q[3]]),
        span: q
      };

      // make sure we bind _t1/_t2 information!
      result.left._t1  = utils.map(0,  0,1, this._t1,this._t2);
      result.left._t2  = utils.map(t1, 0,1, this._t1,this._t2);
      result.right._t1 = utils.map(t1, 0,1, this._t1,this._t2);
      result.right._t2 = utils.map(1,  0,1, this._t1,this._t2);

      // if we have no t2, we're done
      if(!t2) { return result; }

      // if we have a t2, split again:
      t2 = utils.map(t2,t1,1,0,1);
      var subsplit = result.right.split(t2);
      return subsplit.left;
    },
    inflections: function() {
      var dims = this.dims,
          len = this.dimlen,
          result={},
          roots=[],
          p, mfn;
      dims.forEach(function(dim) {
        mfn = function(v) { return v[dim]; };
        p = this.dpoints[0].map(mfn);
        result[dim] = utils.droots(p);
        if(this.order === 3) {
          p = this.dpoints[1].map(mfn);
          result[dim] = result[dim].concat(utils.droots(p));
        }
        result[dim] = result[dim].filter(function(t) { return (t>=0 && t<=1); });
        roots = roots.concat(result[dim].sort());
      }.bind(this));
      roots.sort();
      result.values = roots;
      return result;
    },
    bbox: function() {
      var inflections = this.inflections(), result = {};
      this.dims.forEach(function(d) {
        result[d] = utils.getminmax(this, d, inflections[d]);
      }.bind(this));
      return result;
    },
    overlaps: function(curve) {
      var lbbox = this.bbox(),
          tbbox = curve.bbox();
      return utils.bboxoverlap(lbbox,tbbox);
    },
    offset: function(t, d) {
      if(typeof d !== "undefined") {
        var c = this.get(t);
        var n = this.normal(t);
        var ret = {
          c: c,
          n: n,
          x: c.x + n.x * d,
          y: c.y + n.y * d
        };
        if(this._3d) {
          ret.z = c.z + n.z * d;
        };
        return ret;
      }
      if(this._linear) {
        var nv = this.normal(0);
        var coords = this.points.map(function(p) {
          var ret = {
            x: p.x + t * nv.x,
            y: p.y + t * nv.y
          };
          if(p.z && n.z) { ret.z = p.z + t * nv.z; }
          return ret;
        });
        return [new Bezier(coords)];
      }
      var reduced = this.reduce();
      return reduced.map(function(s) {
        return s.scale(t);
      });
    },
    simple: function() {
      if(this.order===3) {
        var a1 = utils.angle(this.points[0], this.points[3], this.points[1]);
        var a2 = utils.angle(this.points[0], this.points[3], this.points[2]);
        if(a1>0 && a2<0 || a1<0 && a2>0) return false;
      }
      var n1 = this.normal(0);
      var n2 = this.normal(1);
      var s = n1.x*n2.x + n1.y*n2.y;
      if(this._3d) { s += n1.z*n2.z; }
      var angle = abs(acos(s));
      return angle < pi/3;
    },
    reduce: function() {
      var i, t1=0, t2=0, step=0.01, segment, pass1=[], pass2=[];
      // first pass: split on inflections
      var inflections = this.inflections().values;
      if(inflections.indexOf(0)===-1) { inflections = [0].concat(inflections); }
      if(inflections.indexOf(1)===-1) { inflections.push(1); }
      for(t1=inflections[0], i=1; i<inflections.length; i++) {
        t2 = inflections[i];
        segment = this.split(t1,t2);
        segment._t1 = t1;
        segment._t2 = t2;
        pass1.push(segment);
        t1 = t2;
      }
      // second pass: further reduce these segments to simple segments
      pass1.forEach(function(p1) {
        t1=0;
        t2=0;
        while(t2 <= 1) {
          for(t2=t1+step; t2<=1+step; t2+=step) {
            segment = p1.split(t1,t2);
            if(!segment.simple()) {
              t2 -= step;
              if(abs(t1-t2)<step) {
                // we can never form a reduction
                return [];
              }
              segment = p1.split(t1,t2);
              segment._t1 = utils.map(t1,0,1,p1._t1,p1._t2);
              segment._t2 = utils.map(t2,0,1,p1._t1,p1._t2);
              pass2.push(segment);
              t1 = t2;
              break;
            }
          }
        }
        if(t1<1) {
          segment = p1.split(t1,1);
          segment._t1 = utils.map(t1,0,1,p1._t1,p1._t2);
          segment._t2 = p1._t2;
          pass2.push(segment);
        }
      });
      return pass2;
    },
    scale: function(d) {
      var order = this.order;
      var distanceFn = false
      if(typeof d === "function") { distanceFn = d; }
      if(distanceFn && order === 2) { return this.raise().scale(distanceFn); }

      // TODO: add special handling for degenerate (=linear) curves.
      var clockwise = this.clockwise;
      var r1 = distanceFn ? distanceFn(0) : d;
      var r2 = distanceFn ? distanceFn(1) : d;
      var v = [ this.offset(0,10), this.offset(1,10) ];
      var o = utils.lli4(v[0], v[0].c, v[1], v[1].c);
      if(!o) { throw "cannot scale this curve. Try reducing it first."; }
      // move all points by distance 'd' wrt the origin 'o'
      var points=this.points, np=[];

      // move end points by fixed distance along normal.
      [0,1].forEach(function(t) {
        var p = np[t*order] = utils.copy(points[t*order]);
        p.x += (t?r2:r1) * v[t].n.x;
        p.y += (t?r2:r1) * v[t].n.y;
      }.bind(this));

      if (!distanceFn) {
        // move control points to lie on the intersection of the offset
        // derivative vector, and the origin-through-control vector
        [0,1].forEach(function(t) {
          if(this.order===2 && !!t) return;
          var p = np[t*order];
          var d = this.derivative(t);
          var p2 = { x: p.x + d.x, y: p.y + d.y };
          np[t+1] = utils.lli4(p, p2, o, points[t+1]);
        }.bind(this));
        return new Bezier(np);
      }

      // move control points by "however much necessary to
      // ensure the correct tangent to endpoint".
      [0,1].forEach(function(t) {
        if(this.order===2 && !!t) return;
        var p = points[t+1];
        var ov = {
          x: p.x - o.x,
          y: p.y - o.y
        };
        var rc = distanceFn ? distanceFn((t+1)/order) : d;
        if(distanceFn && !clockwise) rc = -rc;
        var m = sqrt(ov.x*ov.x + ov.y*ov.y);
        ov.x /= m;
        ov.y /= m;
        np[t+1] = {
          x: p.x + rc*ov.x,
          y: p.y + rc*ov.y
        }
      }.bind(this));
      return new Bezier(np);
    },
    outline: function(d1, d2, d3, d4) {
      d2 = (typeof d2 === "undefined") ? d1 : d2;
      var reduced = this.reduce(),
          len = reduced.length,
          order = this.order,
          fcurves = [],
          bcurves = [],
          i, p, last,
          alen = 0,
          tlen = this.length();

      var graduated = (typeof d3 !== "undefined" && typeof d4 !== "undefined");

      function linearDistanceFunction(s,e, tlen,alen,slen) {
        return function (v) {
          var f1 = alen/tlen, f2 = (alen+slen)/tlen, d = e-s;
          return utils.map(v, 0,1, s+f1*d, s+f2*d);
        };
      };

      // form curve oulines
      reduced.forEach(function(segment) {
        slen = segment.length();
        if (graduated) {
          fcurves.push(segment.scale(  linearDistanceFunction( d1, d3, tlen,alen,slen)  ));
          bcurves.push(segment.scale(  linearDistanceFunction(-d2,-d4, tlen,alen,slen)  ));
        } else {
          fcurves.push(segment.scale( d1));
          bcurves.push(segment.scale(-d2));
        }
        alen += slen;
      });

      // reverse the "return" outline
      bcurves = bcurves.map(function(s) {
        p = s.points;
        if(p[3]) { s.points = [p[3],p[2],p[1],p[0]]; }
        else { s.points = [p[2],p[1],p[0]]; }
        return s;
      }).reverse();

      // form the endcaps as lines
      var fs = fcurves[0].points[0],
          fe = fcurves[len-1].points[fcurves[len-1].points.length-1],
          bs = bcurves[len-1].points[bcurves[len-1].points.length-1],
          be = bcurves[0].points[0],
          ls = utils.makeline(bs,fs),
          le = utils.makeline(fe,be),
          segments = [ls].concat(fcurves).concat([le]).concat(bcurves),
          slen = segments.length;

      return new PolyBezier(segments);
    },
    outlineshapes: function(d1,d2) {
      d2 = d2 || d1;
      var outline = this.outline(d1,d2).curves;
      var shapes = [];
      for(var i=1, len=outline.length; i < len/2; i++) {
        var shape = utils.makeshape(outline[i], outline[len-i]);
        shape.startcap.virtual = (i > 1);
        shape.endcap.virtual = (i < len/2-1);
        shapes.push(shape);
      }
      return shapes;
    },
    intersects: function(curve) {
      if(!curve) return this.selfintersects();
      if(curve.p1 && curve.p2) {
        return this.lineIntersects(curve);
      }
      if(curve instanceof Bezier) { curve = curve.reduce(); }
      return this.curveintersects(this.reduce(), curve);
    },
    lineIntersects: function(line) {
      var mx = min(line.p1.x, line.p2.x),
          my = min(line.p1.y, line.p2.y),
          MX = max(line.p1.x, line.p2.x),
          MY = max(line.p1.y, line.p2.y),
          self=this;
      return utils.roots(this.points, line).filter(function(t) {
        var p = self.get(t);
        return (mx <= p.x && p.x <= MX && my <= p.y && p.y <= MY);
      });
    },
    selfintersects: function() {
      var reduced = this.reduce();
      // "simple" curves cannot intersect with their direct
      // neighbour, so for each segment X we check whether
      // it intersects [0:x-2][x+2:last].
      var i,len=reduced.length-2,results=[],result,left,right;
      for(i=0; i<len; i++) {
        left = reduced.slice(i,i+1);
        right = reduced.slice(i+2);
        result = this.curveintersects(left, right);
        results = results.concat( result );
      }
      return results;
    },
    curveintersects: function(c1,c2) {
      var pairs = [];
      // step 1: pair off any overlapping segments
      c1.forEach(function(l) {
        c2.forEach(function(r) {
          if(l.overlaps(r)) {
            pairs.push({ left: l, right: r });
          }
        });
      });
      // step 2: for each pairing, run through the convergence algorithm.
      var intersections = [];
      pairs.forEach(function(pair) {
        var result = utils.pairiteration(pair.left, pair.right);
        if(result.length > 0) {
          intersections = intersections.concat(result);
        }
      });
      return intersections;
    },
    arcs: function(errorThreshold) {
      errorThreshold = errorThreshold || 0.5;
      var circles = [];
      return this._iterate(errorThreshold, circles);
    },
    _error: function(pc, np1, s, e) {
      var q = (e - s) / 4,
          c1 = this.get(s + q),
          c2 = this.get(e - q),
          ref = utils.dist(pc, np1),
          d1  = utils.dist(pc, c1),
          d2  = utils.dist(pc, c2);
      return abs(d1-ref) + abs(d2-ref);
    },
    _iterate: function(errorThreshold, circles) {
      var s = 0, e = 1, safety;
      // we do a binary search to find the "good `t` closest to no-longer-good"
      do {
        safety=0;

        // step 1: start with the maximum possible arc
        e = 1;

        // points:
        var np1 = this.get(s), np2, o_np2, np3, o_np3, arc, prev_arc;

        // booleans:
        var curr_good = false, prev_good = false, done;

        // numbers:
        var m = e, prev_e = 1, step = 0;

        // step 2: find the best possible arc
        do {
          prev_good = curr_good;
          prev_arc = arc;
          m = (s + e)/2;
          step++;

          np2 = this.get(m);
          np3 = this.get(e);

          arc = utils.getccenter(np1, np2, np3);
          var error = this._error(arc, np1, s, e);
          curr_good = (error <= errorThreshold);

          done = prev_good && !curr_good;
          if(!done) prev_e = e;

          // this arc is fine: we can move 'e' up to see if we can find a wider arc
          if(curr_good) {
            // if e is already at max, then we're done for this arc.
            if (e >= 1) {
              prev_e = 1;
              prev_arc = arc;
              break;
            }
            // if not, move it up by half the iteration distance
            e = e + (e-s)/2;
          }

          // this is a bad arc: we need to move 'e' down to find a good arc
          else {
            e = m;
          }
        }
        while(!done && safety++<100);

        if(safety>=100) {
          console.error("arc abstraction somehow failed...");
          break;
        }

        // console.log("[F] arc found", s, prev_e, prev_arc.x, prev_arc.y, prev_arc.s, prev_arc.e);

        prev_arc = (prev_arc ? prev_arc : arc);
        circles.push(prev_arc);
        s = prev_e;
      }
      while(e < 1);
      return circles;
    }
  };


  if(typeof module !== "undefined" && module.exports) {
    module.exports = Bezier;
  }

  else if(typeof define !== "undefined") {
    define(function() { return Bezier; });
  }

  else if(typeof window !== "undefined") {
    window.Bezier = Bezier;
  }

}());

},{}],2:[function(_dereq_,module,exports){
module.exports = _dereq_("./bezier");
},{"./bezier":1}],3:[function(_dereq_,module,exports){

},{}],4:[function(_dereq_,module,exports){
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

},{}],5:[function(_dereq_,module,exports){
var conversions = _dereq_("./conversions");

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
},{"./conversions":4}],6:[function(_dereq_,module,exports){
/* MIT license */
var colorNames = _dereq_('color-name');

module.exports = {
   getRgba: getRgba,
   getHsla: getHsla,
   getRgb: getRgb,
   getHsl: getHsl,
   getHwb: getHwb,
   getAlpha: getAlpha,

   hexString: hexString,
   rgbString: rgbString,
   rgbaString: rgbaString,
   percentString: percentString,
   percentaString: percentaString,
   hslString: hslString,
   hslaString: hslaString,
   hwbString: hwbString,
   keyword: keyword
}

function getRgba(string) {
   if (!string) {
      return;
   }
   var abbr =  /^#([a-fA-F0-9]{3})$/,
       hex =  /^#([a-fA-F0-9]{6})$/,
       rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
       per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
       keyword = /(\D+)/;

   var rgb = [0, 0, 0],
       a = 1,
       match = string.match(abbr);
   if (match) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i] + match[i], 16);
      }
   }
   else if (match = string.match(hex)) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
      }
   }
   else if (match = string.match(rgba)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i + 1]);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(per)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(keyword)) {
      if (match[1] == "transparent") {
         return [0, 0, 0, 0];
      }
      rgb = colorNames[match[1]];
      if (!rgb) {
         return;
      }
   }

   for (var i = 0; i < rgb.length; i++) {
      rgb[i] = scale(rgb[i], 0, 255);
   }
   if (!a && a != 0) {
      a = 1;
   }
   else {
      a = scale(a, 0, 1);
   }
   rgb[3] = a;
   return rgb;
}

function getHsla(string) {
   if (!string) {
      return;
   }
   var hsl = /^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
   var match = string.match(hsl);
   if (match) {
      var alpha = parseFloat(match[4]);
      var h = scale(parseInt(match[1]), 0, 360),
          s = scale(parseFloat(match[2]), 0, 100),
          l = scale(parseFloat(match[3]), 0, 100),
          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, s, l, a];
   }
}

function getHwb(string) {
   if (!string) {
      return;
   }
   var hwb = /^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
   var match = string.match(hwb);
   if (match) {
    var alpha = parseFloat(match[4]);
      var h = scale(parseInt(match[1]), 0, 360),
          w = scale(parseFloat(match[2]), 0, 100),
          b = scale(parseFloat(match[3]), 0, 100),
          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, w, b, a];
   }
}

function getRgb(string) {
   var rgba = getRgba(string);
   return rgba && rgba.slice(0, 3);
}

function getHsl(string) {
  var hsla = getHsla(string);
  return hsla && hsla.slice(0, 3);
}

function getAlpha(string) {
   var vals = getRgba(string);
   if (vals) {
      return vals[3];
   }
   else if (vals = getHsla(string)) {
      return vals[3];
   }
   else if (vals = getHwb(string)) {
      return vals[3];
   }
}

// generators
function hexString(rgb) {
   return "#" + hexDouble(rgb[0]) + hexDouble(rgb[1])
              + hexDouble(rgb[2]);
}

function rgbString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return rgbaString(rgba, alpha);
   }
   return "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")";
}

function rgbaString(rgba, alpha) {
   if (alpha === undefined) {
      alpha = (rgba[3] !== undefined ? rgba[3] : 1);
   }
   return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2]
           + ", " + alpha + ")";
}

function percentString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return percentaString(rgba, alpha);
   }
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);

   return "rgb(" + r + "%, " + g + "%, " + b + "%)";
}

function percentaString(rgba, alpha) {
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);
   return "rgba(" + r + "%, " + g + "%, " + b + "%, " + (alpha || rgba[3] || 1) + ")";
}

function hslString(hsla, alpha) {
   if (alpha < 1 || (hsla[3] && hsla[3] < 1)) {
      return hslaString(hsla, alpha);
   }
   return "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)";
}

function hslaString(hsla, alpha) {
   if (alpha === undefined) {
      alpha = (hsla[3] !== undefined ? hsla[3] : 1);
   }
   return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, "
           + alpha + ")";
}

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
function hwbString(hwb, alpha) {
   if (alpha === undefined) {
      alpha = (hwb[3] !== undefined ? hwb[3] : 1);
   }
   return "hwb(" + hwb[0] + ", " + hwb[1] + "%, " + hwb[2] + "%"
           + (alpha !== undefined && alpha !== 1 ? ", " + alpha : "") + ")";
}

function keyword(rgb) {
  return reverseNames[rgb.slice(0, 3)];
}

// helpers
function scale(num, min, max) {
   return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
  var str = num.toString(16).toUpperCase();
  return (str.length < 2) ? "0" + str : str;
}


//create a list of reverse color names
var reverseNames = {};
for (var name in colorNames) {
   reverseNames[colorNames[name]] = name;
}

},{"color-name":7}],7:[function(_dereq_,module,exports){
module.exports={
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
}
},{}],8:[function(_dereq_,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],9:[function(_dereq_,module,exports){
var createElement = _dereq_("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":21}],10:[function(_dereq_,module,exports){
var diff = _dereq_("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":44}],11:[function(_dereq_,module,exports){
var h = _dereq_("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":29}],12:[function(_dereq_,module,exports){
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

},{}],13:[function(_dereq_,module,exports){
'use strict';

var OneVersionConstraint = _dereq_('individual/one-version');

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

},{"individual/one-version":15}],14:[function(_dereq_,module,exports){
(function (global){
'use strict';

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],15:[function(_dereq_,module,exports){
'use strict';

var Individual = _dereq_('./index.js');

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

},{"./index.js":14}],16:[function(_dereq_,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = _dereq_('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"min-document":3}],17:[function(_dereq_,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],18:[function(_dereq_,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],19:[function(_dereq_,module,exports){
var patch = _dereq_("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":24}],20:[function(_dereq_,module,exports){
var isObject = _dereq_("is-object")
var isHook = _dereq_("../vnode/is-vhook.js")

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

},{"../vnode/is-vhook.js":35,"is-object":17}],21:[function(_dereq_,module,exports){
var document = _dereq_("global/document")

var applyProperties = _dereq_("./apply-properties")

var isVNode = _dereq_("../vnode/is-vnode.js")
var isVText = _dereq_("../vnode/is-vtext.js")
var isWidget = _dereq_("../vnode/is-widget.js")
var handleThunk = _dereq_("../vnode/handle-thunk.js")

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

},{"../vnode/handle-thunk.js":33,"../vnode/is-vnode.js":36,"../vnode/is-vtext.js":37,"../vnode/is-widget.js":38,"./apply-properties":20,"global/document":16}],22:[function(_dereq_,module,exports){
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

},{}],23:[function(_dereq_,module,exports){
var applyProperties = _dereq_("./apply-properties")

var isWidget = _dereq_("../vnode/is-widget.js")
var VPatch = _dereq_("../vnode/vpatch.js")

var updateWidget = _dereq_("./update-widget")

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

},{"../vnode/is-widget.js":38,"../vnode/vpatch.js":41,"./apply-properties":20,"./update-widget":25}],24:[function(_dereq_,module,exports){
var document = _dereq_("global/document")
var isArray = _dereq_("x-is-array")

var render = _dereq_("./create-element")
var domIndex = _dereq_("./dom-index")
var patchOp = _dereq_("./patch-op")
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

},{"./create-element":21,"./dom-index":22,"./patch-op":23,"global/document":16,"x-is-array":18}],25:[function(_dereq_,module,exports){
var isWidget = _dereq_("../vnode/is-widget.js")

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

},{"../vnode/is-widget.js":38}],26:[function(_dereq_,module,exports){
'use strict';

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

},{}],27:[function(_dereq_,module,exports){
'use strict';

var EvStore = _dereq_('ev-store');

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

},{"ev-store":13}],28:[function(_dereq_,module,exports){
'use strict';

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

},{}],29:[function(_dereq_,module,exports){
'use strict';

var isArray = _dereq_('x-is-array');

var VNode = _dereq_('../vnode/vnode.js');
var VText = _dereq_('../vnode/vtext.js');
var isVNode = _dereq_('../vnode/is-vnode');
var isVText = _dereq_('../vnode/is-vtext');
var isWidget = _dereq_('../vnode/is-widget');
var isHook = _dereq_('../vnode/is-vhook');
var isVThunk = _dereq_('../vnode/is-thunk');

var parseTag = _dereq_('./parse-tag.js');
var softSetHook = _dereq_('./hooks/soft-set-hook.js');
var evHook = _dereq_('./hooks/ev-hook.js');

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

},{"../vnode/is-thunk":34,"../vnode/is-vhook":35,"../vnode/is-vnode":36,"../vnode/is-vtext":37,"../vnode/is-widget":38,"../vnode/vnode.js":40,"../vnode/vtext.js":42,"./hooks/ev-hook.js":27,"./hooks/soft-set-hook.js":28,"./parse-tag.js":30,"x-is-array":18}],30:[function(_dereq_,module,exports){
'use strict';

var split = _dereq_('browser-split');

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

},{"browser-split":12}],31:[function(_dereq_,module,exports){
'use strict';

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

},{}],32:[function(_dereq_,module,exports){
'use strict';

var isArray = _dereq_('x-is-array');

var h = _dereq_('./index.js');


var SVGAttributeNamespace = _dereq_('./svg-attribute-namespace');
var attributeHook = _dereq_('./hooks/attribute-hook');

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

},{"./hooks/attribute-hook":26,"./index.js":29,"./svg-attribute-namespace":31,"x-is-array":18}],33:[function(_dereq_,module,exports){
var isVNode = _dereq_("./is-vnode")
var isVText = _dereq_("./is-vtext")
var isWidget = _dereq_("./is-widget")
var isThunk = _dereq_("./is-thunk")

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

},{"./is-thunk":34,"./is-vnode":36,"./is-vtext":37,"./is-widget":38}],34:[function(_dereq_,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],35:[function(_dereq_,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],36:[function(_dereq_,module,exports){
var version = _dereq_("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":39}],37:[function(_dereq_,module,exports){
var version = _dereq_("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":39}],38:[function(_dereq_,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],39:[function(_dereq_,module,exports){
module.exports = "2"

},{}],40:[function(_dereq_,module,exports){
var version = _dereq_("./version")
var isVNode = _dereq_("./is-vnode")
var isWidget = _dereq_("./is-widget")
var isThunk = _dereq_("./is-thunk")
var isVHook = _dereq_("./is-vhook")

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

},{"./is-thunk":34,"./is-vhook":35,"./is-vnode":36,"./is-widget":38,"./version":39}],41:[function(_dereq_,module,exports){
var version = _dereq_("./version")

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

},{"./version":39}],42:[function(_dereq_,module,exports){
var version = _dereq_("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":39}],43:[function(_dereq_,module,exports){
var isObject = _dereq_("is-object")
var isHook = _dereq_("../vnode/is-vhook")

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

},{"../vnode/is-vhook":35,"is-object":17}],44:[function(_dereq_,module,exports){
var isArray = _dereq_("x-is-array")

var VPatch = _dereq_("../vnode/vpatch")
var isVNode = _dereq_("../vnode/is-vnode")
var isVText = _dereq_("../vnode/is-vtext")
var isWidget = _dereq_("../vnode/is-widget")
var isThunk = _dereq_("../vnode/is-thunk")
var handleThunk = _dereq_("../vnode/handle-thunk")

var diffProps = _dereq_("./diff-props")

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

},{"../vnode/handle-thunk":33,"../vnode/is-thunk":34,"../vnode/is-vnode":36,"../vnode/is-vtext":37,"../vnode/is-widget":38,"../vnode/vpatch":41,"./diff-props":43,"x-is-array":18}],45:[function(_dereq_,module,exports){
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

},{"./vector":62,"bezier-js":2,"underscore":8}],46:[function(_dereq_,module,exports){
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

},{"color-convert":5,"color-string":6,"underscore":8}],47:[function(_dereq_,module,exports){
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

},{}],48:[function(_dereq_,module,exports){
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

},{"./group":49,"./mixins":50,"underscore":8}],49:[function(_dereq_,module,exports){
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

},{"./mixins":50,"./utils":61,"underscore":8}],50:[function(_dereq_,module,exports){
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

},{"./color":46,"./utils":61}],51:[function(_dereq_,module,exports){
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

},{"./shapes/circle":53,"./shapes/line":55,"./shapes/rectangle":58,"underscore":8,"virtual-dom/create-element":9,"virtual-dom/diff":10,"virtual-dom/h":11,"virtual-dom/patch":19,"virtual-dom/virtual-hyperscript/svg":32}],52:[function(_dereq_,module,exports){
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

},{"./anchor":45,"./color":46,"./events":47,"./grid":48,"./group":49,"./mixins":50,"./render":51,"./shapes/circle":53,"./shapes/ellipse":54,"./shapes/line":55,"./shapes/path":56,"./shapes/polygon":57,"./shapes/rectangle":58,"./shapes/text":59,"./shapes/triangle":60,"./utils":61,"./vector":62,"underscore":8}],53:[function(_dereq_,module,exports){
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

},{"../mixins":50,"../utils":61,"./ellipse":54,"underscore":8}],54:[function(_dereq_,module,exports){
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

},{"../mixins":50,"../utils":61,"./polygon":57,"underscore":8}],55:[function(_dereq_,module,exports){
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

},{"../mixins":50,"../utils":61,"underscore":8}],56:[function(_dereq_,module,exports){
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

},{"../anchor":45,"../mixins":50,"../utils":61,"../vector":62,"./polygon":57,"underscore":8}],57:[function(_dereq_,module,exports){
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

},{"../mixins":50,"../utils":61,"../vector":62,"underscore":8}],58:[function(_dereq_,module,exports){
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

},{"../mixins":50,"../utils":61,"./polygon":57,"underscore":8}],59:[function(_dereq_,module,exports){
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

},{"../mixins":50,"../utils":61,"underscore":8}],60:[function(_dereq_,module,exports){
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

},{"../mixins":50,"../utils":61,"underscore":8}],61:[function(_dereq_,module,exports){
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

},{"underscore":8}],62:[function(_dereq_,module,exports){
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

},{"./utils":61,"underscore":8}]},{},[52])(52)
});


//# sourceMappingURL=rune.browser.js.map