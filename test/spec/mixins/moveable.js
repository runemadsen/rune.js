describe("Rune.Moveable", function() {

  var m;

  beforeEach(function() {
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

  });

  describe("move()", function() {

    it("moves absolute", function() {
      setMoveableVars(m);
      var res = m.move(200, 205);
      expect(m.vars.x).toEqual(200);
      expect(m.vars.y).toEqual(205);
      expect(m).toEqual(res);
    });

    it("moves relative", function() {
      setMoveableVars(m);
      var res = m.move(200, 205, true);
      expect(m.vars.x).toEqual(210);
      expect(m.vars.y).toEqual(220);
      expect(m).toEqual(res);
    });

  });

  describe("rotate()", function() {

    it("rotates on degree", function() {
      var res = m.rotate(45);
      expect(m.vars.rotation).toEqual(45);
      expect(m.vars.rotationX).toEqual(0);
      expect(m.vars.rotationY).toEqual(0);
      expect(m).toEqual(res);
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

  });

});