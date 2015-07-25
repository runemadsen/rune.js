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
      this.transformAttribute(attr, group);
      return virtualdom.svg('g', attr, this.objectsToSVG(group.children));
    },

    rectangleToSVG: function(rect) {
      var attr = {
        x: rect.vars.x,
        y: rect.vars.y,
        width: rect.vars.width,
        height: rect.vars.height
      }
      this.transformAttribute(attr, rect);
      this.styleableAttributes(rect, attr);
      return virtualdom.svg('rect', attr);
    },

    ellipseToSVG: function(ellipse) {
      var attr = {
        cx: ellipse.vars.x,
        cy: ellipse.vars.y,
        rx: ellipse.vars.width,
        ry: ellipse.vars.height
      }
      this.transformAttribute(attr, ellipse);
      this.styleableAttributes(ellipse, attr);
      return virtualdom.svg('ellipse', attr);
    },

    circleToSVG: function(circle) {
      var attr = {
        cx: circle.vars.x,
        cy: circle.vars.y,
        r: circle.vars.radius
      }
      this.transformAttribute(attr, circle);
      this.styleableAttributes(circle, attr);
      return virtualdom.svg('circle', attr);
    },

    lineToSVG: function(line) {
      var attr = {
        x1: line.vars.x,
        y1: line.vars.y,
        x2: line.vars.x2,
        y2: line.vars.y2
      }
      this.transformAttribute(attr, line);
      this.styleableAttributes(line, attr);
      return virtualdom.svg('line', attr);
    },

    polygonToSVG: function(polygon) {
      var attr = {
        points: _.map(polygon.vars.vectors, function(vec) {
          return vec.x + " " + vec.y;
        }).join(" ")
      };
      this.transformAttribute(attr, polygon);
      this.styleableAttributes(polygon, attr);
      return virtualdom.svg('polygon', attr);
    },

    pathToSVG: function(path) {
      var attr = {};
      this.dAttribute(path, attr);
      this.transformAttribute(attr, path);
      this.styleableAttributes(path, attr);
      return virtualdom.svg('path', attr);
    },

    // Mixin converters
    // --------------------------------------------------

    sizeableAttributes: function(object, attr) {
      attr.width = object.vars.width;
      attr.height = object.vars.height;
    },

    styleableAttributes: function(object, attr) {
      if(object.vars.fill)              attr.fill = object.vars.fill.hexString();
      if(object.vars.stroke)            attr.stroke = object.vars.stroke.hexString();
      if(object.vars.fill)              attr.fill = object.vars.fill.hexString();
      if(object.vars.strokeWidth)       attr["stroke-width"] = object.vars.strokeWidth;
      if(object.vars.strokeCap)         attr["stroke-linecap"] = object.vars.strokeCap;
      if(object.vars.strokeJoin)        attr["stroke-linejoin"] = object.vars.strokeJoin;
      if(object.vars.strokeMiterlimit)  attr["stroke-miterlimit"] = object.vars.strokeMiterlimit;
      if(object.vars.strokeDash)        attr["stroke-dasharray"] = object.vars.strokeDash;
      if(object.vars.strokeDashOffset)  attr["stroke-dashoffset"] = object.vars.strokeDashOffset;
    },

    // Single attributes
    // --------------------------------------------------

    transformAttribute: function(attr, shape) {

      var vars = shape.vars;
      var strings = [];

      if(vars.rotation) {
        var rot = "rotate(" + vars.rotation;
        if(vars.rotationX || vars.rotationY)
          rot += " " + vars.rotationX + " " + vars.rotationY;
        strings.push(rot + ")");
      }

      if(vars.x || vars.y) {
        strings.push("translate(" + vars.x + " " + vars.y + ")");
      }

      attr.transform = strings.join(" ").trim();
    },

    dAttribute: function(object, attr) {
      attr.d = _.map(object.vars.anchors, function(a) {

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
        else if(a.command == Rune.CLOSE){
          return "Z";
        }
      }).join(" ").trim();
    }

  });


})(Rune);