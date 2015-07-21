describe("Render", function() {

  it("should create SVG element", function() {
    var r = new Rune({width:200, height:300});
    var el = r.getEl();
    expect(el.tagName).toEqual('svg');
    expect($(el).attr('width')).toEqual("200");
    expect($(el).attr('height')).toEqual("300");
  });

});
