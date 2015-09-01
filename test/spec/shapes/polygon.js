import Helpers from '../helpers'

describe("Rune.Polygon", function() {

  var rhombus;

  beforeEach(function() {
    rhombus = new Rune.Polygon(10, 15)
      .lineTo(0, 0)
      .lineTo(60, 0)
      .lineTo(80, 60)
      .lineTo(20, 60);
  });

  describe("Polygon()", function() {

    it("should have optional x and y", function() {
      var p1 = new Rune.Polygon();
      expect(p1.vars.x).toEqual(0);
      expect(p1.vars.y).toEqual(0);

      var p2 = new Rune.Polygon(100, 101);
      expect(p2.vars.x).toEqual(100);
      expect(p2.vars.y).toEqual(101);
    });

  });

  describe("vectors", function() {

    it("should create vectors", function() {
      var p = new Rune.Polygon()
        .lineTo(100, 101)
        .lineTo(200, 201)
        .lineTo(300, 301);
      expect(p.vars.vectors[0].x).toEqual(100);
      expect(p.vars.vectors[0].y).toEqual(101);
      expect(p.vars.vectors[1].x).toEqual(200);
      expect(p.vars.vectors[1].y).toEqual(201);
      expect(p.vars.vectors[2].x).toEqual(300);
      expect(p.vars.vectors[2].y).toEqual(301);
    });

  });

  describe("centroid()", function() {
    it("should return centroid vector", function() {
      var vec = rhombus.centroid();
      expect(vec).toEqualVector(50, 45);
    });
  });

  describe("bounds()", function() {

    it("should return bounds", function() {
      expect(rhombus.bounds()).toEqual({
        x:10,
        y:15,
        width:80,
        height:60
      });
    });

    it("should work with minus values", function() {
      var circle = new Rune.Polygon(10, 10)
        .lineTo(-100, -100)
        .lineTo(100, -100)
        .lineTo(100, 100)
        .lineTo(-100, 100);
      expect(circle.bounds()).toEqual({
        x: -90,
        y: -90,
        width: 200,
        height: 200
      });
    });

  });

  describe("length()", function() {

    it("should return length of polygon", function() {
      var res = rhombus.length();
      expect(res).toEqual(246.49110640673518);
    });

  });

  describe("vectorAt()", function() {

    it("should return vector at scalar", function() {
      var res = rhombus.vectorAt(0.5);
      expect(res).toEqualVector(80, 60);
    });

    it("should return vector if scalar is 0", function() {
      var res = rhombus.vectorAt(0);
      expect(res).toEqualVector(0, 0);
    });

    it("should return vector if scalar is 1", function() {
      var res = rhombus.vectorAt(1);
      expect(res).toEqualVector(0, 0);
    });

  });

  describe("vectorAtLength()", function() {

    it("should return vector at length", function() {
      var res = rhombus.vectorAtLength(70);
      expect(res).toEqualVector(63.16227766016838, 9.486832980505138);
    });

    it("should return vector if length is 0", function() {
      var res = rhombus.vectorAtLength(0);
      expect(res).toEqualVector(0, 0);
    });

    it("should return vector if length is more length", function() {
      var res = rhombus.vectorAtLength(999999);
      expect(res).toEqualVector(0, 0);
    });

  });

  describe("toPolygon()", function() {

    it("should return self if no segmentor", function() {
      var res = rhombus.toPolygon();
      expect(res).toBe(res);
    });

    it("should return vectors with spacing", function() {
      var res = rhombus.toPolygon({ spacing: 25 });
      expect(res.vars.x).toEqual(10);
      expect(res.vars.y).toEqual(15);
      expect(res.vars.vectors.length).toEqual(10);
      expect(res.vars.vectors[0]).toEqualVector(0, 0);
      expect(res.vars.vectors[1]).toEqualVector(25, 0);
      expect(res.vars.vectors[2]).toEqualVector(50, 0);
      expect(res.vars.vectors[3]).toEqualVector(64.74341649025257, 14.230249470757707);
      expect(res.vars.vectors[4]).toEqualVector(72.64911064067351, 37.94733192202055);
      expect(res.vars.vectors[5]).toEqualVector(78.24555320336759, 60);
      expect(res.vars.vectors[6]).toEqualVector(53.24555320336759, 60);
      expect(res.vars.vectors[7]).toEqualVector(28.245553203367592,60);
      expect(res.vars.vectors[8]).toEqualVector(14.701778718652967,44.1053361559589);
      expect(res.vars.vectors[9]).toEqualVector(6.796084568232018,20.388253704696055);
    });

  });

  describe("copy()", function() {

    var s;
    var g;

    beforeEach(function() {
      s = new Rune.Polygon()
        .lineTo(100, 101)
        .lineTo(200, 201)
        .lineTo(300, 301);
      g = new Rune.Group();
      g.add(s);
    });

    it("copies the object", function() {
      Helpers.setMixinVars(s);
      var copy = s.copy();
      expect(copy).not.toBe(s);
      expect(copy.vars.vectors).not.toBe(s.vars.vectors);
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
