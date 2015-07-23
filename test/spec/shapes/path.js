describe("Rune.Path", function() {

  it("should create anchors", function() {

    var p = new Rune.Path();
    drawAllAnchors(p);

    expect(p.anchors[0]).toBeVectorMove(100, 101, false);
    expect(p.anchors[1]).toBeVectorMove(102, 103, true);
    expect(p.anchors[2]).toBeVectorLine(104, 105, false);
    expect(p.anchors[3]).toBeVectorLine(106, 107, true);
    expect(p.anchors[4]).toBeVectorCubic(108, 109, 110, 111, 112, 113, false);
    expect(p.anchors[5]).toBeVectorCubic(114, 115, 116, 117, 118, 119, true);
    expect(p.anchors[6]).toBeVectorCubic(120, 121, 122, 123, false);
    expect(p.anchors[7]).toBeVectorCubic(124, 125, 126, 127, true);
    expect(p.anchors[8]).toBeVectorQuad(128, 129, 130, 131, false);
    expect(p.anchors[9]).toBeVectorQuad(132, 133, 134, 135, true);
    expect(p.anchors[10]).toBeVectorQuad(136, 137, false);
    expect(p.anchors[11]).toBeVectorQuad(138, 139, true);
  });

  it("should have optional x and y", function() {

    var p1 = new Rune.Path();
    expect(p1.x).toEqual(0);
    expect(p1.y).toEqual(0);

    var p2 = new Rune.Path(100, 101);
    expect(p2.x).toEqual(100);
    expect(p2.y).toEqual(101);

  });

});
