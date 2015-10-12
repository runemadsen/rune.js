import Helpers from '../helpers'

describe("Rune.Line", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Line(10, 15, 20, 25);
    g = new Rune.Group();
    g.add(s);
  });

  describe("copy()", function() {

    it("copies the object", function() {
      Helpers.setMixinVars(s);
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

});