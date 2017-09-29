describe('Rune.Group', function() {
  describe('Group()', function() {
    it('should have optional x and y', function() {
      var g1 = new Rune.Group();
      expect(g1.state.x).toEqual(0);
      expect(g1.state.y).toEqual(0);

      var g2 = new Rune.Group(100, 101);
      expect(g2.state.x).toEqual(100);
      expect(g2.state.y).toEqual(101);
    });
  });

  describe('add()', function() {
    it('adds child to children and sets parent', function() {
      var g = new Rune.Group();
      var s = new Rune.Ellipse();
      expect(s).not.toBeChildOf(g);
      g.add(s);
      expect(s).toBeChildOf(g);
    });

    it('removes child from former parent', function() {
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

  describe('remove()', function() {
    it('removes child', function() {
      var g = new Rune.Group();
      var s = new Rune.Ellipse();
      g.add(s);
      g.remove(s);
      expect(s).not.toBeChildOf(g);
    });

    it('does not remove child that is not in the group', function() {
      var g = new Rune.Group();
      var s1 = new Rune.Ellipse();
      var s2 = new Rune.Rectangle();
      g.add(s1);
      g.remove(s2);
      expect(s1).toBeChildOf(g);
      expect(s2).not.toBeChildOf(g);
    });
  });

  describe('copy()', function() {
    var parent;
    var child;

    beforeEach(function() {
      parent = new Rune.Group();
      child = new Rune.Group();
      parent.add(child);
    });

    it('copies the object', function() {
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

    it('adds copy to parent', function() {
      var copy = child.copy();
      expect(copy).toBeChildOf(parent);
    });

    it('does not add copy to parent', function() {
      var copy = child.copy(false);
      expect(copy).not.toBeChildOf(parent);
    });
  });

  describe('stagepos()', function() {
    it('returns absolute position if stage', function() {
      var stage = new Rune.Group();
      expect(stage.stagepos()).toEqual(new Rune.Vector(0, 0));
    });

    it('return absolute position if parent', function() {
      var stage = new Rune.Group();
      var child = new Rune.Group(100, 50);
      var grandchild = new Rune.Group(30, 15);
      stage.add(child);
      child.add(grandchild);
      expect(grandchild.stagepos()).toEqual(new Rune.Vector(130, 65));
    });
  });

  describe('scale()', function() {
    it('scales children groups and shapes', function() {
      var g = new Rune.Group(10, 15);
      var childGroup = new Rune.Group(20, 25);
      var childShape = new Rune.Circle(30, 35, 40);
      g.add(childGroup);
      g.add(childShape);
      g.scale(2);
      expect(g.state.x).toEqual(10);
      expect(g.state.y).toEqual(15);
      expect(childGroup.state.x).toEqual(40);
      expect(childGroup.state.y).toEqual(50);
      expect(childShape.state.x).toEqual(60);
      expect(childShape.state.y).toEqual(70);
      expect(childShape.state.radius).toEqual(80);
    });
  });
});
