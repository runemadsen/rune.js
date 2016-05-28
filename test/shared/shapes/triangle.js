describe("Rune.Triangle", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Triangle(10, 15, 20, 25, 30, 35);
    g = new Rune.Group();
  });

  describe("constructor", function() {

    it("should accept vector arguments", function() {
      var v1 = new Rune.Vector(10, 15);
      var v2 = new Rune.Vector(20, 25);
      var v3 = new Rune.Vector(30, 35);
      var t1 = new Rune.Triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
      var t2 = new Rune.Triangle(v1, v2.x, v2.y, v3);
      var t3 = new Rune.Triangle(v1, v2, v3);
      expect(t1.vars.x).toEqual(10);
      expect(t2.vars.x).toEqual(10);
      expect(t3.vars.x).toEqual(10);
      expect(t1.vars.x2).toEqual(10);
      expect(t2.vars.x2).toEqual(10);
      expect(t3.vars.x2).toEqual(10);
      expect(t1.vars.y3).toEqual(20);
      expect(t2.vars.y3).toEqual(20);
      expect(t3.vars.y3).toEqual(20);
    });

  });

  describe("copy()", function() {
    it("has shared copy functionality", function() {
      expectCopy(s);
    });
  });

  describe("scale()", function() {

    it("scales the rectangle", function() {
      spyOn(s, 'scaleStyleable');
      s.scale(2);
      expect(s.vars.x).toEqual(10);
      expect(s.vars.y).toEqual(15);
      expect(s.vars.x2).toEqual(20);
      expect(s.vars.y2).toEqual(20);
      expect(s.vars.x3).toEqual(40);
      expect(s.vars.y3).toEqual(40);
      expect(s.scaleStyleable).toHaveBeenCalledWith(2);
    });

  });

});
