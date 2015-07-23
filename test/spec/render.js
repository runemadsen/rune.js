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
      var s = r.rect(100, 105, 300, 400);
      setMoveable(s);
      setStyleable(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("rect");
      expect(jshape).toHaveAttributes({
        x: s.x,
        y: s.y,
        width: s.width,
        height: s.height
      });
      expect(jshape).toHaveMoveableAttributes(s);
      expect(jshape).toHaveStyleableAttributes(s);
    });

  });

  describe("Rune.Ellipse", function() {

    it("should render ellipse", function() {
      var s = r.ellipse(100, 105, 300, 400);
      setMoveable(s);
      setStyleable(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("ellipse");
      expect(jshape).toHaveAttributes({
        cx: s.x,
        cy: s.y,
        rx: s.width,
        ry: s.height
      });
      expect(jshape).toHaveMoveableAttributes(s);
      expect(jshape).toHaveStyleableAttributes(s);
    });

  });

  describe("Rune.Circle", function() {

    it("should render circle", function() {
      var s = r.circle(100, 105, 300);
      setMoveable(s);
      setStyleable(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("circle");
      expect(jshape).toHaveAttributes({
        cx: s.x,
        cy: s.y,
        r: s.radius
      });
      expect(jshape).toHaveMoveableAttributes(s);
      expect(jshape).toHaveStyleableAttributes(s);
    });

  });

  describe("Rune.Line", function() {

    it("should render line", function() {
      var s = r.line(100, 105, 200, 205);
      setMoveable(s);
      setStyleable(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("line");
      expect(jshape).toHaveAttributes({
        x1: s.x,
        y1: s.y,
        x2: s.x2,
        y2: s.y2
      });
      expect(jshape).toHaveMoveableAttributes(s);
      expect(jshape).toHaveStyleableAttributes(s);
    });

  });

  describe("Rune.Path", function() {

    it("should render path", function() {
      var s = r.path();
      drawAllAnchors(s);
      setMoveable(s);
      setStyleable(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("path");
      expect(jshape).toHaveAttribute("d", "M 100 101 m 102 103 L 104 105 l 106 107 C 108 109 110 111 112 113 c 114 115 116 117 118 119 S 120 121 122 123 s 124 125 126 127 Q 128 129 130 131 q 132 133 134 135 T 136 137 t 138 139")
      expect(jshape).toHaveMoveableAttributes(s);
      expect(jshape).toHaveStyleableAttributes(s);
    });

  });

  // all of these should have all the properties of the objects
  //it("should render polygon");
  //it("should render group with translation n stuff");

  // and a complex thing here just checking the order,
  // not the translation.
  it("try a complex example here")

});
