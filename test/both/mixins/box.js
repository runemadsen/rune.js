describe("Box", function() {

  var m;

  beforeEach(function() {
    m = newMixin(Rune.Box);
    m.changed = function(){};
    m.box();
  });

  describe("box()", function() {

    it("assigns default variables", function() {
      expect(typeof m.box).toEqual("function");
      expect(m.state.width).toEqual(0);
      expect(m.state.height).toEqual(0);
    });

    it("copies variables from object", function() {
      setBoxVars(m);
      var m2 = newMixin(Rune.Box);
      m2.box(m);
      expect(m2.state.width).toEqual(300);
      expect(m2.state.height).toEqual(305);
    });

  });

  describe("scaleBox()", function() {
    it("scales width and height", function() {
      m.state.width = 200;
      m.state.height = 300;
      m.scaleBox(3);
      expect(m.state.width).toEqual(600);
      expect(m.state.height).toEqual(900);
    });
  });

  describe("width()", function() {
    it("sets the width", function() {
      m.state.width = 200;
      m.width(100);
      expect(m.state.width).toEqual(100);
    });
  });

  describe("height()", function() {
    it("sets the height", function() {
      m.state.height = 200;
      m.height(100);
      expect(m.state.height).toEqual(100);
    });
  });

});
