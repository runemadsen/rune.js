describe("Rune.Group", function() {

  describe("Group()", function() {

     it("should have optional x and y", function() {
      var g1 = new Rune.Group();
      expect(g1.vars.x).toEqual(0);
      expect(g1.vars.y).toEqual(0);

      var g2 = new Rune.Group(100, 101);
      expect(g2.vars.x).toEqual(100);
      expect(g2.vars.y).toEqual(101);
    });

  });

  describe("add()", function() {

    it("adds child to children and sets parent", function() {
      var g = new Rune.Group();
      var s = new Rune.Ellipse();
      expect(g.children.length).toBe(0);
      expect(s.parent).toBeUndefined();
      g.add(s);
      expect(g.children[0]).toBe(s);
      expect(s.parent).toBe(g);
    });

    it("removes child from parent", function() {
      var g1 = new Rune.Group();
      var g2 = new Rune.Group();
      var s = new Rune.Ellipse();
      g1.add(s);
      expect(s.parent).toBe(g1);
      expect(g1.children[0]).toBe(s);
      g2.add(s);
      expect(s.parent).toBe(g2);
      expect(g1.children.length).toBe(0);
      expect(g2.children[0]).toBe(s);
    });

  });

  describe("remove()", function() {

    it("removes child", function() {
      var g = new Rune.Group();
      var s = new Rune.Ellipse();
      g.add(s);
      g.remove(s);
      expect(s.parent).toBe(false);
      expect(g.children.length).toBe(0);
    })

  });

  describe("copy()", function() {

    it("copies the object", function() {
      var parent = new Rune.Group();
      var parentEllipse = new Rune.Circle(10, 15, 300);
      var child = new Rune.Group();
      var childEllipse = new Rune.Circle(10, 15, 300);
      setMixinVars(parent);
      setMixinVars(parentEllipse);
      setMixinVars(child);
      setMixinVars(childEllipse);
      parent.add(parentEllipse);
      parent.add(child)
      child.add(childEllipse);

      var copy = parent.copy();
      expect(copy === parent).toEqual(false);
      expect(copy.children[0] === parentEllipse).toEqual(false);
      expect(copy.children[1] === child).toEqual(false);
      expect(copy.children[1].children[0] === childEllipse).toEqual(false);
      expect(copy).toEqual(parent);
    });

    it("calls shapeCopy", function() {
      var parent = new Rune.Group();
      spyOn(parent, "shapeCopy");
      parent.copy();
      expect(parent.shapeCopy).toHaveBeenCalled();
    });

  });

});
