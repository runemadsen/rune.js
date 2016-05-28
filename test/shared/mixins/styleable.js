describe("Rune.Styleable", function() {

  var m;

  beforeEach(function() {
    m = newMixin(Rune.Moveable, Rune.Styleable);
    m.styleable();
  });

  describe("styleable()", function() {

    it("assigns default variable", function() {
      expect(typeof m.styleable).toEqual("function");
      expect(m.vars.fill.rgbArray()).toEqual([128, 128, 128]);
      expect(m.vars.stroke.rgbArray()).toEqual([0, 0, 0]);
    });

    it("copies variables from object", function() {
      setStyleableVars(m);
      var copy = newMixin(Rune.Styleable);
      copy.styleable(m);
      expect(copy.vars.fill).toEqual(m.vars.fill);
      expect(copy.vars.stroke).toEqual(m.vars.stroke);
      expect(copy.vars.strokeWidth).toEqual(m.vars.strokeWidth);
      expect(copy.vars.strokeCap).toEqual(m.vars.strokeCap);
      expect(copy.vars.strokeJoin).toEqual(m.vars.strokeJoin);
      expect(copy.vars.strokeMiterlimit).toEqual(m.vars.strokeMiterlimit);
      expect(copy.vars.strokeDash).toEqual(m.vars.strokeDash);
      expect(copy.vars.strokeDashOffset).toEqual(m.vars.strokeDashOffset);
    });

    it("copies false variables from object", function() {
      m.fill(false);
      m.stroke(false);
      var m2 = newMixin(Rune.Styleable);
      m2.styleable(m);
      expect(m2.vars.fill).toBe(false);
      expect(m2.vars.stroke).toBe(false);
    });

    it("copies zero colors", function() {
      var m2 = newMixin(Rune.Styleable);
      m2.styleable(m);
      expect(m2.vars.fill).toEqual(m.vars.fill);
      expect(m2.vars.stroke).toEqual(m.vars.stroke);
    });

  });

  describe("fill()", function() {

    it("sets fill to color", function() {
      var res = m.fill("#ff0000");
      expect(m.vars.fill.rgbArray()).toEqual([255, 0, 0]);
      expect(m).toEqual(res);
    });

    it("sets fill to false", function() {
      m.fill(false);
      expect(m.vars.fill).toEqual(false);
    });

  });

  describe("stroke()", function() {

    it("sets stroke to color", function() {
      var res = m.stroke("#ff0000");
      expect(m.vars.stroke.rgbArray()).toEqual([255, 0, 0]);
      expect(m).toEqual(res);
    });

    it("sets stroke to false", function() {
      m.stroke(false);
      expect(m.vars.stroke).toEqual(false);
    });

  });

  describe("Basic setters", function() {

    it("sets the var value", function() {
      var funcs = ["strokeWidth", "strokeCap", "strokeJoin", "strokeMiterlimit", "strokeDash", "strokeDashOffset"]
      _.each(funcs, function(func) {
        var res = m[func](5);
        expect(m.vars[func]).toEqual(5)
        expect(m).toEqual(res);
      });
    })

  });

  describe("scaleStyleable()", function() {

    it("scales default strokeWidth", function() {
      m.scaleStyleable(3);
      expect(m.vars.strokeWidth).toEqual(3);
    });

    it("scales a specific strokeWidth", function() {
      m.vars.strokeWidth = 4;
      m.scaleStyleable(3);
      expect(m.vars.strokeWidth).toEqual(12);
    })

  });

});
