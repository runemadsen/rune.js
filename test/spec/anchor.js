describe("Rune.Anchor", function() {

  var r;

  beforeEach(function() {
    r = new Rune();
  });

  describe("copy()", function() {

    it("copies the anchor", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305);
      var b = a.copy();
      expect(a).toEqual(b);
      expect(a === b).toBe(false);
      expect(a.vec1 === b.vec1).toBe(false);
      expect(a.vec2 === b.vec2).toBe(false);
      expect(a.vec3 === b.vec3).toBe(false);
    });

  });

  describe("setMove()", function() {

    it("creates move absolute", function() {
      var a = new Rune.Anchor().setMove(100, 105);
      expect(a).toBeAnchorMove(100, 105, false);
    });

    it("creates move relative", function() {
      var a = new Rune.Anchor().setMove(100, 105, true);
      expect(a).toBeAnchorMove(100, 105, true);
    });

  });

  describe("setLine()", function() {

    it("creates line absolute", function() {
      var a = new Rune.Anchor().setLine(100, 105);
      expect(a).toBeAnchorLine(100, 105, false);
    });

    it("creates line relative", function() {
      var a = new Rune.Anchor().setLine(100, 105, true);
      expect(a).toBeAnchorLine(100, 105, true);
    });

  });

  describe("setCurve()", function() {

    it("creates cubic absolute", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305);
      expect(a).toBeAnchorCubic(100, 105, 200, 205, 300, 305, false);
    });

    it("creates cubic relative", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305, true);
      expect(a).toBeAnchorCubic(100, 105, 200, 205, 300, 305, true);
    });

    it("creates quad absolute", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205);
      expect(a).toBeAnchorQuad(100, 105, 200, 205, false);
    });

    it("creates quad relative", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, true);
      expect(a).toBeAnchorQuad(100, 105, 200, 205, true);
    });

  });

  describe("setClose()", function() {

    it("creates close", function() {
      var a = new Rune.Anchor().setClose();
      expect(a).toBeAnchorClose();
    });

  });

  describe("vectorAt()", function() {

    it("returns throws error for move", function() {
      var a = new Rune.Anchor().setMove(0, 0);
      expect(function() { a.vectorAt(0.5) }).toThrow(new Error("Cannot find vector on move anchor"));
    });

    it("returns vector for line", function() {
      var a = new Rune.Anchor().setLine(100, 100);
      expect(a.vectorAt(0.5)).toEqualVector(50, 50);
    });

    it("returns vector for cubic bezier", function() {
      var a = new Rune.Anchor().setCurve(0, 100, 100, 100, 100, 0);
      expect(a.vectorAt(0.5)).toEqualVector(50, 75);
    });

    it("returns vector for quad bezier", function() {
      var a = new Rune.Anchor().setCurve(50, 100, 100, 0);
      expect(a.vectorAt(0.5)).toEqualVector(50, 50);
    });

  });

  describe("vectorAtLength()", function() {

  });

});
