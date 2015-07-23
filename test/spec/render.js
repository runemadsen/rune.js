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
      var rect = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(rect).toBeTag("rect");
      expect(rect).toBeMoveableTag(s);
      expect(rect).toBeSizeableTag(s);
      expect(rect).toBeStyleableTag(s);
    });

  });

  // all of these should have all the properties of the objects
  //it("should render rect");
  //it("should render ellipse");
  //it("should render circle");
  //it("should render line");
  //it("should render polygon");
  //it("should render path");
  //it("should render nested group");

  // and a complex thing here just checking the order,
  // not the translation.
  it("try a complex example here")

});
