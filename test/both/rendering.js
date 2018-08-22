describe("Rendering", function() {
  var r;
  var el;

  beforeEach(function() {
    r = new Rune({ width: 200, height: 300 });
  });

  it("should create SVG element", function() {
    expect(r.el.tagName).toEqual("svg");
    expect(r.el.getAttribute("width")).toEqual("200");
    expect(r.el.getAttribute("height")).toEqual("300");
    expect(r.el.getAttribute("viewBox")).toEqual("0 0 200 300");
  });

  describe("All shapes", function() {
    it("should handle false state", function() {
      r
        .rect(0, 0, 0, 0)
        .fill(false)
        .stroke(false)
        .strokeWidth(false)
        .strokeCap(false)
        .strokeJoin(false)
        .strokeMiterlimit(false)
        .strokeDash(false)
        .strokeDashOffset(false);

      r.draw();

      var rect = r.el.childNodes[0];
      expect(rect.tagName).toEqual("rect");
      expect(rect.getAttribute("fill")).toBeFalsy();
      expect(rect.getAttribute("stroke")).toBeFalsy();
      expect(rect.getAttribute("stroke-width")).toBeFalsy();
      expect(rect.getAttribute("stroke-linecap")).toBeFalsy();
      expect(rect.getAttribute("stroke-linejoin")).toBeFalsy();
      expect(rect.getAttribute("stroke-miterlimit")).toBeFalsy();
      expect(rect.getAttribute("stroke-dasharray")).toBeFalsy();
      expect(rect.getAttribute("stroke-dashoffset")).toBeFalsy();
    });

    it("renders rotation with 0", function() {
      r.rect(0, 0, 0, 0).rotate(45, 0, 10);
      r.draw();
      var rect = r.el.childNodes[0];
      expect(rect.getAttribute("transform")).toEqual("rotate(45 0 10)");
    });

    it("renders fill and stroke with none", function() {
      r
        .rect(0, 0, 0, 0)
        .fill("none")
        .stroke("none");
      r.draw();
      var rect = r.el.childNodes[0];
      expect(rect.getAttribute("fill")).toEqual("none");
      expect(rect.getAttribute("stroke")).toEqual("none");
    });
  });

  describe("Rune.Rectangle", function() {
    it("should render rectangle", function() {
      var s = r
        .rect(100, 105, 300, 400)
        .rotate(45, 100, 105)
        .fill(255, 0, 0, 0.5)
        .stroke(0, 255, 0, 0.6)
        .strokeWidth(5)
        .strokeCap("round")
        .strokeJoin("miter")
        .strokeMiterlimit(7)
        .strokeDash("3,4,5")
        .strokeDashOffset(10);

      r.draw();

      var rect = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(rect.tagName).toEqual("rect");
      expect(rect.getAttribute("x")).toEqual("100");
      expect(rect.getAttribute("y")).toEqual("105");
      expect(rect.getAttribute("width")).toEqual("300");
      expect(rect.getAttribute("height")).toEqual("400");
      expect(rect.getAttribute("transform")).toEqual("rotate(45 100 105)");
      expect(rect.getAttribute("fill")).toEqual("rgb(255, 0, 0)");
      expect(rect.getAttribute("fill-opacity")).toEqual("0.5");
      expect(rect.getAttribute("stroke")).toEqual("rgb(0, 255, 0)");
      expect(rect.getAttribute("stroke-opacity")).toEqual("0.6");
      expect(rect.getAttribute("stroke-width")).toEqual("5");
      expect(rect.getAttribute("stroke-linecap")).toEqual("round");
      expect(rect.getAttribute("stroke-linejoin")).toEqual("miter");
      expect(rect.getAttribute("stroke-miterlimit")).toEqual("7");
      expect(rect.getAttribute("stroke-dasharray")).toEqual("3,4,5");
      expect(rect.getAttribute("stroke-dashoffset")).toEqual("10");
      expect(rect.getAttribute("rx")).toBeFalsy();
      expect(rect.getAttribute("ry")).toBeFalsy();
    });

    it("should render rounded corners", function() {
      var s = r.rect(100, 105, 300, 400).round(25, 15);
      r.draw();
      var rect = r.el.childNodes[0];
      expect(rect.getAttribute("rx")).toEqual("25");
      expect(rect.getAttribute("ry")).toEqual("15");
    });
  });

  describe("Rune.Ellipse", function() {
    it("should render ellipse", function() {
      var s = r
        .ellipse(100, 105, 300, 400)
        .rotate(45, 100, 105)
        .fill(255, 0, 0, 0.5)
        .stroke(0, 255, 0, 0.6)
        .strokeWidth(5)
        .strokeCap("round")
        .strokeJoin("miter")
        .strokeMiterlimit(7)
        .strokeDash("3,4,5")
        .strokeDashOffset(10);

      r.draw();

      var ellipse = r.el.childNodes[0];
      expect(ellipse.tagName).toEqual("ellipse");
      expect(ellipse.getAttribute("cx")).toEqual("100");
      expect(ellipse.getAttribute("cy")).toEqual("105");
      expect(ellipse.getAttribute("rx")).toEqual("150");
      expect(ellipse.getAttribute("ry")).toEqual("200");
      expect(ellipse.getAttribute("transform")).toEqual("rotate(45 100 105)");
      expect(ellipse.getAttribute("fill")).toEqual("rgb(255, 0, 0)");
      expect(ellipse.getAttribute("fill-opacity")).toEqual("0.5");
      expect(ellipse.getAttribute("stroke")).toEqual("rgb(0, 255, 0)");
      expect(ellipse.getAttribute("stroke-opacity")).toEqual("0.6");
      expect(ellipse.getAttribute("stroke-width")).toEqual("5");
      expect(ellipse.getAttribute("stroke-linecap")).toEqual("round");
      expect(ellipse.getAttribute("stroke-linejoin")).toEqual("miter");
      expect(ellipse.getAttribute("stroke-miterlimit")).toEqual("7");
      expect(ellipse.getAttribute("stroke-dasharray")).toEqual("3,4,5");
      expect(ellipse.getAttribute("stroke-dashoffset")).toEqual("10");
    });
  });

  describe("Rune.Circle", function() {
    it("should render circle", function() {
      var s = r
        .circle(100, 105, 300)
        .rotate(45, 100, 105)
        .fill(255, 0, 0, 0.5)
        .stroke(0, 255, 0, 0.6)
        .strokeWidth(5)
        .strokeCap("round")
        .strokeJoin("miter")
        .strokeMiterlimit(7)
        .strokeDash("3,4,5")
        .strokeDashOffset(10);

      r.draw();

      var circle = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(circle.tagName).toEqual("circle");
      expect(circle.getAttribute("cx")).toEqual("100");
      expect(circle.getAttribute("cy")).toEqual("105");
      expect(circle.getAttribute("r")).toEqual("300");
      expect(circle.getAttribute("transform")).toEqual("rotate(45 100 105)");
      expect(circle.getAttribute("fill")).toEqual("rgb(255, 0, 0)");
      expect(circle.getAttribute("fill-opacity")).toEqual("0.5");
      expect(circle.getAttribute("stroke")).toEqual("rgb(0, 255, 0)");
      expect(circle.getAttribute("stroke-opacity")).toEqual("0.6");
      expect(circle.getAttribute("stroke-width")).toEqual("5");
      expect(circle.getAttribute("stroke-linecap")).toEqual("round");
      expect(circle.getAttribute("stroke-linejoin")).toEqual("miter");
      expect(circle.getAttribute("stroke-miterlimit")).toEqual("7");
      expect(circle.getAttribute("stroke-dasharray")).toEqual("3,4,5");
      expect(circle.getAttribute("stroke-dashoffset")).toEqual("10");
    });
  });

  describe("Rune.Line", function() {
    it("should render line", function() {
      var s = r
        .line(100, 105, 200, 205)
        .rotate(45, 100, 105)
        .fill(255, 0, 0, 0.5)
        .stroke(0, 255, 0, 0.6)
        .strokeWidth(5)
        .strokeCap("round")
        .strokeJoin("miter")
        .strokeMiterlimit(7)
        .strokeDash("3,4,5")
        .strokeDashOffset(10);

      r.draw();

      var line = r.el.childNodes[0];
      expect(line.tagName).toEqual("line");
      expect(line.getAttribute("x1")).toEqual("100");
      expect(line.getAttribute("y1")).toEqual("105");
      expect(line.getAttribute("x2")).toEqual("200");
      expect(line.getAttribute("y2")).toEqual("205");
      expect(line.getAttribute("transform")).toEqual("rotate(45 100 105)");
      expect(line.getAttribute("fill")).toEqual("rgb(255, 0, 0)");
      expect(line.getAttribute("fill-opacity")).toEqual("0.5");
      expect(line.getAttribute("stroke")).toEqual("rgb(0, 255, 0)");
      expect(line.getAttribute("stroke-opacity")).toEqual("0.6");
      expect(line.getAttribute("stroke-width")).toEqual("5");
      expect(line.getAttribute("stroke-linecap")).toEqual("round");
      expect(line.getAttribute("stroke-linejoin")).toEqual("miter");
      expect(line.getAttribute("stroke-miterlimit")).toEqual("7");
      expect(line.getAttribute("stroke-dasharray")).toEqual("3,4,5");
      expect(line.getAttribute("stroke-dashoffset")).toEqual("10");
    });
  });

  describe("Rune.Triangle", function() {
    it("should render triangle polygon", function() {
      var s = r
        .triangle(100, 150, 300, 150, 200, 350)
        .rotate(45, 100, 105)
        .fill(255, 0, 0, 0.5)
        .stroke(0, 255, 0, 0.6)
        .strokeWidth(5)
        .strokeCap("round")
        .strokeJoin("miter")
        .strokeMiterlimit(7)
        .strokeDash("3,4,5")
        .strokeDashOffset(10);

      r.draw();

      var triangle = r.el.childNodes[0];
      expect(triangle.tagName).toEqual("polygon");
      expect(triangle.getAttribute("points")).toEqual("0 0 200 0 100 200");
      expect(triangle.getAttribute("transform")).toEqual(
        "rotate(45 100 105) translate(100 150)"
      );
      expect(triangle.getAttribute("fill")).toEqual("rgb(255, 0, 0)");
      expect(triangle.getAttribute("fill-opacity")).toEqual("0.5");
      expect(triangle.getAttribute("stroke")).toEqual("rgb(0, 255, 0)");
      expect(triangle.getAttribute("stroke-opacity")).toEqual("0.6");
      expect(triangle.getAttribute("stroke-width")).toEqual("5");
      expect(triangle.getAttribute("stroke-linecap")).toEqual("round");
      expect(triangle.getAttribute("stroke-linejoin")).toEqual("miter");
      expect(triangle.getAttribute("stroke-miterlimit")).toEqual("7");
      expect(triangle.getAttribute("stroke-dasharray")).toEqual("3,4,5");
      expect(triangle.getAttribute("stroke-dashoffset")).toEqual("10");
    });
  });

  describe("Rune.Polygon", function() {
    it("should render polygon", function() {
      var s = r
        .polygon(10, 15)
        .lineTo(100, 101)
        .lineTo(200, 201)
        .lineTo(300, 301)
        .rotate(45, 100, 105)
        .fill(255, 0, 0, 0.5)
        .stroke(0, 255, 0, 0.6)
        .strokeWidth(5)
        .strokeCap("round")
        .strokeJoin("miter")
        .strokeMiterlimit(7)
        .strokeDash("3,4,5")
        .strokeDashOffset(10);

      r.draw();

      var polygon = r.el.childNodes[0];
      expect(polygon.tagName).toEqual("polygon");
      expect(polygon.getAttribute("points")).toEqual("100 101 200 201 300 301");
      expect(polygon.getAttribute("transform")).toEqual(
        "rotate(45 100 105) translate(10 15)"
      );
      expect(polygon.getAttribute("fill")).toEqual("rgb(255, 0, 0)");
      expect(polygon.getAttribute("fill-opacity")).toEqual("0.5");
      expect(polygon.getAttribute("stroke")).toEqual("rgb(0, 255, 0)");
      expect(polygon.getAttribute("stroke-opacity")).toEqual("0.6");
      expect(polygon.getAttribute("stroke-width")).toEqual("5");
      expect(polygon.getAttribute("stroke-linecap")).toEqual("round");
      expect(polygon.getAttribute("stroke-linejoin")).toEqual("miter");
      expect(polygon.getAttribute("stroke-miterlimit")).toEqual("7");
      expect(polygon.getAttribute("stroke-dasharray")).toEqual("3,4,5");
      expect(polygon.getAttribute("stroke-dashoffset")).toEqual("10");
    });
  });

  describe("Rune.Path", function() {
    it("should render path", function() {
      var s = r
        .path(10, 15)
        .rotate(45, 100, 105)
        .fill(255, 0, 0, 0.5)
        .stroke(0, 255, 0, 0.6)
        .strokeWidth(5)
        .strokeCap("round")
        .strokeJoin("miter")
        .strokeMiterlimit(7)
        .strokeDash("3,4,5")
        .strokeDashOffset(10);

      setAllAnchors(s);
      r.draw();

      var path = r.el.childNodes[0];
      expect(path.tagName).toEqual("path");
      expect(path.getAttribute("transform")).toEqual(
        "rotate(45 100 105) translate(10 15)"
      );
      expect(path.getAttribute("fill")).toEqual("rgb(255, 0, 0)");
      expect(path.getAttribute("fill-opacity")).toEqual("0.5");
      expect(path.getAttribute("stroke")).toEqual("rgb(0, 255, 0)");
      expect(path.getAttribute("stroke-opacity")).toEqual("0.6");
      expect(path.getAttribute("stroke-width")).toEqual("5");
      expect(path.getAttribute("stroke-linecap")).toEqual("round");
      expect(path.getAttribute("stroke-linejoin")).toEqual("miter");
      expect(path.getAttribute("stroke-miterlimit")).toEqual("7");
      expect(path.getAttribute("stroke-dasharray")).toEqual("3,4,5");
      expect(path.getAttribute("stroke-dashoffset")).toEqual("10");
      expect(path.getAttribute("d")).toEqual(
        "M 0 0 L 104 105 M 106 107 C 108 109 110 111 112 113 Q 114 115 116 117 Z"
      );
    });

    it("should render optional state", function() {
      var optionals = {
        fillRule: ["fill-rule", "evenodd"]
      };
      var keys = Object.keys(optionals);
      keys.forEach(function(key) {
        var val = optionals[keys];
        var shape = r.path(10, 15);
        r.draw();
        expect(r.el.childNodes[0].getAttribute(val[0])).toBeNull();
        shape[key](val[1]);
        r.draw();
        expect(r.el.childNodes[0].getAttribute(val[0])).toEqual(val[1] + "");
      });
    });
  });

  describe("Rune.Text", function() {
    it("should render text", function() {
      var s = r
        .text("Hello", 10, 15)
        .rotate(45, 100, 105)
        .fill(255, 0, 0, 0.5)
        .stroke(0, 255, 0, 0.6)
        .strokeWidth(5)
        .strokeCap("round")
        .strokeJoin("miter")
        .strokeMiterlimit(7)
        .strokeDash("3,4,5")
        .strokeDashOffset(10);
      r.draw();
      var text = r.el.childNodes[0];
      expect(text.tagName).toEqual("text");
      expect(text.getAttribute("x")).toEqual("10");
      expect(text.getAttribute("y")).toEqual("15");
      expect(text.getAttribute("transform")).toEqual("rotate(45 100 105)");
      expect(text.getAttribute("fill")).toEqual("rgb(255, 0, 0)");
      expect(text.getAttribute("fill-opacity")).toEqual("0.5");
      expect(text.getAttribute("stroke")).toEqual("rgb(0, 255, 0)");
      expect(text.getAttribute("stroke-opacity")).toEqual("0.6");
      expect(text.getAttribute("stroke-width")).toEqual("5");
      expect(text.getAttribute("stroke-linecap")).toEqual("round");
      expect(text.getAttribute("stroke-linejoin")).toEqual("miter");
      expect(text.getAttribute("stroke-miterlimit")).toEqual("7");
      expect(text.getAttribute("stroke-dasharray")).toEqual("3,4,5");
      expect(text.getAttribute("stroke-dashoffset")).toEqual("10");
      expect(text.childNodes[0].data).toEqual("Hello");
    });

    it("should render optional state", function() {
      var s = r.text("Hello", 10, 15);
      var optionals = {
        fontFamily: ["font-family", "Georgia"],
        fontWeight: ["font-weight", "bold"],
        letterSpacing: ["letter-spacing", 0.5],
        textDecoration: ["text-decoration", "underline"]
      };
      var keys = Object.keys(optionals);
      keys.forEach(function(key) {
        var val = optionals[key];
        r.draw();
        expect(r.el.childNodes[0].getAttribute(val[0])).toBeNull();
        s[key](val[1]);
        r.draw();
        expect(r.el.childNodes[0].getAttribute(val[0])).toEqual(val[1] + "");
      });
    });

    describe("textAlign()", function() {
      it("should render proper attributes", function() {
        var s = r.text("Hello", 10, 15);
        var aligns = [
          ["left", "start"],
          ["center", "middle"],
          ["right", "end"]
        ];
        aligns.forEach(function(align) {
          s.textAlign(align[0]);
          r.draw();
          var jshape = r.el.childNodes[0];
          expect(jshape.getAttribute("text-anchor")).toEqual(align[1]);
        });
      });
    });
  });

  describe("Rune.Image", function() {
    it("should render image", function() {
      r.image("myimage.jpg", 10, 15);
      r.draw();
      var img = r.el.childNodes[0];
      expect(img.tagName).toEqual("image");
      expect(img.getAttribute("x")).toEqual("10");
      expect(img.getAttribute("y")).toEqual("15");
      expect(
        img.getAttributeNS("http://www.w3.org/1999/xlink", "href")
      ).toEqual("myimage.jpg");
      expect(img.getAttribute("width")).toBeFalsy();
      expect(img.getAttribute("height")).toBeFalsy();
      expect(img.getAttribute("transform")).toBeFalsy();
    });

    it("should render width and height if set", function() {
      r.image("myimage.jpg", 10, 15, 300, 400);
      r.draw();
      var img = r.el.childNodes[0];
      expect(img.getAttribute("width")).toEqual("300");
      expect(img.getAttribute("height")).toEqual("400");
    });
  });

  describe("Rune.Group", function() {
    it("should render group", function() {
      var g = r
        .group(10, 15)
        .rotate(45, 100, 105)
        .fill(255, 0, 0, 0.5)
        .stroke(0, 255, 0, 0.6)
        .strokeWidth(5)
        .strokeCap("round")
        .strokeJoin("miter")
        .strokeMiterlimit(7)
        .strokeDash("3,4,5")
        .strokeDashOffset(10);
      var e = new Rune.Circle(10, 15, 100);
      g.add(e);
      r.draw();

      var group = r.el.childNodes[0];
      expect(group.tagName).toEqual("g");
      expect(group.getAttribute("transform")).toEqual(
        "rotate(45 100 105) translate(10 15)"
      );
      expect(group.getAttribute("fill")).toEqual("rgb(255, 0, 0)");
      expect(group.getAttribute("fill-opacity")).toEqual("0.5");
      expect(group.getAttribute("stroke")).toEqual("rgb(0, 255, 0)");
      expect(group.getAttribute("stroke-opacity")).toEqual("0.6");
      expect(group.getAttribute("stroke-width")).toEqual("5");
      expect(group.getAttribute("stroke-linecap")).toEqual("round");
      expect(group.getAttribute("stroke-linejoin")).toEqual("miter");
      expect(group.getAttribute("stroke-miterlimit")).toEqual("7");
      expect(group.getAttribute("stroke-dasharray")).toEqual("3,4,5");
      expect(group.getAttribute("stroke-dashoffset")).toEqual("10");

      var ellipse = group.childNodes[0];
      expect(ellipse.tagName).toEqual("circle");
      expect(ellipse.getAttribute("cx")).toEqual("10");
      expect(ellipse.getAttribute("cy")).toEqual("15");
      expect(ellipse.getAttribute("r")).toEqual("100");
    });

    it("should rerender if children were swapped", function() {
      var g = r.group(10, 15);
      var s1 = r.circle(20, 25, 100, g);
      var s2 = r.rect(20, 25, 100, 100, g);
      r.draw();
      var jgroup = r.el.childNodes[0];
      expect(jgroup.childNodes[0].tagName).toEqual("circle");
      expect(jgroup.childNodes[1].tagName).toEqual("rect");
      s1.removeParent().addTo(g);
      r.draw();
      expect(jgroup.childNodes[0].tagName).toEqual("rect");
      expect(jgroup.childNodes[1].tagName).toEqual("circle");
    });

    it("should not render if empty", function() {
      var g = r.group(10, 15);
      r.draw();
      expect(r.el.childNodes.length).toEqual(0);
    });

    it("should rerender if child group changed", function() {
      var parent = r.group(10, 15);
      var child = r.group(20, 25, parent);
      var c = r.circle(10, 15, 100, child);
      r.draw();
      c.move(1, 2, true);
      r.draw();
      var circle = r.el.childNodes[0].childNodes[0].childNodes[0];
      expect(circle.tagName).toEqual("circle");
      expect(circle.getAttribute("cx")).toEqual("11");
      expect(circle.getAttribute("cy")).toEqual("17");
      expect(circle.getAttribute("r")).toEqual("100");
    });

    it("should render in group if moved from stage to group", function() {
      var c = r.circle(10, 15, 100);
      var parent = r.group(10, 15);
      parent.add(c);
      r.draw();
    });

    it("should not render group if child was removed from group", function() {
      var parent = r.group(10, 15);
      var c = r.circle(10, 15, 100, parent);
      r.draw();
      parent.remove(c);
      r.draw();
      expect(r.el.childNodes.length).toBe(0);
    });
  });

  describe("Rune.Grid", function() {
    it("should render grid", function() {
      var g = r
        .grid({
          x: 10,
          y: 15,
          gutterWidth: 20,
          gutterHeight: 30,
          moduleWidth: 40,
          moduleHeight: 50,
          columns: 4,
          rows: 3
        })
        .rotate(45);
      var e = new Rune.Circle(10, 15, 100);
      g.add(e, 2, 3);
      r.draw();

      var grid = r.el.childNodes[0];
      expect(grid.tagName).toEqual("g");
      expect(grid.getAttribute("transform")).toEqual(
        "rotate(45) translate(10 15)"
      );

      var mod = grid.childNodes[0];
      expect(mod.tagName).toEqual("g");
      expect(mod.getAttribute("transform")).toEqual("translate(60 160)");

      var ellipse = mod.childNodes[0];
      expect(ellipse.tagName).toEqual("circle");
      expect(ellipse.getAttribute("cx")).toEqual("10");
      expect(ellipse.getAttribute("cy")).toEqual("15");
      expect(ellipse.getAttribute("r")).toEqual("100");
    });

    it("should rerender when shapes change", function() {
      var g = r.grid();
      var e = new Rune.Circle(10, 15, 100);
      g.add(e, 1, 1);
      r.draw();

      e.move(20, 25);
      r.draw();

      var ellipse = r.el.childNodes[0].childNodes[0].childNodes[0];
      expect(ellipse.tagName).toEqual("circle");
      expect(ellipse.getAttribute("cx")).toEqual("20");
      expect(ellipse.getAttribute("cy")).toEqual("25");
    });
  });

  describe("Debug mode", function() {
    it("should not render if debug false", function() {
      var p = r.path(10, 10);
      p.curveTo(100, 105, 200, 205, 300, 305).closePath();
      r.draw();
      expect(r.el.childNodes.length).toBe(1);
    });

    it("should render cubic curve helpers", function() {
      r.debug = true;
      var p = r.path(10, 10);
      p.curveTo(100, 105, 200, 205, 300, 305).closePath();
      r.draw();
      expect(r.el.childNodes[1].tagName).toEqual("line");
      expect(r.el.childNodes[1].getAttribute("x1")).toEqual("110");
      expect(r.el.childNodes[1].getAttribute("y1")).toEqual("115");
      expect(r.el.childNodes[1].getAttribute("x2")).toEqual("310");
      expect(r.el.childNodes[1].getAttribute("y2")).toEqual("315");

      expect(r.el.childNodes[2].tagName).toEqual("line");
      expect(r.el.childNodes[2].getAttribute("x1")).toEqual("210");
      expect(r.el.childNodes[2].getAttribute("y1")).toEqual("215");
      expect(r.el.childNodes[2].getAttribute("x2")).toEqual("310");
      expect(r.el.childNodes[2].getAttribute("y2")).toEqual("315");

      expect(r.el.childNodes[3].tagName).toEqual("circle");
      expect(r.el.childNodes[3].getAttribute("cx")).toEqual("110");
      expect(r.el.childNodes[3].getAttribute("cy")).toEqual("115");

      expect(r.el.childNodes[4].tagName).toEqual("circle");
      expect(r.el.childNodes[4].getAttribute("cx")).toEqual("210");
      expect(r.el.childNodes[4].getAttribute("cy")).toEqual("215");

      expect(r.el.childNodes[5].tagName).toEqual("circle");
      expect(r.el.childNodes[5].getAttribute("cx")).toEqual("310");
      expect(r.el.childNodes[5].getAttribute("cy")).toEqual("315");
    });

    it("should render quad curve helpers", function() {
      r.debug = true;
      var p = r.path(10, 10);
      p.curveTo(200, 205, 300, 305).closePath();
      r.draw();

      expect(r.el.childNodes[1].tagName).toEqual("line");
      expect(r.el.childNodes[1].getAttribute("x1")).toEqual("210");
      expect(r.el.childNodes[1].getAttribute("y1")).toEqual("215");
      expect(r.el.childNodes[1].getAttribute("x2")).toEqual("310");
      expect(r.el.childNodes[1].getAttribute("y2")).toEqual("315");

      expect(r.el.childNodes[2].tagName).toEqual("circle");
      expect(r.el.childNodes[2].getAttribute("cx")).toEqual("210");
      expect(r.el.childNodes[2].getAttribute("cy")).toEqual("215");

      expect(r.el.childNodes[3].tagName).toEqual("circle");
      expect(r.el.childNodes[3].getAttribute("cx")).toEqual("310");
      expect(r.el.childNodes[3].getAttribute("cy")).toEqual("315");
    });

    it("should render grid helpers", function() {
      r.debug = true;
      var grid = r.grid({
        x: 10,
        y: 15,
        gutter: 20,
        moduleWidth: 25,
        moduleHeight: 30,
        columns: 3,
        rows: 3
      });
      r.draw();

      var child = r.el.childNodes[0];
      expect(child.tagName).toEqual("g");
      expect(child.getAttribute("transform")).toEqual("translate(10 15)");

      expect(child.childNodes[0].tagName).toEqual("rect");
      for (var i = 0; i < 8; i++) {
        expect(child.childNodes[i + 1].tagName).toEqual("line");
      }

      expect(child.childNodes[0].getAttribute("x")).toEqual("0");
      expect(child.childNodes[0].getAttribute("y")).toEqual("0");
      expect(child.childNodes[0].getAttribute("width")).toEqual("115");
      expect(child.childNodes[0].getAttribute("height")).toEqual("130");

      expect(child.childNodes[1].getAttribute("x1")).toEqual("25");
      expect(child.childNodes[1].getAttribute("y1")).toEqual("0");
      expect(child.childNodes[1].getAttribute("x2")).toEqual("25");
      expect(child.childNodes[1].getAttribute("y2")).toEqual(
        grid.state.height + ""
      );

      expect(child.childNodes[2].getAttribute("x1")).toEqual("45");
      expect(child.childNodes[2].getAttribute("y1")).toEqual("0");
      expect(child.childNodes[2].getAttribute("x2")).toEqual("45");
      expect(child.childNodes[2].getAttribute("y2")).toEqual(
        grid.state.height + ""
      );

      expect(child.childNodes[3].getAttribute("x1")).toEqual("70");
      expect(child.childNodes[3].getAttribute("y1")).toEqual("0");
      expect(child.childNodes[3].getAttribute("x2")).toEqual("70");
      expect(child.childNodes[3].getAttribute("y2")).toEqual(
        grid.state.height + ""
      );

      expect(child.childNodes[4].getAttribute("x1")).toEqual("90");
      expect(child.childNodes[4].getAttribute("y1")).toEqual("0");
      expect(child.childNodes[4].getAttribute("x2")).toEqual("90");
      expect(child.childNodes[4].getAttribute("y2")).toEqual(
        grid.state.height + ""
      );

      expect(child.childNodes[5].getAttribute("x1")).toEqual("0");
      expect(child.childNodes[5].getAttribute("y1")).toEqual("30");
      expect(child.childNodes[5].getAttribute("x2")).toEqual(
        grid.state.width + ""
      );
      expect(child.childNodes[5].getAttribute("y2")).toEqual("30");

      expect(child.childNodes[6].getAttribute("x1")).toEqual("0");
      expect(child.childNodes[6].getAttribute("y1")).toEqual("50");
      expect(child.childNodes[6].getAttribute("x2")).toEqual(
        grid.state.width + ""
      );
      expect(child.childNodes[6].getAttribute("y2")).toEqual("50");

      expect(child.childNodes[7].getAttribute("x1")).toEqual("0");
      expect(child.childNodes[7].getAttribute("y1")).toEqual("80");
      expect(child.childNodes[7].getAttribute("x2")).toEqual(
        grid.state.width + ""
      );
      expect(child.childNodes[7].getAttribute("y2")).toEqual("80");

      expect(child.childNodes[8].getAttribute("x1")).toEqual("0");
      expect(child.childNodes[8].getAttribute("y1")).toEqual("100");
      expect(child.childNodes[8].getAttribute("x2")).toEqual(
        grid.state.width + ""
      );
      expect(child.childNodes[8].getAttribute("y2")).toEqual("100");
    });
  });

  describe("Rune.Node", function() {
    it("should inject node into rendering", function() {
      r.circle(20, 25, 100, g);
      r.node("path", { d: "M0 0" });
      r.rect(20, 25, 100, 100, g);
      r.draw();
      expect(r.el.childNodes[0].tagName).toEqual("circle");
      expect(r.el.childNodes[1].tagName).toEqual("path");
      expect(r.el.childNodes[2].tagName).toEqual("rect");
    });
  });
});
