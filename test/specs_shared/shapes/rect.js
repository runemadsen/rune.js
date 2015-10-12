import Helpers from '../helpers'

describe("Rune.Rectangle", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Rectangle(10, 15, 300, 305);
    g = new Rune.Group();
    g.add(s);
  });

  describe("toPolygon()", function() {

    it("defaults to corner vectors", function() {
      var poly = s.toPolygon();
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(4);
      expect(poly.vars.vectors[0]).toEqualVector(0, 0);
      expect(poly.vars.vectors[1]).toEqualVector(300, 0);
      expect(poly.vars.vectors[2]).toEqualVector(300, 305);
      expect(poly.vars.vectors[3]).toEqualVector(0, 305);
    });

    it("returns polygon with even spaced vectors", function() {
      var poly = s.toPolygon({ spacing: 50 });
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(25);
    });

    it("adds polygon to parent", function() {
      expect(g.children.length).toEqual(1);
      s.toPolygon();
      expect(g.children.length).toEqual(2);
    });

    it("does not add polygon to parent", function() {
      expect(g.children.length).toEqual(1);
      s.toPolygon({}, false);
      expect(g.children.length).toEqual(1);
    });

    it("copies the mixin vars", function() {
      Helpers.setMixinVars(s)
      var p = s.toPolygon();
      expect(Helpers.getMixinVars(p)).toBeIn(Helpers.getMixinVars(s));
    });

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