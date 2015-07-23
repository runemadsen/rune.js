(function(Rune) {

  var Render = Rune.Render = function(params) {

    this.params = params

    this.tree = virtualdom.svg('svg', {
      width: params.width,
      height: params.height
    });

    this.el = virtualdom.createElement(this.tree);

  }

  _.extend(Render.prototype, {

    render: function(stage) {

      var newTree = virtualdom.svg('svg', {
        width: this.params.width,
        height: this.params.height
      }, [this.objectsToSVG(stage.children)]);

      var diff = virtualdom.diff(this.tree, newTree);
      this.el = virtualdom.patch(this.el, diff);
      this.tree = newTree;
    },

    // Shape converters
    // --------------------------------------------------

    objectToSVG: function(object) {
      if(this[object.type + "ToSVG"])
        return this[object.type + "ToSVG"](object);
      else
        console.error("Rune.Render: Object not recognized", object)
    },

    objectsToSVG: function(objects) {
      return _.map(objects, _.bind(this.objectToSVG, this));
    },

    groupToSVG: function(group) {
      var attr = {}
      this.transformAttribute(attr, group.rotation, group.x, group.y);
      return virtualdom.svg('g', attr, this.objectsToSVG(group.children));
    },

    rectangleToSVG: function(rect) {
      var attr = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      }
      this.transformAttribute(attr, rect.rotation);
      this.styleableAttributes(rect, attr);
      return virtualdom.svg('rect', attr);
    },

    ellipseToSVG: function(ellipse) {
      var attr = {
        cx: ellipse.x,
        cy: ellipse.y,
        rx: ellipse.width,
        ry: ellipse.height
      }
      this.transformAttribute(attr, ellipse.rotation);
      this.styleableAttributes(ellipse, attr);
      return virtualdom.svg('ellipse', attr);
    },

    circleToSVG: function(circle) {
      var attr = {
        cx: circle.x,
        cy: circle.y,
        r: circle.radius
      }
      this.transformAttribute(attr, circle.rotation);
      this.styleableAttributes(circle, attr);
      return virtualdom.svg('circle', attr);
    },

    lineToSVG: function(line) {
      var attr = {
        x1: line.x,
        y1: line.y,
        x2: line.x2,
        y2: line.y2
      }
      this.transformAttribute(attr, line.rotation);
      this.styleableAttributes(line, attr);
      return virtualdom.svg('line', attr);
    },

    polygonToSVG: function(polygon) {
      var attr = {
        points: _.map(polygon.vectors, function(vec) {
          return vec.x + " " + vec.y;
        }).join(" ")
      };
      this.transformAttribute(attr, polygon.rotation, polygon.x, polygon.y);
      this.styleableAttributes(polygon, attr);
      return virtualdom.svg('polygon', attr);
    },

    pathToSVG: function(path) {
      var attr = {};
      this.dAttribute(path, attr);
      this.transformAttribute(attr, path.rotation, path.x, path.y);
      this.styleableAttributes(path, attr);
      return virtualdom.svg('path', attr);
    },

    // Mixin converters
    // --------------------------------------------------

    sizeableAttributes: function(object, attr) {
      attr.width = object.width;
      attr.height = object.height;
    },

    styleableAttributes: function(object, attr) {
      attr.fill = object.fillColor.hexString();
      attr.stroke = object.strokeColor.hexString();
    },

    // Single attributes
    // --------------------------------------------------

    transformAttribute: function(attr, rotation, x, y) {
      var strings = []
      if(rotation > 0)    strings.push("rotate(" + rotation + ")");
      if(x > 0 || y > 0)  strings.push("translate(" + x + " " + y + ")");
      attr.transform = strings.join(" ").trim();
    },

    dAttribute: function(object, attr) {
      attr.d = _.map(object.anchors, function(a) {

        if(a.command == Rune.MOVE) {
          return (a.relative ? "m" : "M") + " " + [a.vec1.x, a.vec1.y].join(' ');
        }
        else if(a.command == Rune.LINE) {
          return (a.relative ? "l" : "L") + " " + [a.vec1.x, a.vec1.y].join(' ');
        }
        else if(a.command == Rune.CUBIC && !_.isUndefined(a.vec3)){
          return (a.relative ? "c" : "C") + " " + [a.vec1.x, a.vec1.y, a.vec2.x, a.vec2.y, a.vec3.x, a.vec3.y].join(' ');
        }
        else if(a.command == Rune.CUBIC){
          return (a.relative ? "s" : "S") + " " + [a.vec1.x, a.vec1.y, a.vec2.x, a.vec2.y].join(' ');
        }
        else if(a.command == Rune.QUAD && !_.isUndefined(a.vec2)){
          return (a.relative ? "q" : "Q") + " " + [a.vec1.x, a.vec1.y, a.vec2.x, a.vec2.y].join(' ');
        }
        else if(a.command == Rune.QUAD){
          return (a.relative ? "t" : "T") + " " + [a.vec1.x, a.vec1.y].join(' ');
        }
      }).join(" ").trim();
    }

  });


})(Rune);