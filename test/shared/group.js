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
      expect(s).not.toBeChildOf(g);
      g.add(s);
      expect(s).toBeChildOf(g);
    });

    it("removes child from parent former parent", function() {
      var g1 = new Rune.Group();
      var g2 = new Rune.Group();
      var s = new Rune.Ellipse();
      g1.add(s);
      expect(s).toBeChildOf(g1);
      g2.add(s);
      expect(s).toBeChildOf(g2);
      expect(s).not.toBeChildOf(g1);
    });

    it('assigns childID to child and adds to changed', function() {
      var g = new Rune.Group();
      var s = new Rune.Ellipse();
      var s2 = new Rune.Ellipse();
      g.add(s);
      g.add(s2);
      expect(s.childId).toBe(0);
      expect(s2.childId).toBe(1);
    });

  });

  describe("remove()", function() {

    it("removes child and childId", function() {
      var g = new Rune.Group();
      var s = new Rune.Ellipse();
      g.add(s);
      g.remove(s);
      expect(s).not.toBeChildOf(g);
      expect(s.childId).toBeFalsy();
    });

  });

  describe("copy()", function() {

    var parent;
    var child;

    beforeEach(function() {
      parent = new Rune.Group();
      child = new Rune.Group();
      parent.add(child)
    });

    it("copies the object", function() {
      var parentEllipse = new Rune.Circle(10, 15, 300);
      var childEllipse = new Rune.Circle(10, 15, 300);
      setMixinVars(parent);
      setMixinVars(parentEllipse);
      setMixinVars(child);
      setMixinVars(childEllipse);
      parent.add(parentEllipse);
      child.add(childEllipse);

      var copy = parent.copy();
      expect(copy).toEqual(parent);
      expect(copy).not.toBe(parent);
    });

    it("adds copy to parent", function() {
      var copy = child.copy();
      expect(copy).toBeChildOf(parent);
    });

    it("does not add copy to parent", function() {
      var copy = child.copy(false);
      expect(copy).not.toBeChildOf(parent);
    });

  });

  describe("stagepos()", function() {

    it("returns absolute position if stage", function() {
      var stage = new Rune.Group();
      expect(stage.stagepos()).toEqualVector(0, 0);
    });

    it("return absolute position if parent", function() {
      var stage = new Rune.Group();
      var child = new Rune.Group(100, 50);
      var grandchild = new Rune.Group(30, 15);
      stage.add(child);
      child.add(grandchild);
      expect(grandchild.stagepos()).toEqualVector(130, 65);
    });

  });

  describe("scale()", function() {

    it("scales children groups and shapes", function() {
      var g = new Rune.Group(10, 15);
      var childGroup = new Rune.Group(20, 25);
      var childShape = new Rune.Circle(30, 35, 40);
      g.add(childGroup);
      g.add(childShape);
      g.scale(2);
      expect(g.vars.x).toEqual(10);
      expect(g.vars.y).toEqual(15);
      expect(childGroup.vars.x).toEqual(40);
      expect(childGroup.vars.y).toEqual(50);
      expect(childShape.vars.x).toEqual(60);
      expect(childShape.vars.y).toEqual(70);
      expect(childShape.vars.radius).toEqual(80);
    });

  });

});
