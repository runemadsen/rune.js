describe("Rune.Gradient", function() {

  it("defaults to linear gradient", function() {
    var grad = new Rune.Gradient();
    expect(grad.type).toEqual('linear');
  });

  it("set the type from constructor", function() {
    var grad = new Rune.Gradient('radial');
    expect(grad.type).toEqual('radial');
  });

});
