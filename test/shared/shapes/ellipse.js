describe("Rune.Ellipse", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Ellipse(10, 15, 300, 305);
    g = new Rune.Group();
  });

  describe("toPolygon()", function() {

    it("converts to the correct size", function() {
      var bounds = s.toPolygon().bounds();
      expect(bounds.width).toEqual(300);
      expect(bounds.height).toEqual(305);
    });

    it("defaults to 16 vectors", function() {
      var poly = s.toPolygon();
      expect(poly.state.x).toEqual(10);
      expect(poly.state.y).toEqual(15);
      expect(poly.state.vectors.length).toEqual(16);
    });

    it("returns polygon with even spaced vectors", function() {
      var poly = s.toPolygon({ spacing: 50 });
      expect(poly.state.x).toEqual(10);
      expect(poly.state.y).toEqual(15);
      expect(poly.state.vectors.length).toEqual(39);
    });

    it("adds polygon to parent", function() {
      g.add(s);
      expect(g.children.length).toEqual(1);
      s.toPolygon();
      expect(g.children.length).toEqual(2);
    });

    it("does not add polygon to parent", function() {
      g.add(s);
      expect(g.children.length).toEqual(1);
      s.toPolygon({}, false);
      expect(g.children.length).toEqual(1);
    });

    it("copies the mixin state", function() {
      setMixinVars(s)
      var p = s.toPolygon();
      expect(getMixinVars(p)).toBeIn(getMixinVars(s));
    });

  });

  describe("copy()", function() {
    it("has shared copy functionality", function() {
      expectCopy(s);
    });
  });

  describe("scale()", function() {

    it("scales the ellipse", function() {
      spyOn(s, 'scaleBox');
      spyOn(s, 'scaleStyles');
      s.scale(2);
      expect(s.state.x).toEqual(10);
      expect(s.state.y).toEqual(15);
      expect(s.scaleBox).toHaveBeenCalledWith(2);
      expect(s.scaleStyles).toHaveBeenCalledWith(2);
    });

  });

  describe("render()", function() {

    it("should render ellipse", function() {
      var r = new Rune();
      var s = r.ellipse(100, 105, 300, 400);
      r.draw();
      var el = r.el.childNodes[0];
      expect(el.tagName).toEqual("ellipse");
      expect(el.getAttribute('cx')).toEqual('100')
      expect(el.getAttribute('cy')).toEqual('105')
      expect(el.getAttribute('rx')).toEqual('150')
      expect(el.getAttribute('ry')).toEqual('200')
      expect(el.getAttribute('transform')).toBeNull();
    });

  });

});
