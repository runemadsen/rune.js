describe("Rune.Line", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Line(10, 15, 20, 25);
    g = new Rune.Group();
  });

  describe("constructor", function() {

    it("should accept vector arguments", function() {
      var v1 = new Rune.Vector(10, 15);
      var v2 = new Rune.Vector(20, 25);
      var l1 = new Rune.Line(v1.x, v1.y, v2.x, v2.y);
      var l2 = new Rune.Line(v1, v2.x, v2.y);
      var l3 = new Rune.Line(v1, v2);
      expect(l1.vars.x).toEqual(l2.vars.x);
      expect(l2.vars.x).toEqual(l3.vars.x);
      expect(l1.vars.y).toEqual(l2.vars.y);
      expect(l2.vars.y).toEqual(l3.vars.y);
    });

  });

  describe("copy()", function() {
    it("has shared copy functionality", function() {
      expectCopy(s);
    });
  });

  describe("scale()", function() {

    it("scales the line", function() {
      spyOn(s, 'scaleStyleable');
      s.scale(2);
      expect(s.vars.x).toEqual(10);
      expect(s.vars.y).toEqual(15);
      expect(s.vars.x2).toEqual(30);
      expect(s.vars.y2).toEqual(35);
      expect(s.scaleStyleable).toHaveBeenCalledWith(2);
    });

  });

  describe("move()", function() {

    it("moves the absolute", function() {
      s.move(50, 60);
      expect(s.vars.x).toEqual(50);
      expect(s.vars.y).toEqual(60);
      expect(s.vars.x2).toEqual(60);
      expect(s.vars.y2).toEqual(70);
    });

    it("moves the relative", function() {
      s.move(10, 20, true);
      expect(s.vars.x).toEqual(20);
      expect(s.vars.y).toEqual(35);
      expect(s.vars.x2).toEqual(30);
      expect(s.vars.y2).toEqual(45);
    });

  });

});
