describe("Rune.Path", function() {

  it("should create anchors", function() {

    var p = new Rune.Path();
    drawAllAnchors(p);

    expect(p.vars.anchors[0]).toBeAnchorMove(100, 101, false);
    expect(p.vars.anchors[1]).toBeAnchorMove(102, 103, true);
    expect(p.vars.anchors[2]).toBeAnchorLine(104, 105, false);
    expect(p.vars.anchors[3]).toBeAnchorLine(106, 107, true);
    expect(p.vars.anchors[4]).toBeAnchorCubic(108, 109, 110, 111, 112, 113, false);
    expect(p.vars.anchors[5]).toBeAnchorCubic(114, 115, 116, 117, 118, 119, true);
    expect(p.vars.anchors[6]).toBeAnchorCubic(120, 121, 122, 123, false);
    expect(p.vars.anchors[7]).toBeAnchorCubic(124, 125, 126, 127, true);
    expect(p.vars.anchors[8]).toBeAnchorQuad(128, 129, 130, 131, false);
    expect(p.vars.anchors[9]).toBeAnchorQuad(132, 133, 134, 135, true);
    expect(p.vars.anchors[10]).toBeAnchorQuad(136, 137, false);
    expect(p.vars.anchors[11]).toBeAnchorQuad(138, 139, true);
  });

  it("should have optional x and y", function() {

    var p1 = new Rune.Path();
    expect(p1.vars.x).toEqual(0);
    expect(p1.vars.y).toEqual(0);

    var p2 = new Rune.Path(100, 101);
    expect(p2.vars.x).toEqual(100);
    expect(p2.vars.y).toEqual(101);

  });

});
