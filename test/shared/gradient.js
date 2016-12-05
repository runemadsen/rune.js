describe("Rune.Gradient", function() {

  describe('Constructor', function() {

    it("defaults to linear gradient", function() {
      var grad = new Rune.Gradient();
      expect(grad.gradientType).toEqual('linear');
    });

    it("set the type from constructor", function() {
      var grad = new Rune.Gradient('radial');
      expect(grad.gradientType).toEqual('radial');
    });

  });

  describe('stop()', function() {

    it("adds a stop", function() {
      var col = new Rune.Color(255, 0, 0);
      var grad = new Rune.Gradient();
      grad.stop(col, 0.5);
      expect(grad.stops[0].color.rgb()).toEqual({
        r:255,
        g:0,
        b:0
      });
      expect(grad.stops[0].offset).toEqual(0.5);
    });

  });


});
