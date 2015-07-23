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
      expect(jshape).toBeMoveableTag(s);
      expect(jshape).toBeSizeableTag(s);
      expect(jshape).toBeStyleableTag(s);
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
      expect(jshape.attr("cx")).toEqual(s.x + "");
      expect(jshape.attr("cy")).toEqual(s.y + "");
      expect(jshape.attr("transform")).toEqual("rotate("+s.rotation+")");
      expect(jshape.attr("rx")).toEqual(s.width + "");
      expect(jshape.attr("ry")).toEqual(s.height + "");
      expect(jshape).toBeStyleableTag(s);
    });

  });

  // all of these should have all the properties of the objects
  //it("should render ellipse");
  //it("should render circle");
  //it("should render line");
  //it("should render polygon");
  //it("should render path");
  //it("should render group with translation n stuff");

  // and a complex thing here just checking the order,
  // not the translation.
  it("try a complex example here")

});
