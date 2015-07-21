describe("Instantiation", function() {


  it("should create SVG element", function() {
    var r = new Rune({width:200, height:300});
    expect(r.el.tagName).toEqual('svg');
  });

  it("should call setup function once");
  it("should call draw continously");

});
