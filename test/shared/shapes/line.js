describe("Rune.Line", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Line(10, 15, 20, 25);
    g = new Rune.Group();
    g.add(s);
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

    it("copies the object", function() {
      setMixinVars(s);
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

    // it("moves the relative", function() {
    //   s.move(10, 20, true);
    //   expect(s.vars.x).toEqual(10);
    //   expect(s.vars.y).toEqual(15);
    //   expect(s.vars.x2).toEqual(30);
    //   expect(s.vars.y2).toEqual(35);
    //   expect(s.scaleStyleable).toHaveBeenCalledWith(2);
    // });

  });

});
