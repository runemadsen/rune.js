describe('Rune.Polygon', function() {
  var g;
  var s;

  beforeEach(function() {
    g = new Rune.Group(100, 50);
    s = new Rune.Polygon(10, 15)
      .lineTo(0, 0)
      .lineTo(60, 0)
      .lineTo(80, 60)
      .lineTo(20, 60);
  });

  describe('Polygon()', function() {
    it('should have optional x and y', function() {
      var p1 = new Rune.Polygon();
      expect(p1.state.x).toEqual(0);
      expect(p1.state.y).toEqual(0);

      var p2 = new Rune.Polygon(100, 101);
      expect(p2.state.x).toEqual(100);
      expect(p2.state.y).toEqual(101);
    });
  });

  describe('vectors', function() {
    it('should create vectors with start at 0,0', function() {
      var p = new Rune.Polygon()
        .lineTo(100, 101)
        .lineTo(200, 201)
        .lineTo(300, 301);
      expect(p.state.vectors[0]).toEqual(new Rune.Vector(100, 101));
      expect(p.state.vectors[1]).toEqual(new Rune.Vector(200, 201));
      expect(p.state.vectors[2]).toEqual(new Rune.Vector(300, 301));
    });
  });

  describe('centroid()', function() {
    it('should return internal centroid vector', function() {
      var vec = s.centroid();
      expect(vec).toEqual(new Rune.Vector(40, 30));
    });
  });

  describe('area()', function() {
    it('should return area of polygon', function() {
      var area = s.area();
      expect(area).toEqual(3600);
    });
  });

  describe('bounds()', function() {
    it('should return internal bounds', function() {
      expect(s.bounds()).toEqual({
        x: 0,
        y: 0,
        width: 80,
        height: 60
      });
    });

    it('should work with minus values', function() {
      var circle = new Rune.Polygon(10, 10)
        .lineTo(-100, -100)
        .lineTo(100, -100)
        .lineTo(100, 100)
        .lineTo(-100, 100);
      expect(circle.bounds()).toEqual({
        x: -100,
        y: -100,
        width: 200,
        height: 200
      });
    });
  });

  describe('length()', function() {
    it('should return length of polygon', function() {
      var res = s.length();
      expect(res).toEqual(246.49110640673518);
    });
  });

  describe('vectorAt()', function() {
    it('should return vector at scalar', function() {
      var res = s.vectorAt(0.5);
      expect(res).toEqual(new Rune.Vector(80, 60));
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
        new Rune.Vector(63.16227766016838, 9.486832980505138)
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

  describe('toPolygon()', function() {
    it('should return self if no segmentor', function() {
      var res = s.toPolygon();
      expect(res).toBe(res);
    });

    it('should return vectors with spacing', function() {
      var res = s.toPolygon({ spacing: 25 });
      expect(res.state.x).toEqual(10);
      expect(res.state.y).toEqual(15);
      expect(res.state.vectors.length).toEqual(10);
      expect(res.state.vectors[0]).toEqual(new Rune.Vector(0, 0));
      expect(res.state.vectors[1]).toEqual(new Rune.Vector(25, 0));
      expect(res.state.vectors[2]).toEqual(new Rune.Vector(50, 0));
      expect(res.state.vectors[3]).toEqual(
        new Rune.Vector(64.74341649025257, 14.230249470757707)
      );
      expect(res.state.vectors[4]).toEqual(
        new Rune.Vector(72.64911064067351, 37.94733192202055)
      );
      expect(res.state.vectors[5]).toEqual(
        new Rune.Vector(78.24555320336759, 60)
      );
      expect(res.state.vectors[6]).toEqual(
        new Rune.Vector(53.24555320336759, 60)
      );
      expect(res.state.vectors[7]).toEqual(
        new Rune.Vector(28.245553203367592, 60)
      );
      expect(res.state.vectors[8]).toEqual(
        new Rune.Vector(14.701778718652967, 44.1053361559589)
      );
      expect(res.state.vectors[9]).toEqual(
        new Rune.Vector(6.796084568232018, 20.388253704696055)
      );
    });

    it('adds polygon to parent', function() {
      g.add(s);
      expect(g.children.length).toEqual(1);
      s.toPolygon({ spacing: 25 });
      expect(g.children.length).toEqual(2);
    });

    it('does not add polygon to parent', function() {
      g.add(s);
      expect(g.children.length).toEqual(1);
      s.toPolygon({ spacing: 25 }, false);
      expect(g.children.length).toEqual(1);
    });

    it('copies the mixin state', function() {
      setMixinVars(s);
      var p = s.toPolygon({ spacing: 25 });
      expect(getMixinVars(p)).toBeIn(getMixinVars(s));
    });
  });

  describe('copy()', function() {
    it('has shared copy functionality', function() {
      expectCopy(s);
      var copy = s.copy();
      expect(copy.state.vectors).not.toBe(s.state.vectors);
    });
  });

  describe('contains()', function() {
    it('uses absolute stage position if parent', function() {
      g.add(s);
      expect(s.contains(50, 50)).toBe(false);
      expect(s.contains(120, 75)).toBe(true);
    });

    it('uses relative position if no parent', function() {
      expect(s.contains(5, 5)).toBe(false);
      expect(s.contains(20, 20)).toBe(true);
    });
  });

  describe('scale()', function() {
    it('scales the polygon', function() {
      spyOn(s, 'scaleStyles');
      s.scale(2);
      expect(s.state.x).toEqual(10);
      expect(s.state.y).toEqual(15);
      expect(s.state.vectors[0]).toEqual(new Rune.Vector(0, 0));
      expect(s.state.vectors[1]).toEqual(new Rune.Vector(120, 0));
      expect(s.state.vectors[2]).toEqual(new Rune.Vector(160, 120));
      expect(s.state.vectors[3]).toEqual(new Rune.Vector(40, 120));
      expect(s.scaleStyles).toHaveBeenCalledWith(2);
    });
  });
});
