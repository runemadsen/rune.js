import Helpers from '../helpers'

describe("Rune.Sizeable", function() {

  var m;

  beforeEach(function() {
    m = Helpers.newMixin(Rune.Sizeable);
    m.sizeable();
  });

  describe("sizeable()", function() {

    it("assigns default variables", function() {
      expect(typeof m.sizeable).toEqual("function");
      expect(m.vars.width).toEqual(0);
      expect(m.vars.height).toEqual(0);
    });

    it("copies variables from object", function() {
      Helpers.setSizeableVars(m);
      var m2 = Helpers.newMixin(Rune.Sizeable);
      m2.sizeable(m);
      expect(m2.vars.width).toEqual(300);
      expect(m2.vars.height).toEqual(305);
    });

  });

});