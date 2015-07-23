// Helpers
// --------------------------------------------------

function setMoveable(object) {
  // x,y in constructor
  object.rotate(45);
}

function setStyleable(object) {
  object.fill(255, 0, 0).stroke(0, 255, 0);
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

  // all of these should have all the properties of the objects
  //it("should render line");
  //it("should render polygon");
  //it("should render path");
  //it("should render group with translation n stuff");

  // and a complex thing here just checking the order,
  // not the translation.
  it("try a complex example here")

});
