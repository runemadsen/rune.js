(function() {

  var root = this;

  // Constructor
  // --------------------------------------------------

  var Rune = root.Rune = function(options) {

    var params = _.defaults(options || {}, {
      width: 640,
      height: 480,
      debug: false,
      frameRate: 60
    });

    this.width = params.width;
    this.height = params.height;
    this.renderer = new Rune.Render(params);
    this.stage = new Rune.Group();
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

  Rune.DRAW = "draw";
  Rune.RGB = "rgb";
  Rune.HSV = "hsv";
  Rune.MOVE = "move"
  Rune.LINE = "line"
  Rune.CUBIC = "cubic"
  Rune.QUAD = "quad"
  Rune.CLOSE = "close"
  Rune.BUTT = "butt";
  Rune.ROUND = "round";
  Rune.SQUARE = "square";
  Rune.MITER = "miter";
  Rune.BEVEL = "bevel";


  _.extend(Rune.prototype, {

    // Events
    // --------------------------------------------------

    initEvents : function() {
      this.initMouseMove();
    },

    initMouseMove : function() {
      var mouseMove = _.bind(function(e) {
        var bounds = this.renderer.el.getBoundingClientRect();
        this.trigger('mousemove', {
          x: e.pageX - bounds.left,
          y: e.pageY - bounds.top
        });
      }, this);
      document.addEventListener('mousemove', mouseMove, false);
    },

    // Shape functions
    // --------------------------------------------------

    group: function(x, y, parent) {
      var group = new Rune.Group(x, y);
      Rune.addToGroup(group, this.stage, parent);
      return group;
    },

    rect: function(x, y, width, height, group) {
      var rect = new Rune.Rectangle(x, y, width, height);
      Rune.addToGroup(rect, this.stage, group);
      return rect;
    },

    ellipse: function(x, y, width, height, group) {
      var ell = new Rune.Ellipse(x, y, width, height);
      Rune.addToGroup(ell, this.stage, group);
      return ell;
    },

    circle: function(x, y, radius, group) {
      var circ = new Rune.Circle(x, y,radius);
      Rune.addToGroup(circ, this.stage, group);
      return circ;
    },

    line: function(x1, y1, x2, y2, group) {
      var line = new Rune.Line(x1, y1, x2, y2);
      Rune.addToGroup(line, this.stage, group);
      return line;
    },

    polygon: function(x, y, group) {
      var poly = new Rune.Polygon(x, y);
      Rune.addToGroup(poly, this.stage, group);
      return poly;
    },

    path: function(x, y, group) {
      var path = new Rune.Path(x, y);
      Rune.addToGroup(path, this.stage, group);
      return path;
    },

    grid: function(options, parent) {
      var grid = new Rune.Grid(options);
      Rune.addToGroup(grid, this.stage, parent);
      return grid;
    },

    // Playhead
    // --------------------------------------------------

    play: function() {
      if(this.frameRate >= 60)  this.playNow();
      else                      setTimeout(_.bind(this.playNow, this), 1000 / this.frameRate);
    },

    playNow: function() {
      this.trigger(Rune.DRAW, { frameCount: this.frameCount });
      this.animationFrame = requestAnimationFrame(_.bind(this.play, this));
      this.draw();
    },

    pause: function() {
      cancelAnimationFrame(this.animationFrame);
    },

    // Render functions
    // --------------------------------------------------

    getEl: function() {
      return this.renderer.el;
    },

    appendTo: function(container) {
      container.appendChild(this.renderer.el);
      return this;
    },

    draw: function() {
      this.renderer.render(this.stage, { debug: this.debug });
      this.frameCount += 1;
    },

    // Utils
    // --------------------------------------------------

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

  });

  // Static functions
  // --------------------------------------------------

  _.extend(Rune, {

    addToGroup: function(child, fallback, group) {

      // if group is undefined, add to fallback
      if(_.isUndefined(group) && fallback && fallback.type == "group")
        fallback.add(child)
      // if group is specified, add to group
      else if(group && group.type == "group")
        group.add(child)
      // otherwise don't add to anything
    }

  });

})();

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

_.extend(Rune.prototype, Rune.Events)

