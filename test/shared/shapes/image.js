describe("Rune.Image", function() {

  var s;
  var sdim;

  beforeEach(function() {
    s = new Rune.Image("myimage.jpg", 10, 15);
    sdim = new Rune.Image("myimage.jpg", 10, 15, 300, 400);
  });

  describe("copy()", function() {

    var g;

    beforeEach(function() {
      g = new Rune.Group();
      g.add(s);
    });

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

    it("scales the image", function() {
      sdim.scale(2);
      expect(sdim.vars.x).toEqual(10);
      expect(sdim.vars.y).toEqual(15);
      expect(sdim.vars.width).toEqual(600);
      expect(sdim.vars.height).toEqual(800);
    });

  });



});
