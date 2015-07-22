describe("Rune.Anchor", function() {

  var r;

  beforeEach(function() {
    r = new Rune();
  });

  describe(".setMove()", function() {

    it("creates move absolute", function() {
      var a = new Rune.Anchor().setMove(100, 105);
      expect(a.command).toEqual(Rune.MOVE);
      expect(a.relative).toEqual(false);
      expect(a.vec1.x).toEqual(100);
      expect(a.vec1.y).toEqual(105);
    });

    it("creates move relative", function() {
      var a = new Rune.Anchor().setMove(100, 105, true);
      expect(a.command).toEqual(Rune.MOVE);
      expect(a.relative).toEqual(true);
      expect(a.vec1.x).toEqual(100);
      expect(a.vec1.y).toEqual(105);
    });

  });

  describe(".setLine()", function() {

    it("creates line absolute", function() {
      var a = new Rune.Anchor().setLine(100, 105);
      expect(a.command).toEqual(Rune.LINE);
      expect(a.relative).toEqual(false);
      expect(a.vec1.x).toEqual(100);
      expect(a.vec1.y).toEqual(105);
    });

    it("creates line relative", function() {
      var a = new Rune.Anchor().setLine(100, 105, true);
      expect(a.command).toEqual(Rune.LINE);
      expect(a.relative).toEqual(true);
      expect(a.vec1.x).toEqual(100);
      expect(a.vec1.y).toEqual(105);
    });

  });

  describe(".setCurve()", function() {

    it("creates cubic absolute", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305);
      expect(a.command).toEqual(Rune.CUBIC);
      expect(a.relative).toEqual(false)
      expect(a.vec1.x).toEqual(100);
      expect(a.vec1.y).toEqual(105);
      expect(a.vec2.x).toEqual(200);
      expect(a.vec2.y).toEqual(205);
      expect(a.vec3.x).toEqual(300);
      expect(a.vec3.y).toEqual(305);
    });

    it("creates cubic relative", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305, true);
      expect(a.command).toEqual(Rune.CUBIC);
      expect(a.relative).toEqual(true)
      expect(a.vec1.x).toEqual(100);
      expect(a.vec1.y).toEqual(105);
      expect(a.vec2.x).toEqual(200);
      expect(a.vec2.y).toEqual(205);
      expect(a.vec3.x).toEqual(300);
      expect(a.vec3.y).toEqual(305);
    });

    it("creates cubic absolute shorthand", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205);
      expect(a.command).toEqual(Rune.CUBIC);
      expect(a.relative).toEqual(false)
      expect(a.vec1.x).toEqual(100);
      expect(a.vec1.y).toEqual(105);
      expect(a.vec2.x).toEqual(200);
      expect(a.vec2.y).toEqual(205);
      expect(a.vec3).toBeUndefined()
    });

    it("creates cubic relative shorthand", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, true);
      expect(a.command).toEqual(Rune.CUBIC);
      expect(a.relative).toEqual(true)
      expect(a.vec1.x).toEqual(100);
      expect(a.vec1.y).toEqual(105);
      expect(a.vec2.x).toEqual(200);
      expect(a.vec2.y).toEqual(205);
      expect(a.vec3).toBeUndefined()
    });

    it("creates quad absolute", function() {
      var a = new Rune.Anchor().setCurve(Rune.QUAD, 100, 105, 200, 205);
      expect(a.command).toEqual(Rune.QUAD);
      expect(a.relative).toEqual(false)
      expect(a.vec1.x).toEqual(100);
      expect(a.vec1.y).toEqual(105);
      expect(a.vec2.x).toEqual(200);
      expect(a.vec2.y).toEqual(205);
      expect(a.vec3).toBeUndefined()
    });

    it("creates quad relative", function() {
      var a = new Rune.Anchor().setCurve(Rune.QUAD, 100, 105, 200, 205, true);
      expect(a.command).toEqual(Rune.QUAD);
      expect(a.relative).toEqual(true)
      expect(a.vec1.x).toEqual(100);
      expect(a.vec1.y).toEqual(105);
      expect(a.vec2.x).toEqual(200);
      expect(a.vec2.y).toEqual(205);
      expect(a.vec3).toBeUndefined()
    });

    it("creates quad absolute shorthand", function() {
      var a = new Rune.Anchor().setCurve(Rune.QUAD, 100, 105);
      expect(a.command).toEqual(Rune.QUAD);
      expect(a.relative).toEqual(false)
      expect(a.vec1.x).toEqual(100);
      expect(a.vec1.y).toEqual(105);
      expect(a.vec2).toBeUndefined();
      expect(a.vec3).toBeUndefined();
    });

    it("creates quad relative shorthand", function() {
      var a = new Rune.Anchor().setCurve(Rune.QUAD, 100, 105, true);
      expect(a.command).toEqual(Rune.QUAD);
      expect(a.relative).toEqual(true)
      expect(a.vec1.x).toEqual(100);
      expect(a.vec1.y).toEqual(105);
      expect(a.vec2).toBeUndefined();
      expect(a.vec3).toBeUndefined();
    });

  });

});
