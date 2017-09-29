describe('Rune.Rectangle', function() {
  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Rectangle(10, 15, 300, 305);
    g = new Rune.Group();
  });

  describe('toPolygon()', function() {
    it('defaults to corner vectors', function() {
      var poly = s.toPolygon();
      expect(poly.state.x).toEqual(10);
      expect(poly.state.y).toEqual(15);
      expect(poly.state.vectors.length).toEqual(4);
      expect(poly.state.vectors[0]).toEqual(new Rune.Vector(0, 0));
      expect(poly.state.vectors[1]).toEqual(new Rune.Vector(300, 0));
      expect(poly.state.vectors[2]).toEqual(new Rune.Vector(300, 305));
      expect(poly.state.vectors[3]).toEqual(new Rune.Vector(0, 305));
    });

    it('returns polygon with even spaced vectors', function() {
      var poly = s.toPolygon({ spacing: 50 });
      expect(poly.state.x).toEqual(10);
      expect(poly.state.y).toEqual(15);
      expect(poly.state.vectors.length).toEqual(25);
    });

    it('adds polygon to parent', function() {
      g.add(s);
      expect(g.children.length).toEqual(1);
      s.toPolygon();
      expect(g.children.length).toEqual(2);
    });

    it('does not add polygon to parent', function() {
      g.add(s);
      expect(g.children.length).toEqual(1);
      s.toPolygon({}, false);
      expect(g.children.length).toEqual(1);
    });

    it('copies the mixin state', function() {
      setMixinVars(s);
      var p = s.toPolygon();
      expect(getMixinVars(p)).toBeIn(getMixinVars(s));
    });
  });

  describe('copy()', function() {
    it('has shared copy functionality', function() {
      expectCopy(s);
    });
  });

  describe('round()', function() {
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

  describe('scale()', function() {
    it('scales the rectangle', function() {
      spyOn(s, 'scaleBox');
      spyOn(s, 'scaleStyles');
      s.scale(2);
      expect(s.state.x).toEqual(10);
      expect(s.state.y).toEqual(15);
      expect(s.scaleBox).toHaveBeenCalledWith(2);
      expect(s.scaleStyles).toHaveBeenCalledWith(2);
    });
  });
});
