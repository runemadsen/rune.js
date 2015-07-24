describe("Rune.Polygon", function() {

  it("should create vectors", function() {

    var p = new Rune.Polygon()
      .lineTo(100, 101)
      .lineTo(200, 201)
      .lineTo(300, 301);

    expect(p.vars.vectors[0].x).toEqual(100);
    expect(p.vars.vectors[0].y).toEqual(101);
    expect(p.vars.vectors[1].x).toEqual(200);
    expect(p.vars.vectors[1].y).toEqual(201);
    expect(p.vars.vectors[2].x).toEqual(300);
    expect(p.vars.vectors[2].y).toEqual(301);

  });

  it("should have optional x and y", function() {

    var p1 = new Rune.Polygon();
    expect(p1.vars.x).toEqual(0);
    expect(p1.vars.y).toEqual(0);

    var p2 = new Rune.Polygon(100, 101);
    expect(p2.vars.x).toEqual(100);
    expect(p2.vars.y).toEqual(101);

  });

});
