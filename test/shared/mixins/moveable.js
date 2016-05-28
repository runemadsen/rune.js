describe("Rune.Moveable", function() {

  var m;
  var g;

  beforeEach(function() {
    g = new Rune.Group(50, 25);
    m = newMixin(Rune.Moveable);
    m.moveable();
  });

  describe("moveable()", function() {

    it("assigns default variables", function() {
      expect(typeof m.moveable).toEqual("function");
      expect(m.vars.x).toEqual(0);
      expect(m.vars.y).toEqual(0);
      expect(m.vars.rotation).toEqual(0);
    });

    it("copies variables from object", function() {
      setMoveableVars(m);
      var m2 = newMixin(Rune.Moveable);
      m2.moveable(m);
      expect(m2.vars.x).toEqual(10);
      expect(m2.vars.y).toEqual(15);
      expect(m2.vars.rotation).toEqual(45);
    });

    it("copies negative values from object", function() {
      setMoveableVars(m, {
        x:-10,
        y:-15,
        rotation:-20,
        rotationX:-25,
        rotationY:-30
      });
      var m2 = newMixin(Rune.Moveable);
      m2.moveable(m);
      expect(m2.vars.x).toEqual(-10);
      expect(m2.vars.y).toEqual(-15);
      expect(m2.vars.rotation).toEqual(-20);
      expect(m2.vars.rotationX).toEqual(-25);
      expect(m2.vars.rotationY).toEqual(-30);
    });

  });

  describe('changed()', function() {

    it('should set parentNotified and add to parents changedChildren array', function() {
      g.add(m);
      g.changedChildren = [];
      expect(m.parentNotified).toBe(true);
      m.parentNotified = false;
      m.changed();
      expect(g.changedChildren[0]).toEqual(m.childId);
      expect(m.parentNotified).toBe(true);
    });

    it('should not set parentNotified if no parent', function() {
      expect(m.parentNotified).toBeFalsy();
      m.changed();
      expect(m.parentNotified).toBeFalsy();
    });

  });

  describe("move()", function() {

    it("moves absolute", function() {
      setMoveableVars(m);
      m.move(200, 205);
      expect(m.vars.x).toEqual(200);
      expect(m.vars.y).toEqual(205);
    });

    it("moves relative", function() {
      setMoveableVars(m);
      m.move(200, 205, true);
      expect(m.vars.x).toEqual(210);
      expect(m.vars.y).toEqual(220);
    });

    it("is chainable", function() {
      var res = m.move(200, 205);
      expect(m).toEqual(res);
    });

  });

  describe("rotate()", function() {

    it("rotates on degree", function() {
      m.rotate(45);
      expect(m.vars.rotation).toEqual(45);
      expect(m.vars.rotationX).toEqual(0);
      expect(m.vars.rotationY).toEqual(0);
    });

    it("rotates on degree and xy", function() {
      m.rotate(45, 100, 105);
      expect(m.vars.rotation).toEqual(45);
      expect(m.vars.rotationX).toEqual(100);
      expect(m.vars.rotationY).toEqual(105);
    });

    it("rotates relative to own xy", function() {
      m.move(10, 15)
      m.rotate(45, 100, 105, true);
      expect(m.vars.rotation).toEqual(45);
      expect(m.vars.rotationX).toEqual(110);
      expect(m.vars.rotationY).toEqual(120);
    });

    it("is chainable", function() {
      var res = m.rotate(45);
      expect(m).toEqual(res);
    });

  });

  describe("addParent()", function() {

    it("adds child to parent", function() {
      expect(m).not.toBeChildOf(g);
      m.addParent(g);
      expect(m).toBeChildOf(g);
    });

  });

  describe("removeParent()", function() {

    it("removes child from parent", function() {
      g.add(m);
      expect(m).toBeChildOf(g);
      m.removeParent();
      expect(m).not.toBeChildOf(g);
    });

  });

  describe("stagepos()", function() {

    it("returns relative position without parent", function() {
      m.move(10, 15);
      expect(m.stagepos()).toEqualVector(10, 15);
    });

    it("returns absolute position with parent", function() {
      m.move(10, 15);
      g.add(m);
      expect(m.stagepos()).toEqualVector(60, 40);
    });

  });

});
