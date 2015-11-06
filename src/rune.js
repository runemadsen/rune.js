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
import { Sizeable, Moveable, Styleable } from "./mixins"

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

    if(params.container && typeof window !== 'undefined') {

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
    var g = new Group(x, y);
    Utils.groupLogic(g, this.stage, parent);
    return g;
  }

  triangle(x, y, x2, y2, x3, y3, parent) {
    var t = new Triangle(x, y, x2, y2, x3, y3);
    Utils.groupLogic(t, this.stage, parent);
    return t;
  }

  rect(x, y, width, height, parent) {
    var r = new Rectangle(x, y, width, height);
    Utils.groupLogic(r, this.stage, parent);
    return r;
  }

  ellipse(x, y, width, height, parent) {
    var e = new Ellipse(x, y, width, height);
    Utils.groupLogic(e, this.stage, parent);
    return e;
  }

  circle(x, y, radius, parent) {
    var c = new Circle(x, y,radius);
    Utils.groupLogic(c, this.stage, parent);
    return c;
  }

  line(x1, y1, x2, y2, parent) {
    var l = new Line(x1, y1, x2, y2);
    Utils.groupLogic(l, this.stage, parent);
    return l;
  }

  polygon(x, y, parent) {
    var p = new Polygon(x, y);
    Utils.groupLogic(p, this.stage, parent);
    return p;
  }

  path(x, y, parent) {
    var p = new Path(x, y);
    Utils.groupLogic(p, this.stage, parent);
    return p;
  }

  text(textString, x, y, parent) {
    var t = new Text(textString, x, y);
    Utils.groupLogic(t, this.stage, parent);
    return t;
  }

  grid(options, parent) {
    var g = new Grid(options);
    Utils.groupLogic(g, this.stage, parent);
    return g;
  }

  // Playhead
  // --------------------------------------------------

  // This function is a proxy function that is run on every frame
  // It has a check that delays the frame with a setTimeout if
  // the framerate is lower than 60 fps.
  play() {
    if(this.pauseNext) {
      this.pauseNext = false;
      return;
    }

    if(this.frameRate >= 60)  this.playNow();
    else                      setTimeout(_.bind(this.playNow, this), 1000 / this.frameRate);
  }

  playNow() {
    this.trigger('draw', { frameCount: this.frameCount });
    this.animationFrame = requestAnimationFrame(_.bind(this.play, this));
    this.draw();
  }

  pause() {
    this.pauseNext = true;
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

export default Rune;
