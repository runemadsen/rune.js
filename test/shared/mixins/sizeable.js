describe("Rune.Sizeable", function() {

  var m;

  beforeEach(function() {
    m = newMixin(Rune.Sizeable);
    m.sizeable();
  });

  describe("sizeable()", function() {

    it("assigns default variables", function() {
      expect(typeof m.sizeable).toEqual("function");
      expect(m.vars.width).toEqual(0);
      expect(m.vars.height).toEqual(0);
    });

    it("copies variables from object", function() {
      setSizeableVars(m);
      var m2 = newMixin(Rune.Sizeable);
      m2.sizeable(m);
      expect(m2.vars.width).toEqual(300);
      expect(m2.vars.height).toEqual(305);
    });

  });

  describe("scaleSizeable()", function() {

    it("scales width and height", function() {
      m.vars.width = 200;
      m.vars.height = 300;
      m.scaleSizeable(3);
      expect(m.vars.width).toEqual(600);
      expect(m.vars.height).toEqual(900);
    });

  });

});
