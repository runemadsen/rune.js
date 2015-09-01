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
      expect(copy === s).toEqual(false);
      expect(copy).toEqual(s);
    });

    it("calls shapeCopy", function() {
      spyOn(s, "shapeCopy");
      s.copy(g);
      expect(s.shapeCopy).toHaveBeenCalled();
    });

  });

});