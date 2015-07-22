function newModule(mixin) {
  return new _.extend(function(){}.prototype, mixin);
}

describe("Rune.Mixins", function() {

  var m;

  describe("Translatable", function() {

    beforeEach(function() {
      m = newModule(Rune.Mixins.Translatable);
    });

    it("creates variables", function() {
      expect(m.x).toEqual(0);
      expect(m.y).toEqual(0);
      expect(m.rotation).toEqual(0);
    });

  });

  describe("Sizeable", function() {

    beforeEach(function() {
      m = newModule(Rune.Mixins.Sizeable);
    });

    it("creates variables", function() {
      expect(m.width).toEqual(0);
      expect(m.height).toEqual(0);
    });

  });

  describe("Styleable", function() {

    beforeEach(function() {
      m = newModule(Rune.Mixins.Styleable);
    });

    it("creates variables", function() {
      expect(m.fillColor).toEqual(new Color());
      expect(m.strokeColor).toEqual(new Color());
    });

    it("fill()", function() {
      var res = m.fill("#ff0000");
      expect(m.fillColor).toEqual(new Color().rgb(255, 0, 0));
      expect(m).toEqual(res);

    });

  });

});
