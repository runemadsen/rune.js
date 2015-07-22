describe("Rune.Anchor", function() {

  var r;

  beforeEach(function() {
    r = new Rune();
  });

  describe(".setMove()", function() {

    it("creates move absolute", function() {
      var a = new Rune.Anchor().setMove(100, 105);
      expect(a).toBeVectorMove(100, 105, false);
    });

    it("creates move relative", function() {
      var a = new Rune.Anchor().setMove(100, 105, true);
      expect(a).toBeVectorMove(100, 105, true);
    });

  });

  describe(".setLine()", function() {

    it("creates line absolute", function() {
      var a = new Rune.Anchor().setLine(100, 105);
      expect(a).toBeVectorLine(100, 105, false);
    });

    it("creates line relative", function() {
      var a = new Rune.Anchor().setLine(100, 105, true);
      expect(a).toBeVectorLine(100, 105, true);
    });

  });

  describe(".setCurve()", function() {

    it("creates cubic absolute", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305);
      expect(a).toBeVectorCubic(100, 105, 200, 205, 300, 305, false);
    });

    it("creates cubic relative", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305, true);
      expect(a).toBeVectorCubic(100, 105, 200, 205, 300, 305, true);
    });

    it("creates cubic absolute shorthand", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205);
      expect(a).toBeVectorCubic(100, 105, 200, 205, false);
    });

    it("creates cubic relative shorthand", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, true);
      expect(a).toBeVectorCubic(100, 105, 200, 205, true);
    });

    it("creates quad absolute", function() {
      var a = new Rune.Anchor().setCurve(Rune.QUAD, 100, 105, 200, 205);
      expect(a).toBeVectorQuad(100, 105, 200, 205, false);
    });

    it("creates quad relative", function() {
      var a = new Rune.Anchor().setCurve(Rune.QUAD, 100, 105, 200, 205, true);
      expect(a).toBeVectorQuad(100, 105, 200, 205, true);
    });

    it("creates quad absolute shorthand", function() {
      var a = new Rune.Anchor().setCurve(Rune.QUAD, 100, 105);
      expect(a).toBeVectorQuad(100, 105, false);
    });

    it("creates quad relative shorthand", function() {
      var a = new Rune.Anchor().setCurve(Rune.QUAD, 100, 105, true);
      expect(a).toBeVectorQuad(100, 105, true);
    });

  });

});
