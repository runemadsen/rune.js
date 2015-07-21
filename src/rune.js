(function() {

  var root = this;

  // Constructor
  // --------------------------------------------------

  var Rune = root.Rune = function(options) {

    var params = _.defaults(options || {}, {
      width: 640,
      height: 480
    });

    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.stage = new Rune.Group();
  }

  // Shape functions
  // --------------------------------------------------

  _.extend(Rune.prototype, {

    addFromParam: function(child, group) {

      // if group is undefined, add to the
      // main stage group.
      if(_.isUndefined(group))
        this.stage.add(child)
      // if group is not false or undefined,
      // add to the specificed group.
      else if(group !== false)
        group.add(child)
    },

    rect: function(x, y, width, height, group) {
      var rect = new Rune.Rectangle(x, y, width, height);
      this.addFromParam(rect, group);
      return rect;
    },

    ellipse: function(x, y, width, height, group) {
      var ell = new Rune.Ellipse(x, y, width, height);
      this.addFromParam(ell, group);
      return ell;
    },

    circle: function(x, y, radius, group) {
      var circ = new Rune.Circle(x, y,radius);
      this.addFromParam(circ, group);
      return circ;
    },

    line: function(x1, y1, x2, y2, group) {
      var line = new Rune.Line(x1, y1, x2, y2);
      this.addFromParam(line, group);
      return line;
    }

  });

  // Render functions
  // --------------------------------------------------

  _.extend(Rune.prototype, {

    draw: function() {

      // render main group as a vdom object,
      // then add to document.

    }
  );

})();

//=require events.js
//=require group.js
//=require vector.js
//=require render.js
//=require shapes/rect.js
//=require shapes/ellipse.js
//=require shapes/circle.js
//=require shapes/line.js

_.extend(Rune.prototype, Rune.Events)

