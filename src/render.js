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

    render: function(stage, opts) {

      var newTree = virtualdom.svg('svg', {
        width: this.params.width,
        height: this.params.height
      }, [this.objectsToSVG(stage.children, opts)]);

      var diff = virtualdom.diff(this.tree, newTree);
      this.el = virtualdom.patch(this.el, diff);
      this.tree = newTree;
    },

    // Shape converters
    // --------------------------------------------------

    objectToSVG: function(object, opts) {
      if(this[object.type + "ToSVG"])
        return this[object.type + "ToSVG"](object, opts);
      else
        console.error("Rune.Render: Object not recognized", object)
    },

    objectsToSVG: function(objects, opts) {
      var objects = _.map(objects, _.bind(function(object) {
        return this.objectToSVG(object, opts);
      }, this));
      return _.flatten(objects, true);
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

    pathToSVG: function(path, opts) {
      var attr = {};
      this.dAttribute(path, attr);
      this.transformAttribute(attr, path);
      this.styleableAttributes(path, attr);
      this.optionalAttributes(path, attr, {
        "fillRule" : "fill-rule"
      });

      var els = [
        virtualdom.svg('path', attr)
      ];

      if(opts && opts.debug) els = els.concat(this.debugPathToSVG(path));
      return els;
    },

    textToSVG: function(text, opts) {
      var attr = {
        x: text.vars.x,
        y: text.vars.y,
      }
      this.transformAttribute(attr, text);
      this.styleableAttributes(text, attr);

      // attributes that need specific handling
      if(text.vars.textAlign) {
        var translate = { "left":"start", "center":"middle", "right":"end" };
        attr["text-anchor"] = translate[text.vars.textAlign];
      }

      this.optionalAttributes(text, attr, {
        "fontFamily" : "font-family",
        "textAlign" : "text-align",
        "fontStyle" : "font-style",
        "fontWeight" : "font-weight",
        "fontSize" : "font-size",
        "letterSpacing" : "letter-spacing",
        "textDecoration" : "text-decoration"
      });

      if(text.vars.textAlign) {
        var translate = { "left":"start", "center":"middle", "right":"end" };
        attr["text-anchor"] = translate[text.vars.textAlign];
      }

      return virtualdom.svg('text', attr, text.vars.text);
    },

    groupToSVG: function(group) {
      if(_.isEmpty(group.children)) return;
      var attr = {}
      this.transformAttribute(attr, group);
      return virtualdom.svg('g', attr, this.objectsToSVG(group.children));
    },

    gridToSVG: function(grid, opts) {
      var attr = {}
      this.transformAttribute(attr, grid);

      var groups = [];
      _.each(grid.modules, _.bind(function(column) {
        groups.push(this.objectsToSVG(column))
      }, this));

      if(opts && opts.debug) groups = groups.concat(this.debugGridToSVG(grid));

      return virtualdom.svg('g', attr, _.flatten(groups, true));
    },

    // Debug
    // --------------------------------------------------

    debugPathToSVG: function(path) {

      var t = this;
      var els = [];

      _.each(path.vars.anchors, function(a, i) {
        if(a.command == 'cubic'){
          els.push(t.debugLine(path.vars.x + a.vec1.x, path.vars.y + a.vec1.y, path.vars.x + a.vec3.x, path.vars.y + a.vec3.y));
          els.push(t.debugLine(path.vars.x + a.vec2.x, path.vars.y + a.vec2.y, path.vars.x + a.vec3.x, path.vars.y + a.vec3.y));
          for(var i = 1; i < 4; i++) {
            els.push(t.debugCircle(path.vars.x + a["vec"+i].x, path.vars.y + a["vec"+i].y))
          }
        }
        else if(a.command == 'quad' && !_.isUndefined(a.vec2)){
          els.push(t.debugLine(path.vars.x + a.vec1.x, path.vars.y + a.vec1.y, path.vars.x + a.vec2.x, path.vars.y + a.vec2.y));
          for(var i = 1; i < 3; i++) {
            els.push(t.debugCircle(path.vars.x + a["vec"+i].x, path.vars.y + a["vec"+i].y))
          }
        }
      });

      return els;
    },

    debugGridToSVG: function(grid) {

      var t = this;
      var els = [];

      // draw container rect
      els.push(this.debugRect(0, 0, grid.vars.width, grid.vars.height));

      // draw lines for columns
      var x = 0;
      for(var i = 0; i < grid.vars.columns-1; i++) {
        x += grid.vars.moduleWidth;
        els.push(this.debugLine(x, 0, x, grid.vars.height));
        x += grid.vars.gutterX;
        els.push(this.debugLine(x, 0, x, grid.vars.height));
      }

      // draw lines for rows
      var y = 0;
      for(var i = 0; i < grid.vars.rows-1; i++) {
        y += grid.vars.moduleHeight;
        els.push(this.debugLine(0, y, grid.vars.width, y));
        y += grid.vars.gutterY;
        els.push(this.debugLine(0, y, grid.vars.width, y));
      }

      return els;
    },

    debugCircle : function(x, y) {
      var c = new Rune.Circle(x, y, 4)
        .fill(212, 18, 229)
        .stroke(false);
      return this.circleToSVG(c);
    },

    debugRect : function(x, y, width, height) {
      var r = new Rune.Rectangle(x, y, width, height)
        .stroke(212, 18, 229).fill(false);
      return this.rectangleToSVG(r);
    },

    debugLine : function(x1, y1, x2, y2) {
      var l = new Rune.Line(x1, y1, x2, y2)
        .stroke(212, 18, 229);
      return this.lineToSVG(l);
    },

    // Multiple attributes
    // --------------------------------------------------

    optionalAttributes : function(object, attr, keys) {
      _.each(keys, function(attribute, variable) {
        if(object.vars[variable]) {
          attr[attribute] = object.vars[variable];
        }
      }, this);
    },

    sizeableAttributes: function(object, attr) {
      attr.width = object.vars.width;
      attr.height = object.vars.height;
    },

    styleableAttributes: function(object, attr) {

      if(object.vars.fill === false)    attr.fill = "none";
      else if(object.vars.fill)         attr.fill = object.vars.fill.rgbString();

      if(object.vars.stroke === false)  attr.stroke = "none";
      else if(object.vars.stroke)       attr.stroke = object.vars.stroke.rgbString();

      if(object.vars.fill)              attr.fill = object.vars.fill.rgbString();
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

      if((shape.type == "group" || shape.type == "path" || shape.type == "polygon" || shape.type == "grid") && (vars.x || vars.y)) {
        strings.push("translate(" + vars.x + " " + vars.y + ")");
      }

      if(strings.length > 0)
        attr.transform = strings.join(" ").trim();
    },

    dAttribute: function(object, attr) {
      attr.d = _.map(object.vars.anchors, function(a) {

        if(a.command == 'move') {
          return (a.relative ? "m" : "M") + " " + [a.vec1.x, a.vec1.y].join(' ');
        }
        else if(a.command == 'line') {
          return (a.relative ? "l" : "L") + " " + [a.vec1.x, a.vec1.y].join(' ');
        }
        else if(a.command == 'cubic'){
          return (a.relative ? "c" : "C") + " " + [a.vec1.x, a.vec1.y, a.vec2.x, a.vec2.y, a.vec3.x, a.vec3.y].join(' ');
        }
        else if(a.command == 'quad' && !_.isUndefined(a.vec2)){
          return (a.relative ? "q" : "Q") + " " + [a.vec1.x, a.vec1.y, a.vec2.x, a.vec2.y].join(' ');
        }
        else if(a.command == 'quad'){
          return (a.relative ? "t" : "T") + " " + [a.vec1.x, a.vec1.y].join(' ');
        }
        else if(a.command == 'close'){
          return "Z";
        }
      }).join(" ").trim();
    }

  });


})(Rune);