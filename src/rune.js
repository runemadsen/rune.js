import _ from "underscore"

import Vector from "./vector";
import Anchor from "./anchor"
import Color from "./color"
import Group from "./group"
import Grid from "./grid"
import Utils from "./utils"
import Events from "./events"
import Render from "./render"
import Circle from "./shapes/circle"
import Ellipse from "./shapes/ellipse"
import Line from "./shapes/line"
import Triangle from "./shapes/triangle"
import Path from "./shapes/path"
import Polygon from "./shapes/polygon"
import Rectangle from "./shapes/rectangle"
import Text from "./shapes/text"
import { Sizeable, Moveable, Styleable, Groupable } from "./mixins"

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

    if(params.container && !_.isUndefined(window)) {

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

    // Specific browser events
    if(typeof window !== 'undefined') {
      this.initMouseMove();
    }

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
    var group = new Group(x, y);
    Utils.groupLogic(group, this.stage, parent);
    return group;
  }

  triangle(x, y, x2, y2, x3, y3, parent) {
    var tri = new Triangle(x, y, x2, y2, x3, y3);
    Utils.groupLogic(tri, this.stage, parent);
    return tri;
  }

  rect(x, y, width, height, parent) {
    var rect = new Rectangle(x, y, width, height);
    Utils.groupLogic(rect, this.stage, parent);
    return rect;
  }

  ellipse(x, y, width, height, parent) {
    var ell = new Ellipse(x, y, width, height);
    Utils.groupLogic(ell, this.stage, parent);
    return ell;
  }

  circle(x, y, radius, parent) {
    var circ = new Circle(x, y,radius);
    Utils.groupLogic(circ, this.stage, parent);
    return circ;
  }

  line(x1, y1, x2, y2, parent) {
    var line = new Line(x1, y1, x2, y2);
    Utils.groupLogic(line, this.stage, parent);
    return line;
  }

  polygon(x, y, parent) {
    var poly = new Polygon(x, y);
    Utils.groupLogic(poly, this.stage, parent);
    return poly;
  }

  path(x, y, parent) {
    var path = new Path(x, y);
    Utils.groupLogic(path, this.stage, parent);
    return path;
  }

  text(text, x, y, parent) {
    var text = new Text(text, x, y);
    Utils.groupLogic(text, this.stage, parent);
    return text;
  }

  grid(options, parent) {
    var grid = new Grid(options);
    Utils.groupLogic(grid, this.stage, parent);
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

}

_.extend(Rune, Utils);
_.extend(Rune.prototype, Events)

// Modules should be accessible through Rune
Rune.Vector = Vector;
Rune.Anchor = Anchor;
Rune.Color = Color;
Rune.Group = Group;
Rune.Grid = Grid;
Rune.Circle = Circle;
Rune.Ellipse = Ellipse;
Rune.Line = Line;
Rune.Triangle = Triangle;
Rune.Path = Path;
Rune.Polygon = Polygon;
Rune.Rectangle = Rectangle;
Rune.Text = Text;

// Right now I need these for mixin tests.
// Rewrite so we don't need them.
Rune.Moveable = Moveable;
Rune.Styleable = Styleable;
Rune.Sizeable = Sizeable;
Rune.Groupable = Groupable;

// define window.Rune for browserify
global.Rune = Rune;

export default Rune;