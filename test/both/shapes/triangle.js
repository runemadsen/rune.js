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
      expect(t.state.x).toEqual(10);
      expect(t.state.y).toEqual(15);
      expect(t.state.x2).toEqual(10);
      expect(t.state.y2).toEqual(10);
      expect(t.state.x3).toEqual(20);
      expect(t.state.y3).toEqual(20);
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
      expect(s.state.x).toEqual(10);
      expect(s.state.y).toEqual(15);
      expect(s.state.x2).toEqual(20);
      expect(s.state.y2).toEqual(20);
      expect(s.state.x3).toEqual(40);
      expect(s.state.y3).toEqual(40);
      expect(s.scaleStyles).toHaveBeenCalledWith(2);
    });

  });

});
