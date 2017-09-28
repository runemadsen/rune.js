describe("Rune.Circle", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Circle(10, 15, 300);
    g = new Rune.Group();
  });

  describe("radius()", function() {
    it("sets the radius", function() {
      s.radius(400);
      expect(s.state.radius).toEqual(400);
    });
  });

  describe("toPolygon()", function() {

    it("defaults to 16 vectors", function() {
      var poly = s.toPolygon();
      expect(poly.state.x).toEqual(10);
      expect(poly.state.y).toEqual(15);
      expect(poly.state.vectors.length).toEqual(16);
    });

    it("returns polygon with even spaced vectors", function() {
      var poly = s.toPolygon({ spacing: 50 });
      expect(poly.state.x).toEqual(10);
      expect(poly.state.y).toEqual(15);
      expect(poly.state.vectors.length).toEqual(76);
    });

    it("adds polygon to parent", function() {
      g.add(s);
      expect(g.children.length).toEqual(1);
      s.toPolygon();
      expect(g.children.length).toEqual(2);
    });

    it("does not add polygon to parent", function() {
      g.add(s);
      expect(g.children.length).toEqual(1);
      s.toPolygon({}, false);
      expect(g.children.length).toEqual(1);
    });

    it("copies the mixin state", function() {
      setMixinVars(s)
      var p = s.toPolygon();
      expect(getMixinVars(p)).toBeIn(getMixinVars(s));
    });

  });

  describe("copy()", function() {
    it("has shared copy functionality", function() {
      expectCopy(s);
    });
  });

  describe("scale()", function() {

    it("scales the circle", function() {
      spyOn(s, 'scaleStyles');
      s.scale(2);
      expect(s.state.x).toEqual(10);
      expect(s.state.y).toEqual(15);
      expect(s.state.radius).toEqual(600);
      expect(s.scaleStyles).toHaveBeenCalledWith(2);
    });

  });

});
