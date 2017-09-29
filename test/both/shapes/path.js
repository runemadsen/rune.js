describe('Rune.Path', function() {
  var g;
  var s;

  beforeEach(function() {
    g = new Rune.Group();
    s = new Rune.Path(10, 15)
      .lineTo(100, 100)
      .curveTo(100, 200, -100, 200, -100, 100)
      .curveTo(-100, 0, 0, 0)
      .moveTo(0, 25)
      .lineTo(75, 75)
      .lineTo(-75, 75)
      .closePath();
  });

  describe('Path()', function() {
    it('should have optional x and y', function() {
      var p1 = new Rune.Path();
      expect(p1.state.x).toEqual(0);
      expect(p1.state.y).toEqual(0);

      var p2 = new Rune.Path(100, 101);
      expect(p2.state.x).toEqual(100);
      expect(p2.state.y).toEqual(101);
    });
  });

  describe('anchors', function() {
    it('should create anchors', function() {
      var p = new Rune.Path();
      setAllAnchors(p);
      expect(p.state.anchors[0]).toEqual(new Rune.Anchor().setMove(0, 0));
      expect(p.state.anchors[1]).toEqual(new Rune.Anchor().setLine(104, 105));
      expect(p.state.anchors[2]).toEqual(new Rune.Anchor().setMove(106, 107));
      expect(p.state.anchors[3]).toEqual(
        new Rune.Anchor().setCurve(108, 109, 110, 111, 112, 113)
      );
      expect(p.state.anchors[4]).toEqual(
        new Rune.Anchor().setCurve(114, 115, 116, 117)
      );
    });
  });

  describe('Basic setters', function() {
    it('sets the var value', function() {
      var funcs = ['fillRule'];
      funcs.forEach(function(func) {
        var p = new Rune.Path();
        var res = p[func](5);
        expect(p.state[func]).toEqual(5);
        expect(p).toEqual(res);
      });
    });
  });

  describe('startVector()', function() {
    it('should return 0,0 if first command is not move', function() {
      var p = new Rune.Path(10, 15).lineTo(100, 100);
      expect(p.startVector()).toEqual(new Rune.Vector(0, 0));
    });

    it('should return move location if first command is move', function() {
      var p = new Rune.Path(10, 15).moveTo(100, 100);
      expect(p.startVector()).toEqual(new Rune.Vector(100, 100));
    });
  });

  describe('length()', function() {
    it('should return length of all subpaths', function() {
      expect(s.length()).toEqual(912.9528291563602);
    });
  });

  describe('vectorAt()', function() {
    it('should return vector at scalar', function() {
      var res = s.vectorAt(0.5);
      expect(res).toEqual(
        new Rune.Vector(-95.04748002984878, 60.44400406520909)
      );
    });

    it('should return vector if scalar is 0', function() {
      var res = s.vectorAt(0);
      expect(res).toEqual(new Rune.Vector(0, 0));
    });

    it('should return vector if scalar is 1', function() {
      var res = s.vectorAt(1);
      expect(res).toEqual(new Rune.Vector(0, 0));
    });
  });

  describe('vectorAtLength()', function() {
    it('should return vector at length', function() {
      var res = s.vectorAtLength(70);
      expect(res).toEqual(
        new Rune.Vector(49.49747468305832, 49.49747468305832)
      );
    });

    it('should return vector if length is 0', function() {
      var res = s.vectorAtLength(0);
      expect(res).toEqual(new Rune.Vector(0, 0));
    });

    it('should return vector if length is more length', function() {
      var res = s.vectorAtLength(999999);
      expect(res).toEqual(new Rune.Vector(0, 0));
    });
  });

  describe('subpaths()', function() {
    it('returns subpaths separated by moveTo', function() {
      var paths = s.subpaths();

      expect(paths.length).toEqual(2);
      var p1 = paths[0];
      var p2 = paths[1];

      expect(p1.state.x).toEqual(10);
      expect(p1.state.y).toEqual(15);
      expect(p1.state.anchors.length).toEqual(4);
      expect(p1.state.anchors[0]).toEqual(new Rune.Anchor().setMove(0, 0));
      expect(p1.state.anchors[1]).toEqual(new Rune.Anchor().setLine(100, 100));
      expect(p1.state.anchors[2]).toEqual(
        new Rune.Anchor().setCurve(100, 200, -100, 200, -100, 100)
      );
      expect(p1.state.anchors[3]).toEqual(
        new Rune.Anchor().setCurve(-100, 0, 0, 0)
      );

      expect(p2.state.x).toEqual(10);
      expect(p2.state.y).toEqual(15);
      expect(p2.state.anchors.length).toEqual(4);
      expect(p2.state.anchors[0]).toEqual(new Rune.Anchor().setMove(0, 25));
      expect(p2.state.anchors[1]).toEqual(new Rune.Anchor().setLine(75, 75));
      expect(p2.state.anchors[2]).toEqual(new Rune.Anchor().setLine(-75, 75));
      expect(p2.state.anchors[3]).toEqual(new Rune.Anchor().setClose());
    });

    it('returns subpaths separated by closeShape', function() {
      var triangles = new Rune.Path(10, 15)
        .lineTo(100, 100)
        .lineTo(0, 100)
        .closePath()
        .lineTo(-100, 100)
        .lineTo(0, 100)
        .closePath();

      var paths = triangles.subpaths();

      expect(paths.length).toEqual(2);
      var p1 = paths[0];
      var p2 = paths[1];

      expect(p1.state.x).toEqual(10);
      expect(p1.state.y).toEqual(15);
      expect(p1.state.anchors.length).toEqual(4);
      expect(p1.state.anchors[0]).toEqual(new Rune.Anchor().setMove(0, 0));
      expect(p1.state.anchors[1]).toEqual(new Rune.Anchor().setLine(100, 100));
      expect(p1.state.anchors[2]).toEqual(new Rune.Anchor().setLine(0, 100));
      expect(p1.state.anchors[3]).toEqual(new Rune.Anchor().setClose());

      expect(p2.state.x).toEqual(10);
      expect(p2.state.y).toEqual(15);
      expect(p2.state.anchors.length).toEqual(3);
      expect(p2.state.anchors[0]).toEqual(new Rune.Anchor().setLine(-100, 100));
      expect(p2.state.anchors[1]).toEqual(new Rune.Anchor().setLine(0, 100));
      expect(p2.state.anchors[2]).toEqual(new Rune.Anchor().setClose());
    });

    it('adds subpaths to parent', function() {
      g.add(s);
      expect(g.children.length).toEqual(1);
      s.subpaths();
      expect(g.children.length).toEqual(3);
    });

    it('does not add subpaths to parent', function() {
      g.add(s);
      expect(g.children.length).toEqual(1);
      s.subpaths(false);
      expect(g.children.length).toEqual(1);
    });

    it('copies the mixin state', function() {
      setMixinVars(s);
      var paths = s.subpaths();
      expect(getMixinVars(paths[0])).toBeIn(getMixinVars(s));
      expect(getMixinVars(paths[1])).toBeIn(getMixinVars(s));
    });
  });

  describe('toPolygons()', function() {
    it('should return array of polygons and vectors with spacing', function() {
      var res = s.toPolygons({ spacing: 25 });
      expect(res.length).toEqual(2);

      var poly1 = res[0];
      expect(poly1.state.x).toEqual(10);
      expect(poly1.state.y).toEqual(15);
      expect(poly1.state.vectors.length).toEqual(24);

      var poly2 = res[1];
      expect(poly2.state.x).toEqual(10);
      expect(poly2.state.y).toEqual(15);
      expect(poly2.state.vectors.length).toEqual(14);
    });

    it('adds polygon to parent', function() {
      g.add(s);
      expect(g.children.length).toEqual(1);
      s.toPolygons({ spacing: 25 });
      expect(g.children.length).toEqual(3);
    });

    it('does not add polygon to parent', function() {
      g.add(s);
      expect(g.children.length).toEqual(1);
      s.toPolygons({ spacing: 25 }, false);
      expect(g.children.length).toEqual(1);
    });

    it('copies the mixin state', function() {
      setMixinVars(s);
      var p = s.toPolygons({ spacing: 25 });
      expect(getMixinVars(p)).toBeIn(getMixinVars(s));
    });
  });

  describe('copy()', function() {
    it('has shared copy functionality', function() {
      setAllAnchors(s);
      expectCopy(s);
      var copy = s.copy();
      expect(copy.state.anchors).not.toBe(s.state.anchors);
    });
  });

  describe('scale()', function() {
    it('scales the path', function() {
      var p = new Rune.Path(10, 15);
      spyOn(p, 'scaleStyles');
      setAllAnchors(p);
      p.scale(2);
      expect(p.state.x).toEqual(10);
      expect(p.state.y).toEqual(15);
      expect(p.state.anchors[0]).toEqual(new Rune.Anchor().setMove(0, 0));
      expect(p.state.anchors[1]).toEqual(new Rune.Anchor().setLine(208, 210));
      expect(p.state.anchors[2]).toEqual(new Rune.Anchor().setMove(212, 214));
      expect(p.state.anchors[3]).toEqual(
        new Rune.Anchor().setCurve(216, 218, 220, 222, 224, 226)
      );
      expect(p.state.anchors[4]).toEqual(
        new Rune.Anchor().setCurve(228, 230, 232, 234)
      );
      expect(p.scaleStyles).toHaveBeenCalledWith(2);
    });
  });
});
