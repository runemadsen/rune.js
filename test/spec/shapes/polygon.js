describe("Rune.Polygon", function() {

  var r;

  beforeEach(function() {
    r = new Rune();
  });

  it("should create vectors", function() {

    var p = new Rune.Polygon()
      .lineTo(100, 101)
      .lineTo(200, 201)
      .lineTo(300, 301);

    expect(p.vectors[0].x).toEqual(100);
    expect(p.vectors[0].y).toEqual(101);
    expect(p.vectors[1].x).toEqual(200);
    expect(p.vectors[1].y).toEqual(201);
    expect(p.vectors[2].x).toEqual(300);
    expect(p.vectors[2].y).toEqual(301);

  });

});
