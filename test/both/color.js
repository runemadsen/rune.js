describe("Rune.Color", function() {
  var col;

  beforeEach(function() {
    col = new Rune.Color("hsv", 0, 100, 100);
  });

  describe("constructor", function() {
    it("works from hex", function() {
      var col1 = new Rune.Color("#FF0000");
      expect(col1.rgb()).toEqual({
        r: 255,
        g: 0,
        b: 0
      });
    });

    it("works from rgb string", function() {
      var col1 = new Rune.Color("rgb(255, 0, 0)");
      expect(col1.rgb()).toEqual({
        r: 255,
        g: 0,
        b: 0
      });
    });

    it("works from rgba string", function() {
      var col1 = new Rune.Color("rgba(255, 0, 0, 0.5)");
      expect(col1.rgb()).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 0.5
      });
    });

    it("works from hex alpha", function() {
      var col1 = new Rune.Color("#FF0000", 0.5);
      expect(col1.rgb()).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 0.5
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
        r: 120,
        g: 120,
        b: 120
      });
    });

    it("works from grayscale alpha", function() {
      var col1 = new Rune.Color(120, 0.5);
      expect(col1.rgb()).toEqual({
        r: 120,
        g: 120,
        b: 120,
        a: 0.5
      });
    });

    it("works from rgb", function() {
      var col1 = new Rune.Color(255, 0, 0);
      expect(col1.rgb()).toEqual({
        r: 255,
        g: 0,
        b: 0
      });
    });

    it("works from rgba", function() {
      var col1 = new Rune.Color(255, 0, 0, 0.5);
      expect(col1.rgb()).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 0.5
      });
    });

    it("works from hsb", function() {
      var col1 = new Rune.Color("hsv", 0, 100, 100);
      expect(col1.rgb()).toEqual({
        r: 255,
        g: 0,
        b: 0
      });
    });

    it("works from hsba", function() {
      var col1 = new Rune.Color("hsv", 0, 100, 100, 0.5);
      expect(col1.rgb()).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 0.5
      });
    });

    it("wraps around hue", function() {
      var col1 = new Rune.Color("hsv", 480, 100, 100);
      expect(col1.rgb()).toEqual({
        r: 0,
        g: 255,
        b: 0
      });
    });
  });

  describe("getters", function() {
    it("returns objects", function() {
      expect(col.rgb()).toEqual({ r: 255, g: 0, b: 0 });
      expect(col.hsv()).toEqual({ h: 0, s: 100, v: 100 });
      expect(col.hsl()).toEqual({ h: 0, s: 100, l: 50 });
      expect(col.hwb()).toEqual({ h: 0, w: 0, b: 0 });
      expect(col.cmyk()).toEqual({ c: 0, m: 100, y: 100, k: 0 });
    });

    it("returns arrays", function() {
      expect(col.rgbArray()).toEqual([255, 0, 0]);
      expect(col.hsvArray()).toEqual([0, 100, 100]);
      expect(col.hslArray()).toEqual([0, 100, 50]);
      expect(col.hwbArray()).toEqual([0, 0, 0]);
      expect(col.cmykArray()).toEqual([0, 100, 100, 0]);
    });
  });

  describe("manipulation", function() {
    it("negate()", function() {
      expect(col.negate().hsv()).toEqual({ h: 180, s: 100, v: 100 });
    });

    it("lighten()", function() {
      expect(col.lighten(0.5).hsv()).toEqual({ h: 0, s: 50, v: 100 });
    });

    it("darken()", function() {
      expect(col.darken(0.5).hsv()).toEqual({ h: 0, s: 100, v: 50 });
    });

    it("saturate()", function() {
      expect(col.saturate(0.5).hsv()).toEqual({ h: 0, s: 100, v: 100 });
    });

    it("desaturate()", function() {
      expect(col.desaturate(0.5).hsv()).toEqual({ h: 0, s: 67, v: 75 });
    });

    it("greyscale()", function() {
      expect(col.greyscale().hsv()).toEqual({ h: 0, s: 0, v: 30 });
    });

    it("whiten()", function() {
      expect(col.whiten(0.5).hsv()).toEqual({ h: 0, s: 100, v: 100 });
    });

    it("blacken()", function() {
      expect(col.blacken(0.5).hsv()).toEqual({ h: 0, s: 100, v: 100 });
    });

    it("clearer()", function() {
      expect(col.clearer(0.5).hsv()).toEqual({ h: 0, s: 100, v: 100, a: 0.5 });
    });

    it("opaquer()", function() {
      expect(col.opaquer(0.5).hsv()).toEqual({ h: 0, s: 100, v: 100 });
    });

    it("rotate()", function() {
      expect(col.rotate(180).hsv()).toEqual({ h: 180, s: 100, v: 100 });
    });

    it("rotate()", function() {
      expect(col.rotate(-90).hsv()).toEqual({ h: 270, s: 100, v: 100 });
    });

    it("mix()", function() {
      expect(col.mix(new Rune.Color("#FFFF00")).hsv()).toEqual({
        h: 30,
        s: 100,
        v: 100
      });
    });
  });
});
