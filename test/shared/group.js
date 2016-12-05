describe("Rune.Group", function() {

  describe("Group()", function() {

     it("should have optional x and y", function() {
      var g1 = new Rune.Group();
      expect(g1.state.x).toEqual(0);
      expect(g1.state.y).toEqual(0);

      var g2 = new Rune.Group(100, 101);
      expect(g2.state.x).toEqual(100);
      expect(g2.state.y).toEqual(101);
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

    it("removes child from former parent", function() {
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
      expect(stage.stagepos()).toEqual(new Rune.Vector(0, 0));
    });

    it("return absolute position if parent", function() {
      var stage = new Rune.Group();
      var child = new Rune.Group(100, 50);
      var grandchild = new Rune.Group(30, 15);
      stage.add(child);
      child.add(grandchild);
      expect(grandchild.stagepos()).toEqual(new Rune.Vector(130, 65));
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
      expect(g.state.x).toEqual(10);
      expect(g.state.y).toEqual(15);
      expect(childGroup.state.x).toEqual(40);
      expect(childGroup.state.y).toEqual(50);
      expect(childShape.state.x).toEqual(60);
      expect(childShape.state.y).toEqual(70);
      expect(childShape.state.radius).toEqual(80);
    });

  });

  describe("render()", function() {

    it("should render group", function() {
      var r = new Rune();
      var g = r.group(10, 15);
      var e = new Rune.Circle(10, 15, 100);
      g.add(e)
      r.draw();
      var el = r.el.childNodes[0];
      expect(el.tagName).toEqual("g");
      expect(el.getAttribute('transform')).toEqual('translate(10 15)');
      expect(el.childNodes[0].tagName).toEqual('circle');
    });

    it("should not render if empty", function() {
      var r = new Rune();
      var g = r.group(10, 15);
      r.draw();
      expect(r.el.childNodes.length).toEqual(0);
    });

    it("should rerender if child group changed", function() {
      var r = new Rune();
      var level1 = r.group(10, 15);
      var level2 = r.group(20, 25, level1);
      var shape = r.circle(10, 15, 100, level2);
      r.draw();
      shape.move(1, 2, true);
      r.draw();
      var el = r.el.childNodes[0].childNodes[0].childNodes[0];
      expect(el.tagName).toEqual("circle");
      expect(el.getAttribute('cx')).toEqual('11');
      expect(el.getAttribute('cy')).toEqual('17');
      expect(el.getAttribute('r')).toEqual('100')
    });

  });

});
