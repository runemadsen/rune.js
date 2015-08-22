// Helpers
// --------------------------------------------------

function drawShared(shape) {
  shape.rotate(45, 100, 105)
    .fill(255, 0, 0, 0.5)
    .stroke(0, 255, 0, 0.6)
    .strokeWidth(5)
    .strokeCap('round')
    .strokeJoin('miter')
    .strokeMiterlimit(7)
    .strokeDash("3,4,5")
    .strokeDashOffset(10)
}

function expectShared(jshape) {
  expect(jshape).toHaveRotation(45, 100, 105);
  expect(jshape).toHaveAttr("fill", "rgba(255, 0, 0, 0.5)");
  expect(jshape).toHaveAttr("stroke", "rgba(0, 255, 0, 0.6)");
  expect(jshape).toHaveAttr("stroke-width", "5");
  expect(jshape).toHaveAttr("stroke-linecap", "round");
  expect(jshape).toHaveAttr("stroke-linejoin", "miter");
  expect(jshape).toHaveAttr("stroke-miterlimit", "7");
  expect(jshape).toHaveAttr("stroke-dasharray", "3,4,5");
  expect(jshape).toHaveAttr("stroke-dashoffset", "10");
}

describe("Rune.Render", function() {

  var r;
  var el;
  var jel;

  beforeEach(function() {
    r = new Rune({width:200, height:300});
    el = r.getEl();
    jel = $(el);
  });

  it("should create SVG element", function() {
    expect(el.tagName).toEqual('svg');
    expect(jel.attr('width')).toEqual("200");
    expect(jel.attr('height')).toEqual("300");
  });

  describe("All shapes", function() {

    it("should handle false vars", function() {
      var s = r.rect(0, 0, 0, 0)
        .fill(false)
        .stroke(false)
        .strokeWidth(false)
        .strokeCap(false)
        .strokeJoin(false)
        .strokeMiterlimit(false)
        .strokeDash(false)
        .strokeDashOffset(false)
      r.draw();
      var jshape = jel.children().first();
      expect(jshape).toBeTag("rect");
      expect(jshape.attr('fill')).toEqual("none");
      expect(jshape.attr('stroke')).toEqual("none");
      expect(jshape.attr('stroke-width')).toBeUndefined()
      expect(jshape.attr('stroke-linecap')).toBeUndefined()
      expect(jshape.attr('stroke-linejoin')).toBeUndefined()
      expect(jshape.attr('stroke-miterlimit')).toBeUndefined()
      expect(jshape.attr('stroke-dasharray')).toBeUndefined()
      expect(jshape.attr('stroke-dashoffset')).toBeUndefined()
    });

    it("renders rotation with 0", function() {
      var s = r.rect(0, 0, 0, 0)
        .rotate(45, 0, 10);
      r.draw();
      var jshape = jel.children().first();
      expect(jshape).toHaveRotation(45, 0, 10);
    });

  });

  describe("Rune.Rectangle", function() {

    it("should render rectangle", function() {
      var s = r.rect(100, 105, 300, 400);
      drawShared(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("rect");
      expect(jshape).toHaveAttrs({
        x: s.vars.x,
        y: s.vars.y,
        width: s.vars.width,
        height: s.vars.height
      });
      expect(jshape).not.toHaveTranslation(100, 105);
      expectShared(jshape);
    });

  });

  describe("Rune.Ellipse", function() {

    it("should render ellipse", function() {
      var s = r.ellipse(100, 105, 300, 400);
      drawShared(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("ellipse");
      expect(jshape).toHaveAttrs({
        cx: s.vars.x,
        cy: s.vars.y,
        rx: s.vars.width,
        ry: s.vars.height
      });
      expect(jshape).not.toHaveTranslation(100, 105);
      expectShared(jshape);
    });

  });

  describe("Rune.Circle", function() {

    it("should render circle", function() {
      var s = r.circle(100, 105, 300);
      drawShared(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("circle");
      expect(jshape).toHaveAttrs({
        cx: s.vars.x,
        cy: s.vars.y,
        r: s.vars.radius
      });
      expect(jshape).not.toHaveTranslation(100, 105);
      expectShared(jshape);
    });

  });

  describe("Rune.Line", function() {

    it("should render line", function() {
      var s = r.line(100, 105, 200, 205);
      drawShared(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("line");
      expect(jshape).toHaveAttrs({
        x1: s.vars.x,
        y1: s.vars.y,
        x2: s.vars.x2,
        y2: s.vars.y2
      });
      expect(jshape).not.toHaveTranslation(100, 105);
      expectShared(jshape);
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
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("polygon");
      expect(jshape).toHaveAttr("points", "100 101 200 201 300 301")
      expect(jshape).toHaveTranslation(10, 15);
      expectShared(jshape);
    });

  });

  describe("Rune.Path", function() {

    it("should render path", function() {
      var s = r.path(10, 15);
      drawShared(s);
      setAllAnchors(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("path");
      expect(jshape).toHaveAttr("d", "M 0 0 L 104 105 M 106 107 C 108 109 110 111 112 113 Q 114 115 116 117 Z")
      expect(jshape).toHaveTranslation(10, 15);
      expectShared(jshape);
    });

    it("should render optional vars", function() {

      var optionals = {
        fillRule: ["fill-rule", "evenodd"]
      }

      _.each(optionals, function(v, k) {
        var s = r.path(10, 15);
        r.draw();
        expect($(el).children().first().attr(v[0])).toBeUndefined();
        s[k](v[1]);
        r.draw();
        expect($(el).children().first().attr(v[0])).toEqual(v[1] + "");
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
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("text");
      expect(jshape).toHaveAttrs({
        x: s.vars.x,
        y: s.vars.y
      });
      expect(jshape).not.toHaveTranslation(10, 15);
      expect(jshape.text()).toEqual("Hello")
      expectShared(jshape);
    });

    it("should render optional vars", function() {

      var optionals = {
        fontFamily: ["font-family", "Georgia"],
        fontWeight: ["font-weight", "bold"],
        fontSize: ["font-size", 32],
        letterSpacing: ["letter-spacing", 0.5],
        textDecoration: ["text-decoration", "underline"]
      }

      _.each(optionals, function(v, k) {
        r.draw();
        expect($(el).children().first().attr(v[0])).toBeUndefined();
        s[k](v[1]);
        r.draw();
        expect($(el).children().first().attr(v[0])).toEqual(v[1] + "");
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
          var jshape = jel.children().first();
          expect(jshape).toHaveAttr("text-anchor", align[1]);
        });
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

      var jgroup = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jgroup).toBeTag("g");
      expect(jgroup).toHaveTranslation(10, 15);
      expect(jgroup).toHaveRotation(g.vars.rotation);

      var jellipse = jgroup.children().first();
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
      var jgroup = jel.children().first();
      expect(jel.children().length).toEqual(0);
    })

  });

  describe("Rune.Grid", function() {

    it("should render grid", function() {
      var g = r.grid({
        x: 10,
        y: 15,
        gutterX: 20,
        gutterY: 30,
        moduleWidth: 40,
        moduleHeight: 50,
        columns: 4,
        rows: 3
      }).rotate(45);
      var ellipse = new Rune.Circle(10, 15, 100);
      g.add(ellipse, 2, 3)
      r.draw();

      var jgrid = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jgrid).toBeTag("g")
      expect(jgrid).toHaveTranslation(10, 15);
      expect(jgrid).toHaveRotation(45);

      var jmodule = jgrid.children().first();
      expect(jmodule).toBeTag("g");
      expect(jmodule).toHaveTranslation(60, 160);

      var jellipse = jmodule.children().first();
      expect(jellipse).toBeTag("circle");
      expect(jellipse).toHaveAttrs({
        cx: 10,
        cy: 15,
        r: 100
      });

    });

  });

  describe("Debug mode", function() {

    it("should not render if debug false", function() {
      var p = r.path(10, 10);
      p.curveTo(100, 105, 200, 205, 300, 305).closeShape();
      r.draw();
      expect(jel.find('line').length).toBe(0);
      expect(jel.find('circle').length).toBe(0);
    });

    it("should render cubic curve helpers", function() {
      r.debug = true;
      var p = r.path(10, 10);
      p.curveTo(100, 105, 200, 205, 300, 305).closeShape();
      r.draw();

      expect(jel.find('line').length).toBe(2);
      expect(jel.find('line')[0]).toHaveAttrs({x1: 110, y1: 115, x2:310, y2:315});
      expect(jel.find('line')[1]).toHaveAttrs({x1: 210, y1: 215, x2:310, y2:315});

      expect(jel.find('circle').length).toBe(3);
      expect(jel.find('circle')[0]).toHaveAttrs({cx: 110, cy: 115});
      expect(jel.find('circle')[1]).toHaveAttrs({cx: 210, cy: 215});
      expect(jel.find('circle')[2]).toHaveAttrs({cx: 310, cy: 315});
    });

    it("should render quad curve helpers", function() {
      r.debug = true;
      var p = r.path(10, 10);
      p.curveTo(200, 205, 300, 305).closeShape();
      r.draw();

      expect(jel.find('line').length).toBe(1);
      expect(jel.find('line')[0]).toHaveAttrs({x1: 210, y1: 215, x2:310, y2:315});

      expect(jel.find('circle').length).toBe(2);
      expect(jel.find('circle')[0]).toHaveAttrs({cx: 210, cy: 215});
      expect(jel.find('circle')[1]).toHaveAttrs({cx: 310, cy: 315});

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

      var jgrid = jel.children().first();
      expect(jgrid).toBeTag("g");
      expect(jgrid).toHaveTranslation(10, 15);

      expect(jgrid.find('rect').length).toBe(1);
      expect(jgrid.find('rect')[0]).toHaveAttrs({x: 0, y: 0, width:115, height:130});

      expect(jgrid.find('line').length).toBe(8);
      expect(jgrid.find('line')[0]).toHaveAttrs({x1: 25, y1: 0, x2:25, y2:grid.vars.height});
      expect(jgrid.find('line')[1]).toHaveAttrs({x1: 45, y1: 0, x2:45, y2:grid.vars.height});
      expect(jgrid.find('line')[2]).toHaveAttrs({x1: 70, y1: 0, x2:70, y2:grid.vars.height});
      expect(jgrid.find('line')[3]).toHaveAttrs({x1: 90, y1: 0, x2:90, y2:grid.vars.height});
      expect(jgrid.find('line')[4]).toHaveAttrs({x1: 0, y1: 30, x2:grid.vars.width, y2:30});
      expect(jgrid.find('line')[5]).toHaveAttrs({x1: 0, y1: 50, x2:grid.vars.width, y2:50});
      expect(jgrid.find('line')[6]).toHaveAttrs({x1: 0, y1: 80, x2:grid.vars.width, y2:80});
      expect(jgrid.find('line')[7]).toHaveAttrs({x1: 0, y1: 100, x2:grid.vars.width, y2:100});
    });

  })

  // MAKE A COMPLEX TEST THAT HAS A BUNCH OF GROUPS
  // NESTED IN EACH OTHER, etc.

});
