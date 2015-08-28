import _ from "underscore"

import Vector from "./vector"
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
import Path from "./shapes/path"
import Polygon from "./shapes/polygon"
import Rectangle from "./shapes/rectangle"
import Text from "./shapes/text"

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
    var group = new Group(x, y);
    Utils.addToGroup(group, this.stage, parent);
    return group;
  }

  rect(x, y, width, height, group) {
    var rect = new Rectangle(x, y, width, height);
    Utils.addToGroup(rect, this.stage, group);
    return rect;
  }

  ellipse(x, y, width, height, group) {
    var ell = new Ellipse(x, y, width, height);
    Utils.addToGroup(ell, this.stage, group);
    return ell;
  }

  circle(x, y, radius, group) {
    var circ = new Circle(x, y,radius);
    Utils.addToGroup(circ, this.stage, group);
    return circ;
  }

  line(x1, y1, x2, y2, group) {
    var line = new Line(x1, y1, x2, y2);
    Utils.addToGroup(line, this.stage, group);
    return line;
  }

  polygon(x, y, group) {
    var poly = new Polygon(x, y);
    Utils.addToGroup(poly, this.stage, group);
    return poly;
  }

  path(x, y, group) {
    var path = new Path(x, y);
    Utils.addToGroup(path, this.stage, group);
    return path;
  }

  text(text, x, y, group) {
    var text = new Text(text, x, y);
    Utils.addToGroup(text, this.stage, group);
    return text;
  }

  grid(options, parent) {
    var grid = new Grid(options);
    Utils.addToGroup(grid, this.stage, parent);
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

// Utility functions exist on both the class and
// the instance just to give users a shortcut.
_.extend(Rune, Utils);
_.extend(Rune.prototype, Utils);
_.extend(Rune.prototype, Events)

// Export modules for easy access without imports
Rune.Vector = Vector;
Rune.Anchor = Anchor;
Rune.Color = Color;
Rune.Group = Group;
Rune.Grid = Grid;
Rune.Circle = Circle;
Rune.Ellipse = Ellipse;
Rune.Line = Line;
Rune.Path = Path;
Rune.Polygon = Polygon;
Rune.Rectangle = Rectangle;
Rune.Text = Text;

// Exports modules for easy access when using module
import { default as vector } from "./vector";
import { default as anchor } from "./anchor";
import { default as color } from "./color";
import { default as group } from "./group";
import { default as grid } from "./grid";
import { default as utils } from "./utils";
import { default as events } from "./events";
import { default as render } from "./render";
import { default as circle } from "./shapes/circle";
import { default as ellipse } from "./shapes/ellipse";
import { default as line } from "./shapes/line";
import { default as path } from "./shapes/path";
import { default as polygon } from "./shapes/polygon";
import { default as rectangle } from "./shapes/rectangle";
import { default as text } from "./shapes/text";

// define window.Rune for browserify
global.Rune = Rune;

export default Rune;