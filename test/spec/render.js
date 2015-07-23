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
      r.rect(100, 105, 300, 400);
      r.draw();
      expect(jel.find('rect').length).toEqual(1);
      var rect = jel.children().first();
      expect(rect.prop("tagName")).toEqual("rect")
      expect(rect.attr("x")).toEqual("100");
      expect(rect.attr("y")).toEqual("105");
      expect(rect.attr("width")).toEqual("300");
      expect(rect.attr("height")).toEqual("400");
      // rotation
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
