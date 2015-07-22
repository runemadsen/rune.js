describe("Rune.Path", function() {

  var r;

  beforeEach(function() {
    r = new Rune();
  });

  it("should create anchors", function() {

    var p = new Rune.Path()
      .moveTo(100, 101)
      .moveTo(102, 103, true)
      .lineTo(104, 105)
      .lineTo(106, 107, true)
      .curveTo(108, 109, 110, 111, 112, 113)
      .curveTo(114, 115, 116, 117, 118, 119, true)
      .curveTo(120, 121, 122, 123)
      .curveTo(124, 125, 126, 127, true)
      .curveTo(Rune.QUAD, 128, 129, 130, 131)
      .curveTo(Rune.QUAD, 132, 133, 134, 135, true)
      .curveTo(Rune.QUAD, 136, 137)
      .curveTo(Rune.QUAD, 138, 139, true)

    expect(p.anchors[0]).toBeVectorMove(100, 101, false);




  });

});
