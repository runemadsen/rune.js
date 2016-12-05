describe("Rune.Rectangle", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Rectangle(10, 15, 300, 305);
    g = new Rune.Group();
  });

  describe("toPolygon()", function() {

    it("defaults to corner vectors", function() {
      var poly = s.toPolygon();
      expect(poly.state.x).toEqual(10);
      expect(poly.state.y).toEqual(15);
      expect(poly.state.vectors.length).toEqual(4);
      expect(poly.state.vectors[0]).toEqualVector(0, 0);
      expect(poly.state.vectors[1]).toEqualVector(300, 0);
      expect(poly.state.vectors[2]).toEqualVector(300, 305);
      expect(poly.state.vectors[3]).toEqualVector(0, 305);
    });

    it("returns polygon with even spaced vectors", function() {
      var poly = s.toPolygon({ spacing: 50 });
      expect(poly.state.x).toEqual(10);
      expect(poly.state.y).toEqual(15);
      expect(poly.state.vectors.length).toEqual(25);
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

  describe("round()", function() {

    it('sets uniform round corners', function() {
      s.round(25);
      expect(s.state.rx).toEqual(25);
      expect(s.state.ry).toEqual(25);
    });

    it('sets roundness for both x and y', function() {
      s.round(25, 15);
      expect(s.state.rx).toEqual(25);
      expect(s.state.ry).toEqual(15);
    });

  });

  describe("scale()", function() {

    it("scales the rectangle", function() {
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

      var r;
      beforeEach(function() {
        r = new Rune();
      });

      it("should render rectangle", function() {
        r.rect(100, 105, 300, 400);
        r.draw();
        var el = r.el.childNodes[0];
        expect(el.tagName).toEqual("rect");
        expect(el.getAttribute('x')).toEqual('100');
        expect(el.getAttribute('y')).toEqual('105');
        expect(el.getAttribute('width')).toEqual('300');
        expect(el.getAttribute('height')).toEqual('400');
        expect(el.getAttribute('rx')).toBeNull();
        expect(el.getAttribute('ry')).toBeNull();
        expect(el.getAttribute('transform')).toBeNull();
      });

      it("should render rounded corners", function() {
        r.rect(100, 105, 300, 400).round(25, 15);
        r.draw();
        var el = r.el.childNodes[0];
        expect(el.getAttribute('rx')).toEqual('25');
        expect(el.getAttribute('ry')).toEqual('15');
      });

  });

});
