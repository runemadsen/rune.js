describe("Rune.Text", function() {

  describe("copy()", function() {

    var t;
    var g;

    beforeEach(function() {
      t = new Rune.Text("Hello there", 10, 15);
      g = new Rune.Group();
      g.add(t);
    });

    it("copies the object", function() {
      setMixinVars(t);
      var copy = t.copy();
      expect(copy === t).toEqual(false);
      expect(copy).toEqual(t);
    });

    it("calls shapeCopy", function() {
      spyOn(t, "shapeCopy");
      t.copy(g);
      expect(t.shapeCopy).toHaveBeenCalled();
    });

  });

});