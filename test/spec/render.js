// Helpers
// --------------------------------------------------

function drawShared(shape) {
  shape.rotate(45, 100, 105)
    .fill(255, 0, 0)
    .stroke(0, 255, 0)
    .strokeWidth(5)
    .strokeCap(Rune.ROUND)
    .strokeJoin(Rune.MITER)
    .strokeMiterlimit(7)
    .strokeDash("3,4,5")
    .strokeDashOffset(10)
}

function expectShared(jshape) {
  expect(jshape).toHaveRotation(45, 100, 105);
  expect(jshape).toHaveAttr("fill", "#FF0000");
  expect(jshape).toHaveAttr("stroke", "#00FF00");
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

    it("should not render false vars", function() {
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
      expect(jshape.attr('fill')).toBeUndefined()
      expect(jshape.attr('stroke')).toBeUndefined()
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
      expect(jshape).toHaveAttr("d", "M 0 0 L 104 105 l 106 107 M 100 101 m 102 103 C 108 109 110 111 112 113 c 114 115 116 117 118 119 S 120 121 122 123 s 124 125 126 127 Q 128 129 130 131 q 132 133 134 135 T 136 137 t 138 139 Z")
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

  // MAKE A COMPLEX TEST THAT HAS A BUNCH OF GROUPS
  // NESTED IN EACH OTHER, etc.

});
