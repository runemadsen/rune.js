describe("Rune.Line", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Line(10, 15, 20, 25);
    g = new Rune.Group();
  });

  describe("constructor", function() {

    it("should set variables", function() {
      var l = new Rune.Line(10, 15, 20, 25);
      expect(l.vars.x).toEqual(10);
      expect(l.vars.y).toEqual(15);
      expect(l.vars.x2).toEqual(20);
      expect(l.vars.y2).toEqual(25);
    });

  });

  describe("copy()", function() {
    it("has shared copy functionality", function() {
      expectCopy(s);
    });
  });

  describe("scale()", function() {

    it("scales the line", function() {
      spyOn(s, 'scaleStyles');
      s.scale(2);
      expect(s.vars.x).toEqual(10);
      expect(s.vars.y).toEqual(15);
      expect(s.vars.x2).toEqual(30);
      expect(s.vars.y2).toEqual(35);
      expect(s.scaleStyles).toHaveBeenCalledWith(2);
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
