import Helpers from '../helpers'

describe("Rune.Groupable", function() {

  var g;
  var s;

  beforeEach(function() {
    g = new Rune.Group();
    s = Helpers.newMixin(Rune.Moveable);
  });

  describe("addTo()", function() {

    it("adds child to parent", function() {
      expect(s).not.toBeChildOf(g);
      s.addParent(g);
      expect(s).toBeChildOf(g);
    });

  });

  describe("remove()", function() {

    it("removes child from parent", function() {
      g.add(s);
      expect(s).toBeChildOf(g);
      s.removeParent();
      expect(s).not.toBeChildOf(g);
    });

  });

});