describe("Rune.Gradient", function() {

  describe('Constructor', function() {

    it("defaults to linear gradient", function() {
      var grad = new Rune.Gradient();
      expect(grad.gradientType).toEqual('linear');
    });

    it('has default orientation', function() {
      var grad = new Rune.Gradient();
      expect(grad.gradientOrientation).toEqual([0, 0, 0, 1]);
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

  describe('orientation()', function() {

    it('sets the orientation', function() {
      var grad = new Rune.Gradient();
      grad.orientation(1, 0, 1, 0);
      expect(grad.gradientOrientation).toEqual([1, 0, 1, 0]);
    });

  });


});
