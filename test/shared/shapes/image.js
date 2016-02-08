describe("Rune.Image", function() {

  var s;

  beforeEach(function() {
    s = new Rune.Image("myimage.jpg", 10, 15, 300, 400);
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
      spyOn(s, 'scaleSizeable');
      s.scale(2);
      expect(s.vars.x).toEqual(10);
      expect(s.vars.y).toEqual(15);
      expect(s.scaleSizeable).toHaveBeenCalledWith(2);
    });

  });



});
