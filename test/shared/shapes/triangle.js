describe("Rune.Triangle", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Triangle(10, 15, 20, 25, 30, 35);
    g = new Rune.Group();
  });

  describe("constructor", function() {

    it("should assign relative triangle points", function() {
      var t = new Rune.Triangle(10, 15, 20, 25, 30, 35);
      expect(t.vars.x).toEqual(10);
      expect(t.vars.y).toEqual(15);
      expect(t.vars.x2).toEqual(10);
      expect(t.vars.y2).toEqual(10);
      expect(t.vars.x3).toEqual(20);
      expect(t.vars.y3).toEqual(20);
    });

  });

  describe("copy()", function() {
    it("has shared copy functionality", function() {
      expectCopy(s);
    });
  });

  describe("scale()", function() {

    it("scales the rectangle", function() {
      spyOn(s, 'scaleStyles');
      s.scale(2);
      expect(s.vars.x).toEqual(10);
      expect(s.vars.y).toEqual(15);
      expect(s.vars.x2).toEqual(20);
      expect(s.vars.y2).toEqual(20);
      expect(s.vars.x3).toEqual(40);
      expect(s.vars.y3).toEqual(40);
      expect(s.scaleStyles).toHaveBeenCalledWith(2);
    });

  });

});
