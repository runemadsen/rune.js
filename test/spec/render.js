// Helpers
// --------------------------------------------------

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

  describe("Rune.Rectangle", function() {

    it("should render rectangle", function() {
      var s = r.rect(100, 105, 300, 400)
        .rotate(45)
        .fill(255, 0, 0)
        .stroke(0, 255, 0);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("rect");
      expect(jshape).toHaveAttrs({
        x: s.x,
        y: s.y,
        width: s.width,
        height: s.height
      });
      expect(jshape).toHaveRotation(s.rotation);
      expect(jshape).toHaveAttr("fill", "#FF0000");
      expect(jshape).toHaveAttr("stroke", "#00FF00");
    });

  });

  describe("Rune.Ellipse", function() {

    it("should render ellipse", function() {
      var s = r.ellipse(100, 105, 300, 400)
        .rotate(45)
        .fill(255, 0, 0)
        .stroke(0, 255, 0);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("ellipse");
      expect(jshape).toHaveAttrs({
        cx: s.x,
        cy: s.y,
        rx: s.width,
        ry: s.height
      });
      expect(jshape).toHaveRotation(s.rotation);
      expect(jshape).toHaveAttr("fill", "#FF0000");
      expect(jshape).toHaveAttr("stroke", "#00FF00");
    });

  });

  describe("Rune.Circle", function() {

    it("should render circle", function() {
      var s = r.circle(100, 105, 300)
        .rotate(45)
        .fill(255, 0, 0)
        .stroke(0, 255, 0);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("circle");
      expect(jshape).toHaveAttrs({
        cx: s.x,
        cy: s.y,
        r: s.radius
      });
      expect(jshape).toHaveRotation(45);
      expect(jshape).toHaveAttr("fill", "#FF0000");
      expect(jshape).toHaveAttr("stroke", "#00FF00");
    });

  });

  describe("Rune.Line", function() {

    it("should render line", function() {
      var s = r.line(100, 105, 200, 205)
        .rotate(45)
        .fill(255, 0, 0)
        .stroke(0, 255, 0);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("line");
      expect(jshape).toHaveAttrs({
        x1: s.x,
        y1: s.y,
        x2: s.x2,
        y2: s.y2
      });
      expect(jshape).toHaveRotation(s.rotation);
      expect(jshape).toHaveAttr("fill", "#FF0000");
      expect(jshape).toHaveAttr("stroke", "#00FF00");
    });

  });

  describe("Rune.Polygon", function() {

    it("should render polygon", function() {
      var s = r.polygon(10, 15)
        .lineTo(100, 101)
        .lineTo(200, 201)
        .lineTo(300, 301)
        .rotate(45)
        .fill(255, 0, 0)
        .stroke(0, 255, 0);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("polygon");
      expect(jshape).toHaveAttr("points", "100 101 200 201 300 301")
      expect(jshape).toHaveTranslation(10, 15);
      expect(jshape).toHaveRotation(s.rotation);
      expect(jshape).toHaveAttr("fill", "#FF0000");
      expect(jshape).toHaveAttr("stroke", "#00FF00");
    });

  });

  describe("Rune.Path", function() {

    it("should render path", function() {
      var s = r.path(10, 15)
        .rotate(45)
        .fill(255, 0, 0)
        .stroke(0, 255, 0);
      drawAllAnchors(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("path");
      expect(jshape).toHaveAttr("d", "M 100 101 m 102 103 L 104 105 l 106 107 C 108 109 110 111 112 113 c 114 115 116 117 118 119 S 120 121 122 123 s 124 125 126 127 Q 128 129 130 131 q 132 133 134 135 T 136 137 t 138 139")
      expect(jshape).toHaveTranslation(10, 15);
      expect(jshape).toHaveRotation(s.rotation);
      expect(jshape).toHaveAttr("fill", "#FF0000");
      expect(jshape).toHaveAttr("stroke", "#00FF00");
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
      expect(jgroup).toHaveRotation(g.rotation);
    });

  });

  //it("should render group with translationsf");

  // and a complex thing here just checking the order,
  // not the translation.
  it("try a complex example here")

});
