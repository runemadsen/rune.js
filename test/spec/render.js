describe("SVG Render", function() {

  it("should create SVG element", function() {
    var r = new Rune({width:200, height:300});
    var el = r.getEl();
    expect(el.tagName).toEqual('svg');
    expect($(el).attr('width')).toEqual("200");
    expect($(el).attr('height')).toEqual("300");
  });

  // all of these should have
  // fill, stroke, strokewidth, strokeCap, position, rotation
  it("should render rect");
  it("should render ellipse");
  it("should render circle");
  it("should render line");
  it("should render polygon");
  it("should render path");

  it("should render nested groups and shapes");

});
