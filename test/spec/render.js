// Helpers
// --------------------------------------------------

function drawShared(shape) {
  shape.rotate(45, 100, 105)
    .fill(255, 0, 0, 0.5)
    .stroke(0, 255, 0, 0.6)
    .strokeWidth(5)
    .strokeCap(Rune.ROUND)
    .strokeJoin(Rune.MITER)
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

    // using rectangle here, but I'm testing shared functionality

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
      expect(jshape).toHaveAttr("d", "M 0 0 L 104 105 l 106 107 M 100 101 m 102 103 C 108 109 110 111 112 113 c 114 115 116 117 118 119 Q 120 121 122 123 q 124 125 126 127 T 128 129 t 130 131 Z")
      expect(jshape).toHaveTranslation(10, 15);
      expectShared(jshape);
    });

  });

  describe("Rune.Group", function() {

    it("should render group", function() {
      var g = r.group(10, 15)
        .rotate(45);
      r.draw();
      var jgroup = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jgroup).toHaveTranslation(10, 15);
      expect(jgroup).toHaveRotation(g.vars.rotation);
    });

  });

  describe("Rune.Grid", function() {

    it("should render grid", function() {
      var g = r.grid({
        gutterX: 10,
        gutterY: 20,
        moduleWidth: 50,
        moduleHeight: 40,
        columns: 4,
        rows: 5
      }).rotate(45);
      r.draw();
      expect(true).toBe(false);
      //var jgroup = jel.children().first();
      //expect(jel.children().length).toEqual(1);
      //expect(jgroup).toHaveTranslation(10, 15);
      //expect(jgroup).toHaveRotation(g.vars.rotation);
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

  })

  // MAKE A COMPLEX TEST THAT HAS A BUNCH OF GROUPS
  // NESTED IN EACH OTHER, etc.

});
