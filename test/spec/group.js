import Helpers from './helpers'

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

    it("removes child from parent", function() {
      var g1 = new Rune.Group();
      var g2 = new Rune.Group();
      var s = new Rune.Ellipse();
      g1.add(s);
      expect(s).toBeChildOf(g1);
      g2.add(s);
      expect(s).toBeChildOf(g2);
      expect(s).not.toBeChildOf(g1);
    });

  });

  describe("remove()", function() {

    it("removes child", function() {
      var g = new Rune.Group();
      var s = new Rune.Ellipse();
      g.add(s);
      g.remove(s);
      expect(s).not.toBeChildOf(g);
    })

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
      Helpers.setMixinVars(parent);
      Helpers.setMixinVars(parentEllipse);
      Helpers.setMixinVars(child);
      Helpers.setMixinVars(childEllipse);
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

});
