import _ from "underscore"
import Circle from './shapes/circle'
import Rectangle from './shapes/rectangle'
import Line from './shapes/line'
import h from 'virtual-dom/h'
import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import createElement from 'virtual-dom/create-element'
import svg from 'virtual-dom/virtual-hyperscript/svg'

class Render {

  constructor(params) {
    this.params = params
    this.tree = svg('svg', {
      width: this.s(params.width),
      height: this.s(params.height)
    });
    this.el = createElement(this.tree);
  }

  render(stage, opts) {

    var newTree = svg('svg', {
      width: this.s(this.params.width),
      height: this.s(this.params.height)
    }, [this.objectsToSVG(stage.children, opts)]);

    var diffTree = diff(this.tree, newTree);
    this.el = patch(this.el, diffTree);
    this.tree = newTree;
  }

  // Shape converters
  // --------------------------------------------------

  objectToSVG(object, opts) {
    if(this[object.type + "ToSVG"])
      return this[object.type + "ToSVG"](object, opts);
    else
      console.error("Rune.Render: Object not recognized", object)
  }

  objectsToSVG(objects, opts) {
    var objects = _.map(objects, _.bind(function(object) {
      return this.objectToSVG(object, opts);
    }, this));
    return _.flatten(objects, true);
  }

  rectangleToSVG(rect) {
    var attr = {
      x: this.s(rect.vars.x),
      y: this.s(rect.vars.y),
      width: this.s(rect.vars.width),
      height: this.s(rect.vars.height)
    }
    this.transformAttribute(attr, rect);
    this.styleableAttributes(rect, attr);
    return svg('rect', attr);
  }

  ellipseToSVG(ellipse) {
    var attr = {
      cx: this.s(ellipse.vars.x),
      cy: this.s(ellipse.vars.y),
      rx: this.s(ellipse.vars.width / 2),
      ry: this.s(ellipse.vars.height / 2)
    }
    this.transformAttribute(attr, ellipse);
    this.styleableAttributes(ellipse, attr);
    return svg('ellipse', attr);
  }

  circleToSVG(circle) {
    var attr = {
      cx: this.s(circle.vars.x),
      cy: this.s(circle.vars.y),
      r: this.s(circle.vars.radius)
    }
    this.transformAttribute(attr, circle);
    this.styleableAttributes(circle, attr);
    return svg('circle', attr);
  }

  lineToSVG(line) {
    var attr = {
      x1: this.s(line.vars.x),
      y1: this.s(line.vars.y),
      x2: this.s(line.vars.x2),
      y2: this.s(line.vars.y2)
    }
    this.transformAttribute(attr, line);
    this.styleableAttributes(line, attr);
    return svg('line', attr);
  }

  triangleToSVG(tri) {
    var attr = {
      points: tri.vars.x + ' ' + tri.vars.y + ' ' + tri.vars.x2 + ' ' + tri.vars.y2 + ' ' + tri.vars.x3 + ' ' + tri.vars.y3
    };
    this.transformAttribute(attr, tri);
    this.styleableAttributes(tri, attr);
    return svg('polygon', attr);
  }

  polygonToSVG(polygon) {
    var attr = {
      points: _.map(polygon.vars.vectors, function(vec) {
        return vec.x + " " + vec.y;
      }).join(" ")
    };
    this.transformAttribute(attr, polygon);
    this.styleableAttributes(polygon, attr);
    return svg('polygon', attr);
  }

  pathToSVG(path, opts) {
    var attr = {};
    this.dAttribute(path, attr);
    this.transformAttribute(attr, path);
    this.styleableAttributes(path, attr);
    this.optionalAttributes(path, attr, {
      "fillRule" : "fill-rule"
    });

    var els = [
      svg('path', attr)
    ];

    if(opts && opts.debug) els = els.concat(this.debugPathToSVG(path));
    return els;
  }

  textToSVG(text, opts) {
    var attr = {
      x: this.s(text.vars.x),
      y: this.s(text.vars.y),
    }
    this.transformAttribute(attr, text);
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
  }

  groupToSVG(group) {
    if(_.isEmpty(group.children)) return;
    var attr = {}
    this.transformAttribute(attr, group);
    return svg('g', attr, this.objectsToSVG(group.children));
  }

  gridToSVG(grid, opts) {
    var attr = {}
    this.transformAttribute(attr, grid);

    var groups = [];
    _.each(grid.modules, _.bind(function(column) {
      groups.push(this.objectsToSVG(column))
    }, this));

    if(opts && opts.debug) groups = groups.concat(this.debugGridToSVG(grid));

    return svg('g', attr, _.flatten(groups, true));
  }

  // Debug
  // --------------------------------------------------

  debugPathToSVG(path) {

    var t = this;
    var els = [];

    _.each(path.vars.anchors, function(a, i) {
      if(a.command == 'cubic'){
        els.push(t.debugLine(path.vars.x + a.vec1.x, path.vars.y + a.vec1.y, path.vars.x + a.vec3.x, path.vars.y + a.vec3.y));
        els.push(t.debugLine(path.vars.x + a.vec2.x, path.vars.y + a.vec2.y, path.vars.x + a.vec3.x, path.vars.y + a.vec3.y));
        for(var i = 1; i < 4; i++) {
          els.push(t.debugCircle(path.vars.x + a["vec"+i].x, path.vars.y + a["vec"+i].y))
        }
      }
      else if(a.command == 'quad' && !_.isUndefined(a.vec2)){
        els.push(t.debugLine(path.vars.x + a.vec1.x, path.vars.y + a.vec1.y, path.vars.x + a.vec2.x, path.vars.y + a.vec2.y));
        for(var i = 1; i < 3; i++) {
          els.push(t.debugCircle(path.vars.x + a["vec"+i].x, path.vars.y + a["vec"+i].y))
        }
      }
    });

    return els;
  }

  debugGridToSVG(grid) {

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
  }

  debugCircle (x, y) {
    var c = new Circle(x, y, 4)
      .fill(212, 18, 229)
      .stroke(false);
    return this.circleToSVG(c);
  }

  debugRect (x, y, width, height) {
    var r = new Rectangle(x, y, width, height)
      .stroke(212, 18, 229).fill(false);
    return this.rectangleToSVG(r);
  }

  debugLine (x1, y1, x2, y2) {
    var l = new Line(x1, y1, x2, y2)
      .stroke(212, 18, 229);
    return this.lineToSVG(l);
  }

  // Multiple attributes
  // --------------------------------------------------

  optionalAttributes (object, attr, keys) {
    _.each(keys, function(attribute, variable) {
      if(object.vars[variable]) {
        attr[attribute] = this.s(object.vars[variable]);
      }
    }, this);
  }

  sizeableAttributes(object, attr) {
    attr.width = this.s(object.vars.width);
    attr.height = this.s(object.vars.height);
  }

  styleableAttributes(object, attr) {

    function rgbString(col) {
      var obj = col.rgb();
      return "rgb(" + obj.r + ", " + obj.g + ", " + obj.b + ")";
    }

    if(object.vars.fill === false)    attr.fill = "none";
    else if(object.vars.fill) {
      attr.fill = rgbString(object.vars.fill);
      var alpha = object.vars.fill.alpha();
      if(alpha < 1) attr["fill-opacity"] = this.s(alpha);
    }

    if(object.vars.stroke === false)  attr.stroke = "none";
    else if(object.vars.stroke) {
      attr.stroke = rgbString(object.vars.stroke);
      var alpha = object.vars.stroke.alpha();
      if(alpha < 1) attr["stroke-opacity"] = this.s(alpha);
    }

    if(object.vars.strokeWidth)       attr["stroke-width"] = this.s(object.vars.strokeWidth);
    if(object.vars.strokeCap)         attr["stroke-linecap"] = object.vars.strokeCap;
    if(object.vars.strokeJoin)        attr["stroke-linejoin"] = object.vars.strokeJoin;
    if(object.vars.strokeMiterlimit)  attr["stroke-miterlimit"] = this.s(object.vars.strokeMiterlimit);
    if(object.vars.strokeDash)        attr["stroke-dasharray"] = object.vars.strokeDash;
    if(object.vars.strokeDashOffset)  attr["stroke-dashoffset"] = this.s(object.vars.strokeDashOffset);
  }

  // Single attributes
  // --------------------------------------------------

  transformAttribute(attr, shape) {

    var vars = shape.vars;
    var strings = [];

    if(vars.rotation) {
      var rot = "rotate(" + vars.rotation;
      if(vars.rotationX || vars.rotationY)
        rot += " " + vars.rotationX + " " + vars.rotationY;
      strings.push(rot + ")");
    }

    if((shape.type == "group" || shape.type == "path" || shape.type == "polygon" || shape.type == "grid") && (vars.x || vars.y)) {
      strings.push("translate(" + vars.x + " " + vars.y + ")");
    }

    if(strings.length > 0)
      attr.transform = strings.join(" ").trim();
  }

  dAttribute(object, attr) {
    attr.d = _.map(object.vars.anchors, function(a) {

      if(a.command == 'move') {
        return (a.relative ? "m" : "M") + " " + [a.vec1.x, a.vec1.y].join(' ');
      }
      else if(a.command == 'line') {
        return (a.relative ? "l" : "L") + " " + [a.vec1.x, a.vec1.y].join(' ');
      }
      else if(a.command == 'cubic'){
        return (a.relative ? "c" : "C") + " " + [a.vec1.x, a.vec1.y, a.vec2.x, a.vec2.y, a.vec3.x, a.vec3.y].join(' ');
      }
      else if(a.command == 'quad' && !_.isUndefined(a.vec2)){
        return (a.relative ? "q" : "Q") + " " + [a.vec1.x, a.vec1.y, a.vec2.x, a.vec2.y].join(' ');
      }
      else if(a.command == 'quad'){
        return (a.relative ? "t" : "T") + " " + [a.vec1.x, a.vec1.y].join(' ');
      }
      else if(a.command == 'close'){
        return "Z";
      }
    }).join(" ").trim();
  }

  // Helpers
  // --------------------------------------------------

  // function to turn any non-string into a string. We need
  // this when running server-side node.
  s(val) {
    if(!_.isString(val) && !_.isUndefined(val.toString))
      return val.toString();
    return val;
  }

}

export default Render;