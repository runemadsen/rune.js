describe("Rune.Ellipse", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Ellipse(10, 15, 300, 305);
    g = new Rune.Group();
    g.add(s);
  });

  describe("toPolygon()", function() {

    it("defaults to 16 vectors", function() {
      var poly = s.toPolygon();
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(16);
    });

    it("returns polygon with exact number of vectors", function() {
      var poly = s.toPolygon({ vectors: 10 });
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(10);
    });

    it("returns polygon with even spaced vectors", function() {
      var poly = s.toPolygon({ spacing: 50 });
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(39);
    });

    it("returns polygon with even spaced division", function() {
      var poly = s.toPolygon({ division: 0.2 });
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(5);
    });

  });

  describe("copy()", function() {

    it("copies the object", function() {
      setMixinVars(s);
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