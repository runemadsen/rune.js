describe("Rune.Render", function() {

  var r;
  var el;

  beforeEach(function() {
    r = new Rune({width:200, height:300});
  });

  it("should create SVG element", function() {
    expect(r.el.tagName).toEqual('svg');
    expect(r.el).toHaveAttr('width', "200");
    expect(r.el).toHaveAttr('height', "300");
  });

  describe("All shapes", function() {

    it("should handle false vars", function() {
      r.rect(0, 0, 0, 0)
        .fill(false)
        .stroke(false)
        .strokeWidth(false)
        .strokeCap(false)
        .strokeJoin(false)
        .strokeMiterlimit(false)
        .strokeDash(false)
        .strokeDashOffset(false)
      r.draw();
      var rect = r.el.childNodes[0];
      expect(rect).toBeTag("rect");
      expect(rect).toHaveAttr('fill', "none")
      expect(rect).toHaveAttr('stroke', "none")
      expect(rect).toNotHaveAttr('stroke-width')
      expect(rect).toNotHaveAttr('stroke-linecap')
      expect(rect).toNotHaveAttr('stroke-linejoin')
      expect(rect).toNotHaveAttr('stroke-miterlimit')
      expect(rect).toNotHaveAttr('stroke-dasharray')
      expect(rect).toNotHaveAttr('stroke-dashoffset')
    });

    it("renders rotation with 0", function() {
      r.rect(0, 0, 0, 0)
        .rotate(45, 0, 10);
      r.draw();
      var rect = r.el.childNodes[0];
      expect(rect).toHaveRotation(45, 0, 10);
    });

  });

  describe("Rune.Rectangle", function() {

    it("should render rectangle", function() {
      var s = r.rect(100, 105, 300, 400);
      drawShared(s);
      r.draw();
      var rect = r.el.childNodes[0]
      expect(r.el.childNodes.length).toEqual(1);
      expect(rect).toBeTag("rect");
      expect(rect).toHaveAttrs({
        x: s.vars.x,
        y: s.vars.y,
        width: s.vars.width,
        height: s.vars.height
      });
      expect(rect).toNotHaveAttr("rx");
      expect(rect).toNotHaveAttr("ry");
      expect(rect).not.toHaveTranslation(100, 105);
      expectShared(rect);
    });

    it("should render rounded corners", function() {
      var s = r.rect(100, 105, 300, 400).round(25, 15);
      r.draw();
      var rect = r.el.childNodes[0];
      expect(rect).toHaveAttrs({ rx: 25, ry: 15 });
    });

  });

  describe("Rune.Ellipse", function() {

    it("should render ellipse", function() {
      var s = r.ellipse(100, 105, 300, 400);
      drawShared(s);
      r.draw();
      var ellipse = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(ellipse).toBeTag("ellipse");
      expect(ellipse).toHaveAttrs({
        cx: s.vars.x,
        cy: s.vars.y,
        rx: s.vars.width / 2,
        ry: s.vars.height / 2
      });
      expect(ellipse).not.toHaveTranslation(100, 105);
      expectShared(ellipse);
    });

  });

  describe("Rune.Circle", function() {

    it("should render circle", function() {
      var s = r.circle(100, 105, 300);
      drawShared(s);
      r.draw();
      var circle = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(circle).toBeTag("circle");
      expect(circle).toHaveAttrs({
        cx: s.vars.x,
        cy: s.vars.y,
        r: s.vars.radius
      });
      expect(circle).not.toHaveTranslation(100, 105);
      expectShared(circle);
    });

  });

  describe("Rune.Line", function() {

    it("should render line", function() {
      var s = r.line(100, 105, 200, 205);
      drawShared(s);
      r.draw();
      var line = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(line).toBeTag("line");
      expect(line).toHaveAttrs({
        x1: s.vars.x,
        y1: s.vars.y,
        x2: s.vars.x2,
        y2: s.vars.y2
      });
      expect(line).not.toHaveTranslation(100, 105);
      expectShared(line);
    });

  });

  describe("Rune.Triangle", function() {

    it("should render triangle polygon", function() {
      var s = r.triangle(100, 150, 300, 150, 200, 350);
      drawShared(s);
      r.draw();
      var triangle = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(triangle).toBeTag("polygon");
      expect(triangle).toHaveAttr("points", "0 0 200 0 100 200");
      expect(triangle).toHaveTranslation(100, 150);
      expectShared(triangle);
    });

  });

  describe("Rune.Polygon", function() {

    it("should render polygon", function() {
      var s = r.polygon(10, 15)
        .lineTo(100, 101)
        .lineTo(200, 201)
        .lineTo(300, 301);
      drawShared(s);
      r.draw();
      var polygon = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(polygon).toBeTag("polygon");
      expect(polygon).toHaveAttr("points", "100 101 200 201 300 301")
      expect(polygon).toHaveTranslation(10, 15);
      expectShared(polygon);
    });

  });

  describe("Rune.Path", function() {

    it("should render path", function() {
      var s = r.path(10, 15);
      drawShared(s);
      setAllAnchors(s);
      r.draw();
      var path = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(path).toBeTag("path");
      expect(path).toHaveAttr("d", "M 0 0 L 104 105 M 106 107 C 108 109 110 111 112 113 Q 114 115 116 117 Z")
      expect(path).toHaveTranslation(10, 15);
      expectShared(path);
    });

    it("should render optional vars", function() {

      var optionals = {
        fillRule: ["fill-rule", "evenodd"]
      }

      _.each(optionals, function(val, func) {
        var shape = r.path(10, 15);
        r.draw();
        expect(r.el.childNodes[0].getAttribute(val[0])).toBeNull();
        shape[func](val[1]);
        r.draw();
        expect(r.el.childNodes[0].getAttribute(val[0])).toEqual(val[1] + "");
      });
    });

  });

  describe("Rune.Text", function() {

    var s;

    beforeEach(function() {
      s = r.text("Hello", 10, 15);
    });

    it("should render text", function() {
      drawShared(s);
      r.draw();
      var text = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(text).toBeTag("text");
      expect(text).toHaveAttrs({
        x: s.vars.x,
        y: s.vars.y
      });
      expect(text).not.toHaveTranslation(10, 15);
      expect(text.childNodes[0].data).toEqual("Hello")
      expectShared(text);
    });

    it("should render optional vars", function() {

      var optionals = {
        fontFamily: ["font-family", "Georgia"],
        fontWeight: ["font-weight", "bold"],
        letterSpacing: ["letter-spacing", 0.5],
        textDecoration: ["text-decoration", "underline"]
      }

      _.each(optionals, function(v, k) {
        r.draw();
        expect(r.el.childNodes[0].getAttribute(v[0])).toBeNull();
        s[k](v[1]);
        r.draw();
        expect(r.el.childNodes[0].getAttribute(v[0])).toEqual(v[1] + "");
      });
    });

    describe("textAlign()", function() {

      it("should render proper attributes", function() {
        var aligns = [
          ["left", "start"],
          ["center", "middle"],
          ["right", "end"]
        ];
        _.each(aligns, function(align) {
          s.textAlign(align[0]);
          r.draw();
          var jshape = r.el.childNodes[0];
          expect(jshape).toHaveAttr("text-anchor", align[1]);
        });
      });

    });

  });

  describe("Rune.Image", function() {

    it("should render image", function() {
      r.image("myimage.jpg", 10, 15);
      r.draw();
      var img = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(img).toBeTag("image");
      expect(img).toHaveAttrs({
        x: 10,
        y: 15
      });
      expect(img.getAttributeNS("http://www.w3.org/1999/xlink", "href")).toEqual("myimage.jpg")
      expect(img).not.toHaveAttrs({ width: 0, height: 0 });
      expect(img).not.toHaveTranslation(10, 15);
    });

    it("should render width and height if set", function() {
      r.image("myimage.jpg", 10, 15, 300, 400);
      r.draw();
      var img = r.el.childNodes[0];
      expect(img).toHaveAttrs({
        width: 300,
        height: 400
      });
    });

  });

  describe("Rune.Group", function() {

    it("should render group", function() {
      var g = r.group(10, 15)
        .rotate(45);
      var e = new Rune.Circle(10, 15, 100);
      g.add(e)
      r.draw();

      var jgroup = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(jgroup).toBeTag("g");
      expect(jgroup).toHaveTranslation(10, 15);
      expect(jgroup).toHaveRotation(g.vars.rotation);

      var jellipse = jgroup.childNodes[0];
      expect(jellipse).toBeTag("circle");
      expect(jellipse).toHaveAttrs({
        cx: 10,
        cy: 15,
        r: 100
      });
    });

    it("should not render if empty", function() {
      var g = r.group(10, 15);
      r.draw();
      expect(r.el.childNodes.length).toEqual(0);
    })

  });

  describe("Rune.Grid", function() {

    it("should render grid", function() {
      var g = r.grid({
        x: 10,
        y: 15,
        gutterWidth: 20,
        gutterHeight: 30,
        moduleWidth: 40,
        moduleHeight: 50,
        columns: 4,
        rows: 3
      }).rotate(45);
      var ellipse = new Rune.Circle(10, 15, 100);
      g.add(ellipse, 2, 3)
      r.draw();

      var jgrid = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(jgrid).toBeTag("g")
      expect(jgrid).toHaveTranslation(10, 15);
      expect(jgrid).toHaveRotation(45);

      var jmodule = jgrid.childNodes[0];
      expect(jmodule).toBeTag("g");
      expect(jmodule).toHaveTranslation(60, 160);

      var ellip = jmodule.childNodes[0];
      expect(ellip).toBeTag("circle");
      expect(ellip).toHaveAttrs({
        cx: 10,
        cy: 15,
        r: 100
      });

    });

  });

  describe("Debug mode", function() {

    it("should not render if debug false", function() {
      var p = r.path(10, 10);
      p.curveTo(100, 105, 200, 205, 300, 305).closePath();
      r.draw();
      expect(r.el.childNodes.length).toBe(1)
    });

    it("should render cubic curve helpers", function() {
      r.debug = true;
      var p = r.path(10, 10);
      p.curveTo(100, 105, 200, 205, 300, 305).closePath();
      r.draw();
      expect(r.el.childNodes[1]).toBeTag('line')
      expect(r.el.childNodes[2]).toBeTag('line')
      expect(r.el.childNodes[3]).toBeTag('circle')
      expect(r.el.childNodes[4]).toBeTag('circle')
      expect(r.el.childNodes[5]).toBeTag('circle')

      expect(r.el.childNodes[1]).toHaveAttrs({x1: 110, y1: 115, x2:310, y2:315});
      expect(r.el.childNodes[2]).toHaveAttrs({x1: 210, y1: 215, x2:310, y2:315});
      expect(r.el.childNodes[3]).toHaveAttrs({cx: 110, cy: 115});
      expect(r.el.childNodes[4]).toHaveAttrs({cx: 210, cy: 215});
      expect(r.el.childNodes[5]).toHaveAttrs({cx: 310, cy: 315});
    });

    it("should render quad curve helpers", function() {
      r.debug = true;
      var p = r.path(10, 10);
      p.curveTo(200, 205, 300, 305).closePath();
      r.draw();
      expect(r.el.childNodes[1]).toBeTag('line')
      expect(r.el.childNodes[2]).toBeTag('circle')
      expect(r.el.childNodes[3]).toBeTag('circle')
      expect(r.el.childNodes[1]).toHaveAttrs({x1: 210, y1: 215, x2:310, y2:315});
      expect(r.el.childNodes[2]).toHaveAttrs({cx: 210, cy: 215});
      expect(r.el.childNodes[3]).toHaveAttrs({cx: 310, cy: 315});

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
      expect(child).toBeTag("g");
      expect(child).toHaveTranslation(10, 15);

      expect(child.childNodes[0]).toBeTag('rect')
      _.times(8, function(i) { expect(child.childNodes[i + 1]).toBeTag('line') });

      expect(child.childNodes[0]).toHaveAttrs({x: 0, y: 0, width:115, height:130});
      expect(child.childNodes[1]).toHaveAttrs({x1: 25, y1: 0, x2:25, y2:grid.vars.height});
      expect(child.childNodes[2]).toHaveAttrs({x1: 45, y1: 0, x2:45, y2:grid.vars.height});
      expect(child.childNodes[3]).toHaveAttrs({x1: 70, y1: 0, x2:70, y2:grid.vars.height});
      expect(child.childNodes[4]).toHaveAttrs({x1: 90, y1: 0, x2:90, y2:grid.vars.height});
      expect(child.childNodes[5]).toHaveAttrs({x1: 0, y1: 30, x2:grid.vars.width, y2:30});
      expect(child.childNodes[6]).toHaveAttrs({x1: 0, y1: 50, x2:grid.vars.width, y2:50});
      expect(child.childNodes[7]).toHaveAttrs({x1: 0, y1: 80, x2:grid.vars.width, y2:80});
      expect(child.childNodes[8]).toHaveAttrs({x1: 0, y1: 100, x2:grid.vars.width, y2:100});
    });

  })

});
