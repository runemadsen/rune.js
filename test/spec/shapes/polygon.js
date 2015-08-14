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
      setMixinVars(s);
      var copy = s.copy();
      expect(copy === s).toEqual(false);
      expect(copy.vars.vectors === s.vars.vectors).toEqual(false);
      expect(copy).toEqual(s);
    });

    it("calls shapeCopy", function() {
      spyOn(s, "shapeCopy");
      s.copy(g);
      expect(s.shapeCopy).toHaveBeenCalled();
    });

  });





});
