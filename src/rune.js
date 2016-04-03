import defaults from "lodash/object/defaults"
import assign from "lodash/object/assign"
import each from "lodash/collection/each"
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
import Image from "./shapes/image"
import { Sizeable, Moveable, Styleable } from "./mixins"

class Rune {

  constructor(options) {

    var params = defaults(options || {}, {
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

      if(typeof params.container === 'string') {
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
      this.initMouseEvents();
    }

  }

  relativePos(pageX, pageY) {
    var bounds = this.renderer.el.getBoundingClientRect();
    var relX = pageX - bounds.left;
    var relY = pageY - bounds.top;
    return { x: relX, y: relY };
  }

  initMouseEvents() {
    var mouseEvents = ['mousemove', 'mousedown', 'mouseup', 'click'];
    each(mouseEvents, function(mouseEvent) {
      var that = this;
      this.renderer.el.addEventListener(mouseEvent, function(e) {
        var rel = that.relativePos(e.pageX, e.pageY);
        that.trigger(mouseEvent, { x: rel.x, y: rel.y });
      });
    }, this);
  }

  // Shape functions
  // --------------------------------------------------

  group(x, y, parent) {
    var g = Utils.invokeConstructor(Group, arguments);
    Utils.groupLogic(g, this.stage, arguments[arguments.length-1]);
    return g;
  }

  triangle(x, y, x2, y2, x3, y3, parent) {
    var t = Utils.invokeConstructor(Triangle, arguments);
    Utils.groupLogic(t, this.stage, arguments[arguments.length-1]);
    return t;
  }

  rect(x, y, width, height, parent) {
    var r = Utils.invokeConstructor(Rectangle, arguments);
    Utils.groupLogic(r, this.stage, arguments[arguments.length-1]);
    return r;
  }

  ellipse(x, y, width, height, parent) {
    var e = Utils.invokeConstructor(Ellipse, arguments);
    Utils.groupLogic(e, this.stage, arguments[arguments.length-1]);
    return e;
  }

  circle(x, y, radius, parent) {
    var c = Utils.invokeConstructor(Circle, arguments);
    Utils.groupLogic(c, this.stage, arguments[arguments.length-1]);
    return c;
  }

  line(x1, y1, x2, y2, parent) {
    var l = Utils.invokeConstructor(Line, arguments);
    Utils.groupLogic(l, this.stage, arguments[arguments.length-1]);
    return l;
  }

  polygon(x, y, parent) {
    var p = Utils.invokeConstructor(Polygon, arguments);
    Utils.groupLogic(p, this.stage, arguments[arguments.length-1]);
    return p;
  }

  path(x, y, parent) {
    var p = Utils.invokeConstructor(Path, arguments);
    Utils.groupLogic(p, this.stage, arguments[arguments.length-1]);
    return p;
  }

  text(textString, x, y, parent) {
    var t = Utils.invokeConstructor(Text, arguments);
    Utils.groupLogic(t, this.stage, arguments[arguments.length-1]);
    return t;
  }

  image(url, x, y, width, height, parent) {
    var i = Utils.invokeConstructor(Image, arguments);
    Utils.groupLogic(i, this.stage, arguments[arguments.length-1]);
    return i;
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

    if(this.frameRate >= 60) {
      this.playNow();
    }
    else {
      var that = this;
      setTimeout(function() { that.playNow() }, 1000 / this.frameRate);
    }
  }

  playNow() {
    var that = this;
    this.trigger('draw', { frameCount: this.frameCount });
    this.animationFrame = requestAnimationFrame(function() {
      that.play();
    });
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

assign(Rune, Utils);
assign(Rune.prototype, Events)

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
Rune.Image = Image;

// Right now I need these for mixin tests.
// Rewrite so we don't need them.
Rune.Moveable = Moveable;
Rune.Styleable = Styleable;
Rune.Sizeable = Sizeable;

export default Rune;
