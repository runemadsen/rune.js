describe("Rune.Triangle", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Triangle(10, 15, 20, 25, 30, 35);
    g = new Rune.Group();
    g.add(s);
  });

  describe("move()", function() {

  });

  describe("copy()", function() {

    it("copies the object", function() {
      setMixinVars(s);
      var copy = s.copy();
      expect(copy).not.toBe(s);
      expect(copy).toEqual(s);
    });

    it("adds copy to parent", function() {
      expect(g.children.length).toEqual(1);
      s.copy();
      expect(g.children.length).toEqual(2);
    });

    it("does not add copy to parent", function() {
      expect(g.children.length).toEqual(1);
      s.copy(false);
      expect(g.children.length).toEqual(1);
    });

  });

  describe("scale()", function() {

    it("scales the rectangle", function() {
      s.scale(2);
      expect(s.vars.x).toEqual(10);
      expect(s.vars.y).toEqual(15);
      expect(s.vars.x2).toEqual(20);
      expect(s.vars.y2).toEqual(20);
      expect(s.vars.x3).toEqual(40);
      expect(s.vars.y3).toEqual(40);
    });

  });

});
