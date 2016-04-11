import flatten from "lodash/array/flatten"
import each from "lodash/collection/each"
import map from "lodash/collection/map"
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
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink',
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
    var newObjects = [];
    for(var i = 0; i < objects.length; i++) {
      newObjects.push(this.objectToSVG(objects[i], opts));
    }
    return flatten(newObjects, true);
  }

  rectangleToSVG(rect) {
    var attr = {
      x: this.s(rect.vars.x),
      y: this.s(rect.vars.y),
      width: this.s(rect.vars.width),
      height: this.s(rect.vars.height)
    }
    if(rect.vars.rx)  attr.rx = this.s(rect.vars.rx);
    if(rect.vars.ry)  attr.ry = this.s(rect.vars.ry);
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
      points: '0 0 ' + tri.vars.x2 + ' ' + tri.vars.y2 + ' ' + tri.vars.x3 + ' ' + tri.vars.y3
    };
    this.transformAttribute(attr, tri);
    this.styleableAttributes(tri, attr);
    return svg('polygon', attr);
  }

  polygonToSVG(polygon) {
    var attr = {
      points: map(polygon.vars.vectors, function(vec) {
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

    var lines = text.vars.text.split("\n");
    var children = [];
    var deltaY;
    for (var i=0; i<lines.length; i++){
      if (i === 0){
        deltaY = "0em";
      }else{
        deltaY = "1.2em";

        if(text.vars.lineHeight){
          deltaY = text.vars.lineHeight;
        }
      }
      var child = svg('tspan', {x: attr.x, dy: deltaY}, lines[i]);
      children.push(child);
    }

    return svg('text', attr, children);
  }

  imageToSVG(img) {
    var attr = {
      "xlink:href" : this.s(img.vars.url),
      x: this.s(img.vars.x),
      y: this.s(img.vars.y)
    }
    this.optionalAttributes(img, attr, {
      "width" : "width",
      "height" : "height"
    });
    this.transformAttribute(attr, img);
    return svg('image', attr);
  }

  groupToSVG(group, opts) {
    if(!group.children || group.children.length == 0) return;
    var attr = {}
    this.transformAttribute(attr, group);
    return svg('g', attr, this.objectsToSVG(group.children, opts));
  }

  gridToSVG(grid, opts) {
    var attr = {}
    this.transformAttribute(attr, grid);
    var groups = this.objectsToSVG(grid.modules);
    if(opts && opts.debug) groups = groups.concat(this.debugGridToSVG(grid));

    return svg('g', attr, flatten(groups, true));
  }

  // Multiple attributes
  // --------------------------------------------------

  optionalAttributes (object, attr, keys) {
    each(keys, function(attribute, variable) {
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

    if(object.vars.fill === false)    attr.fill = "none";
    else if(object.vars.fill) {
      attr.fill = "rgb(" + object.vars.fill.values.rgb[0] + ", " + object.vars.fill.values.rgb[1] + ", " + object.vars.fill.values.rgb[2] + ")";
      var alpha = object.vars.fill.values.alpha;
      if(alpha < 1) attr["fill-opacity"] = this.s(alpha);
    }

    if(object.vars.stroke === false)  attr.stroke = "none";
    else if(object.vars.stroke) {
      attr.stroke = "rgb(" + object.vars.stroke.values.rgb[0] + ", " + object.vars.stroke.values.rgb[1] + ", " + object.vars.stroke.values.rgb[2] + ")";
      var alpha = object.vars.stroke.values.alpha;
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

    if((shape.type == "group" || shape.type == "path" || shape.type == "polygon" || shape.type == "grid" || shape.type == "triangle") && (vars.x || vars.y)) {
      strings.push("translate(" + vars.x + " " + vars.y + ")");
    }

    if(strings.length > 0)
      attr.transform = strings.join(" ").trim();
  }

  dAttribute(object, attr) {
    attr.d = map(object.vars.anchors, function(a) {

      if(a.command == 'move') {
        return (a.relative ? "m" : "M") + " " + [a.vec1.x, a.vec1.y].join(' ');
      }
      else if(a.command == 'line') {
        return (a.relative ? "l" : "L") + " " + [a.vec1.x, a.vec1.y].join(' ');
      }
      else if(a.command == 'cubic'){
        return (a.relative ? "c" : "C") + " " + [a.vec1.x, a.vec1.y, a.vec2.x, a.vec2.y, a.vec3.x, a.vec3.y].join(' ');
      }
      else if(a.command == 'quad' && typeof a.vec2 !== 'undefined') {
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

  // Debug
  // --------------------------------------------------

  debugPathToSVG(path) {

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

  // Helpers
  // --------------------------------------------------

  // function to turn any non-string into a string. We need
  // this when running server-side node.
  s(val) {
    if(typeof val !== 'string' && typeof val.toString !== 'undefined')
      return val.toString();
    return val;
  }

}

export default Render;
