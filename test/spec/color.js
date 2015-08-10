describe("Rune.Color", function() {

  // ADD ALL TESTS FROM COLOR.JS

  describe("constructor", function() {

    it("works from hex", function() {
      var col1 = new Rune.Color("#FF0000");
      expect(col1.rgb()).toEqual({
        r:255,
        g:0,
        b:0
      });
    });

    it("works from hex alpha", function() {
      var col1 = new Rune.Color("#FF0000", 0.5);
      expect(col1.rgb()).toEqual({
        r:255,
        g:0,
        b:0,
        a:0.5
      });
    });

    it("works from color", function() {
      var col1 = new Rune.Color("#FF0000");
      var col2 = new Rune.Color(col1);
      expect(col1).toEqual(col2);
    });

    it("works from grayscale", function() {
      var col1 = new Rune.Color(120);
      expect(col1.rgb()).toEqual({
        r:120,
        g:120,
        b:120
      });
    });

    it("works from grayscale alpha", function() {
      var col1 = new Rune.Color(120, 0.5);
      expect(col1.rgb()).toEqual({
        r:120,
        g:120,
        b:120,
        a:0.5
      });
    });

    it("works from rgb", function() {
      var col1 = new Rune.Color(255, 0, 0);
      expect(col1.rgb()).toEqual({
        r:255,
        g:0,
        b:0
      });
    });

    it("works from rgba", function() {
      var col1 = new Rune.Color(255, 0, 0, 0.5);
      expect(col1.rgb()).toEqual({
        r:255,
        g:0,
        b:0,
        a:0.5
      });
    });

    it("works from hsb", function() {
      var col1 = new Rune.Color('hsv', 0, 100, 100);
      expect(col1.rgb()).toEqual({
        r:255,
        g:0,
        b:0
      });
    });

    it("works from hsba", function() {
      var col1 = new Rune.Color('hsv', 0, 100, 100, 0.5);
      expect(col1.rgb()).toEqual({
        r:255,
        g:0,
        b:0,
        a:0.5
      });
    });

    it("wraps around hue", function() {
      var col1 = new Rune.Color('hsv', 480, 100, 100);
      expect(col1.rgb()).toEqual({
        r:0,
        g:255,
        b:0,
      });
    });

  });

});
