var assign = require("object-assign");
var Vector = require("./vector");
var Anchor = require("./anchor");
var Color = require("./color");
var Group = require("./group");
var Grid = require("./grid");
var Node = require("./node");
var Utils = require("./utils");
var Events = require("./events");
var Circle = require("./shapes/circle");
var Ellipse = require("./shapes/ellipse");
var Line = require("./shapes/line");
var Triangle = require("./shapes/triangle");
var Path = require("./shapes/path");
var Polygon = require("./shapes/polygon");
var Rectangle = require("./shapes/rectangle");
var Text = require("./shapes/text");
var Image = require("./shapes/image");
var Box = require("./mixins/box");
var Shape = require("./mixins/shape");
var Styles = require("./mixins/styles");

var h = require("virtual-dom/h");
var diff = require("virtual-dom/diff");
var patch = require("virtual-dom/patch");
var createElement = require("virtual-dom/create-element");
var svg = require("virtual-dom/virtual-hyperscript/svg");

// Constructor
// --------------------------------------------------

var Rune = function(options) {
  var params = assign(
    {
      debug: false,
      frameRate: 60
    },
    options
  );

  var attrs = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink"
  };

  if (params.width) {
    attrs.width = Utils.s(params.width);
    this.width = params.width;
  }

  if (params.height) {
    attrs.height = Utils.s(params.height);
    this.height = params.height;
  }

  if (attrs.width && attrs.height) {
    attrs.viewBox = "0 0 " + attrs.width + " " + attrs.height;
  }

  var props = {
    attributes: attrs
  };

  this.tree = svg("svg", props);
  this.el = createElement(this.tree);
  this.stage = new Group();
  this.debug = params.debug;
  this.frameCount = 1;
  this.frameRate = params.frameRate;

  if (params.container && Utils.isBrowser()) {
    if (typeof params.container === "string") {
      params.container = document.querySelector(params.container);
    }

    if (params.container) {
      this.appendTo(params.container);
      var bounds = this.el.getBoundingClientRect();
      if (!this.width) {
        this.width = bounds.width;
        this.ignoreWidth = true;
      }
      if (!this.height) {
        this.height = bounds.height;
        this.ignoreHeight = true;
      }
    } else {
      console.error("Container element not found");
    }
  }

  // last resort to catch no dimensions
  if (!this.width) this.width = 640;
  if (!this.height) this.height = 480;

  this.initEvents();
};

Rune.prototype = {
  // Helpers
  // --------------------------------------------------

  //
  handleSize: function() {},

  relativePos: function(pageX, pageY) {
    var bounds = this.el.getBoundingClientRect();
    var relX = pageX - window.scrollX - bounds.left;
    var relY = pageY - window.scrollY - bounds.top;
    return { x: relX, y: relY };
  },

  // Events
  // --------------------------------------------------

  initEvents: function() {
    // Specific browser events
    if (typeof window !== "undefined") {
      this.initMouseEvents();
    }
  },

  initMouseEvents: function() {
    var mouseEvents = ["mousemove", "mousedown", "mouseup", "click"];
    var that = this;
    for (var i = 0; i < mouseEvents.length; i++) {
      this.el.addEventListener(mouseEvents[i], function(e) {
        var rel = that.relativePos(e.pageX, e.pageY);
        that.trigger(mouseEvents[i], { x: rel.x, y: rel.y });
      });
    }
  },

  // Shape functions
  // --------------------------------------------------

  node: function(name, attr, children, parent) {
    var n = new Node(name, attr, children);
    Utils.groupLogic(n, this.stage, parent);
    return n;
  },

  group: function(x, y, parent) {
    var g = new Group(x, y);
    Utils.groupLogic(g, this.stage, parent);
    return g;
  },

  triangle: function(x, y, x2, y2, x3, y3, parent) {
    var t = new Triangle(x, y, x2, y2, x3, y3);
    Utils.groupLogic(t, this.stage, parent);
    return t;
  },

  rect: function(x, y, width, height, parent) {
    var r = new Rectangle(x, y, width, height);
    Utils.groupLogic(r, this.stage, parent);
    return r;
  },

  ellipse: function(x, y, width, height, parent) {
    var e = new Ellipse(x, y, width, height);
    Utils.groupLogic(e, this.stage, parent);
    return e;
  },

  circle: function(x, y, radius, parent) {
    var c = new Circle(x, y, radius, parent);
    Utils.groupLogic(c, this.stage, parent);
    return c;
  },

  line: function(x1, y1, x2, y2, parent) {
    var l = new Line(x1, y1, x2, y2);
    Utils.groupLogic(l, this.stage, parent);
    return l;
  },

  polygon: function(x, y, parent) {
    var p = new Polygon(x, y);
    Utils.groupLogic(p, this.stage, parent);
    return p;
  },

  path: function(x, y, parent) {
    var p = new Path(x, y);
    Utils.groupLogic(p, this.stage, parent);
    return p;
  },

  text: function(textString, x, y, parent) {
    var t = new Text(textString, x, y);
    Utils.groupLogic(t, this.stage, parent);
    return t;
  },

  image: function(url, x, y, width, height, parent) {
    var i = new Image(url, x, y, width, height);
    Utils.groupLogic(i, this.stage, parent);
    return i;
  },

  grid: function(options, parent) {
    var g = new Grid(options);
    Utils.groupLogic(g, this.stage, parent);
    return g;
  },

  // Playhead
  // --------------------------------------------------

  // This function is a proxy function that is run on every frame
  // It has a check that delays the frame with a setTimeout if
  // the framerate is lower than 60 fps.
  play: function() {
    if (this.pauseNext) {
      this.pauseNext = false;
      return;
    }

    if (this.frameRate >= 60) {
      this.playNow();
    } else {
      var that = this;
      setTimeout(function() {
        that.playNow();
      }, 1000 / this.frameRate);
    }
  },

  playNow: function() {
    var that = this;
    this.trigger("update", { frameCount: this.frameCount });
    this.animationFrame = requestAnimationFrame(function() {
      that.play();
    });
    this.draw();
  },

  pause: function() {
    this.pauseNext = true;
  },

  // Render functions
  // --------------------------------------------------

  appendTo: function(container) {
    container.appendChild(this.el);
    return this;
  },

  draw: function() {
    var attrs = {
      xmlns: "http://www.w3.org/2000/svg",
      "xmlns:xlink": "http://www.w3.org/1999/xlink"
    };

    if (!this.ignoreWidth) attrs.width = Utils.s(this.width);
    if (!this.ignoreHeight) attrs.height = Utils.s(this.height);

    var props = {
      attributes: attrs
    };

    var newTree = svg("svg", props, [
      this.stage.renderChildren({ debug: this.debug })
    ]);
    var diffTree = diff(this.tree, newTree);
    this.el = patch(this.el, diffTree);
    this.tree = newTree;

    this.frameCount += 1;
  }
};

assign(Rune, Utils);
assign(Rune.prototype, Utils);
assign(Rune.prototype, Events);

// Modules should be accessible through Rune
Rune.Vector = Vector;
Rune.Anchor = Anchor;
Rune.Color = Color;
Rune.Group = Group;
Rune.Node = Node;
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
Rune.Shape = Shape;
Rune.Styles = Styles;
Rune.Box = Box;

module.exports = Rune;
