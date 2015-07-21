describe("init", function() {


  it("should create SVG element", function() {
    var r = new Rune({width:200, height:300});
    expect(r.el.tagName).toEqual('svg');
  });

  //it("should call draw", function() {
  //  var fake = {
  //    draw: function(r) {}
  //  }
  //  spyOn(fake, 'draw');
  //  var r = new Rune().on('draw', fake.draw);
  //  expect(fake.setup).toHaveBeenCalledWith(r);
  //  expect(fake.setup.calls()).toEqual(xxxx);
  //});

});
