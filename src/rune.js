import _ from "underscore"
import { Circle } from "./shapes/circle"
import { Color } from "./color"
import { Group } from "./group"
import { Render } from "./render"

class Rune {

  constructor(options) {

    var params = _.defaults(options || {}, {
      width: 640,
        height: 480,
        debug: false,
        frameRate: 60
      }
    );

    this.width = params.width;
    this.height = params.height;
    this.renderer = new Render(params);
    this.stage = new Group();
    this.debug = params.debug;
    this.frameCount = 1;
    this.frameRate = params.frameRate;

    if(params.container) {

      if(_.isString(params.container)) {
        params.container = document.querySelector(params.container);
      }

      if(params.container) {
        this.appendTo(params.container);
      } else {
        console.error("Container element not found");
      }
    }

    this.initEvents();
  }

  // Events
  // --------------------------------------------------

  initEvents() {
    this.initMouseMove();
  }

  initMouseMove() {
    var mouseMove = _.bind(function(e) {
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

  group(x, y, parent) {
    var group = new Rune.Group(x, y);
    Rune.addToGroup(group, this.stage, parent);
    return group;
  }

  rect(x, y, width, height, group) {
    var rect = new Rune.Rectangle(x, y, width, height);
    Rune.addToGroup(rect, this.stage, group);
    return rect;
  }

  ellipse(x, y, width, height, group) {
    var ell = new Rune.Ellipse(x, y, width, height);
    Rune.addToGroup(ell, this.stage, group);
    return ell;
  }

  circle(x, y, radius, group) {
    var circ = new Rune.Circle(x, y,radius);
    Rune.addToGroup(circ, this.stage, group);
    return circ;
  }

  line(x1, y1, x2, y2, group) {
    var line = new Rune.Line(x1, y1, x2, y2);
    Rune.addToGroup(line, this.stage, group);
    return line;
  }

  polygon(x, y, group) {
    var poly = new Rune.Polygon(x, y);
    Rune.addToGroup(poly, this.stage, group);
    return poly;
  }

  path(x, y, group) {
    var path = new Rune.Path(x, y);
    Rune.addToGroup(path, this.stage, group);
    return path;
  }

  text(text, x, y, group) {
    var text = new Rune.Text(text, x, y);
    Rune.addToGroup(text, this.stage, group);
    return text;
  }

  grid(options, parent) {
    var grid = new Rune.Grid(options);
    Rune.addToGroup(grid, this.stage, parent);
    return grid;
  }

  // Playhead
  // --------------------------------------------------

  play() {
    if(this.frameRate >= 60)  this.playNow();
    else                      setTimeout(_.bind(this.playNow, this), 1000 / this.frameRate);
  }

  playNow() {
    this.trigger('draw', { frameCount: this.frameCount });
    this.animationFrame = requestAnimationFrame(_.bind(this.play, this));
    this.draw();
  }

  pause() {
    cancelAnimationFrame(this.animationFrame);
  }

  // Render functions
  // --------------------------------------------------

  getEl() {
    return this.renderer.el;
  }

  appendTo(container) {
    container.appendChild(this.renderer.el);
    return this;
  }

  draw() {
    this.renderer.render(this.stage, { debug: this.debug });
    this.frameCount += 1;
  }

  // Static functions
  // --------------------------------------------------

  static addToGroup(child, fallback, group) {

    // if group is undefined, add to fallback
    if(_.isUndefined(group) && fallback && fallback.type == "group")
      fallback.add(child)
    // if group is specified, add to group
    else if(group && group.type == "group")
      group.add(child)
    // otherwise don't add to anything
  }

}


// Utils
// --------------------------------------------------

var Utils = {

  random: function(a, b) {
    if(_.isUndefined(b)) {
      b = a;
      a = 0;
    }
    return a + (Math.random() * (b-a));
  },

  degrees: function(radians) {
    return radians * (180/Math.PI);
  },

  radians: function(degrees) {
    return degrees * (Math.PI/180);
  }

};

// Utility functions exist on both the class and
// the instance just to give users a shortcut.
_.extend(Rune, Utils);
_.extend(Rune.prototype, Utils);


//=require mixins/*.js
//=require events.js
//=require color.js
//=require group.js
//=require grid.js
//=require vector.js
//=require anchor.js
//=require render.js
//=require shapes/rect.js
//=require shapes/ellipse.js
//=require shapes/circle.js
//=require shapes/line.js
//=require shapes/polygon.js
//=require shapes/path.js
//=require shapes/text.js

//_.extend(Rune.prototype, Rune.Events)

// Export modules for easy use
Rune.Circle = Circle;
Rune.Color = Color;
Rune.Group = Group;

global.Rune = Rune;

export default Rune;