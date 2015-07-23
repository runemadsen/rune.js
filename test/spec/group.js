describe("Rune.Group", function() {

  it("should have optional x and y", function() {

    var g1 = new Rune.Group();
    expect(g1.x).toEqual(0);
    expect(g1.y).toEqual(0);

    var g2 = new Rune.Group(100, 101);
    expect(g2.x).toEqual(100);
    expect(g2.y).toEqual(101);

  });

});
