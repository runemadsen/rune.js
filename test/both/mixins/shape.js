describe('Rune.Shape', function() {
  var m;
  var g;

  beforeEach(function() {
    g = new Rune.Group(50, 25);
    m = newMixin(Rune.Shape);
    m.shape();
  });

  describe('change tracking', function() {
    it('assigns and removes childId and changedChildren', function() {
      expect(g.changedChildren.length).toBe(0);
      g.add(m);
      expect(m.childId).toBe(0);
      expect(g.changedChildren[0]).toBe(0);
      g.remove(m);
      expect(m.childId).toBeFalsy();
      expect(g.changedChildren.length).toBe(0);
    });

    it('should assign parentNotified and changedChildren on changed()', function() {
      g.add(m);
      g.changedChildren = [];
      expect(m.parentNotified).toBe(true);
      m.parentNotified = false;
      m.changed();
      expect(m.parentNotified).toBe(true);
      expect(g.changedChildren[0]).toEqual(m.childId);
    });

    it('should clear parentNotified when group is rendered', function() {
      m.render = function() {};
      g.add(m);
      m.changed();
      g.render();
      expect(m.parentNotified).toBe(false);
    });
  });

  describe('moveable()', function() {
    it('assigns default variables', function() {
      expect(typeof m.shape).toEqual('function');
      expect(m.state.x).toEqual(0);
      expect(m.state.y).toEqual(0);
      expect(m.state.rotation).toEqual(0);
    });

    it('copies variables from object', function() {
      setShapeVars(m);
      var m2 = newMixin(Rune.Shape);
      m2.shape(m);
      expect(m2.state.x).toEqual(10);
      expect(m2.state.y).toEqual(15);
      expect(m2.state.rotation).toEqual(45);
    });

    it('copies negative values from object', function() {
      setShapeVars(m, {
        x: -10,
        y: -15,
        rotation: -20,
        rotationX: -25,
        rotationY: -30
      });
      var m2 = newMixin(Rune.Shape);
      m2.shape(m);
      expect(m2.state.x).toEqual(-10);
      expect(m2.state.y).toEqual(-15);
      expect(m2.state.rotation).toEqual(-20);
      expect(m2.state.rotationX).toEqual(-25);
      expect(m2.state.rotationY).toEqual(-30);
    });
  });

  describe('move()', function() {
    it('moves absolute', function() {
      setShapeVars(m);
      m.move(200, 205);
      expect(m.state.x).toEqual(200);
      expect(m.state.y).toEqual(205);
    });

    it('moves relative', function() {
      setShapeVars(m);
      m.move(200, 205, true);
      expect(m.state.x).toEqual(210);
      expect(m.state.y).toEqual(220);
    });

    it('is chainable', function() {
      var res = m.move(200, 205);
      expect(m).toEqual(res);
    });
  });

  describe('rotate()', function() {
    it('rotates on degree', function() {
      m.rotate(45);
      expect(m.state.rotation).toEqual(45);
      expect(m.state.rotationX).toEqual(0);
      expect(m.state.rotationY).toEqual(0);
    });

    it('rotates on degree and xy', function() {
      m.rotate(45, 100, 105);
      expect(m.state.rotation).toEqual(45);
      expect(m.state.rotationX).toEqual(100);
      expect(m.state.rotationY).toEqual(105);
    });

    it('rotates relative to own xy', function() {
      m.move(10, 15);
      m.rotate(45, 100, 105, true);
      expect(m.state.rotation).toEqual(45);
      expect(m.state.rotationX).toEqual(110);
      expect(m.state.rotationY).toEqual(120);
    });

    it('is chainable', function() {
      var res = m.rotate(45);
      expect(m).toEqual(res);
    });
  });

  describe('addTo()', function() {
    it('adds child to parent', function() {
      expect(m).not.toBeChildOf(g);
      m.addTo(g);
      expect(m).toBeChildOf(g);
    });
  });

  describe('removeParent()', function() {
    it('removes child from parent', function() {
      g.add(m);
      expect(m).toBeChildOf(g);
      m.removeParent();
      expect(m).not.toBeChildOf(g);
    });
  });

  describe('stagepos()', function() {
    it('returns relative position without parent', function() {
      m.move(10, 15);
      expect(m.stagepos()).toEqual(new Rune.Vector(10, 15));
    });

    it('returns absolute position with parent', function() {
      m.move(10, 15);
      g.add(m);
      expect(m.stagepos()).toEqual(new Rune.Vector(60, 40));
    });
  });
});
