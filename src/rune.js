(function() {

  var root = this;

  // Constructor
  // --------------------------------------------------

  var Rune = root.Rune = function(options) {

    var params = _.defaults(options || {}, {
      width: 640,
      height: 480
    });

    this.width = params.width;
    this.height = params.height;
    this.renderer = new Rune.Render(params);
    this.stage = new Rune.Group();

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
  }

  _.extend(Rune.prototype, {

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
      this.renderer.render(this.stage);
    }

  });

  // Static functions
  // --------------------------------------------------

  _.extend(Rune, {

    addToGroup: function(child, fallback, group) {

      // if group is undefined, add to fallback
      if(_.isUndefined(group) && fallback.type == "group")
        fallback.add(child)
      // if group is specified, add to group
      else if(group && group.type == "group")
        group.add(child)
      // otherwise don't add to anything
    }

  });

})();

//=require mixins.js
//=require events.js
//=require color.js
//=require group.js
//=require vector.js
//=require anchor.js
//=require render.js
//=require shapes/rect.js
//=require shapes/ellipse.js
//=require shapes/circle.js
//=require shapes/line.js
//=require shapes/polygon.js
//=require shapes/path.js

//_.extend(Rune.prototype, Rune.Events)

