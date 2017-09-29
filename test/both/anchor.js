describe('Rune.Anchor', function() {
  var a1;
  var v1;

  beforeEach(function() {
    a1 = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305);
    v1 = new Rune.Vector(10, 15);
  });

  describe('add()', function() {
    it('adds vector to anchor vectors', function() {
      var res = a1.add(v1);
      expect(res).toEqual(
        new Rune.Anchor().setCurve(110, 120, 210, 220, 310, 320)
      );
      expect(res).not.toBe(a1);
    });
  });

  describe('sub()', function() {
    it('subtracts vectors', function() {
      var res = a1.sub(v1);
      expect(res).toEqual(
        new Rune.Anchor().setCurve(90, 90, 190, 190, 290, 290)
      );
      expect(res).not.toBe(a1);
    });
  });

  describe('multiply()', function() {
    it('multiplies vectors', function() {
      var res = a1.multiply(2);
      expect(res).toEqual(
        new Rune.Anchor().setCurve(200, 210, 400, 410, 600, 610)
      );
      expect(res).not.toBe(a1);
    });
  });

  describe('copy()', function() {
    it('copies the anchor', function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305);
      var b = a.copy();
      expect(a).toEqual(b);
      expect(a === b).toBe(false);
      expect(a.vec1 === b.vec1).toBe(false);
      expect(a.vec2 === b.vec2).toBe(false);
      expect(a.vec3 === b.vec3).toBe(false);
    });
  });

  describe('setMove()', function() {
    it('creates move', function() {
      var a = new Rune.Anchor().setMove(100, 105);
      expect(a.command).toEqual('move');
      expect(a.vec1).toEqual(new Rune.Vector(100, 105));
      expect(a.vec2).toBeFalsy();
      expect(a.vec3).toBeFalsy();
    });
  });

  describe('setLine()', function() {
    it('creates line', function() {
      var a = new Rune.Anchor().setLine(100, 105);
      expect(a.command).toEqual('line');
      expect(a.vec1).toEqual(new Rune.Vector(100, 105));
      expect(a.vec2).toBeFalsy();
      expect(a.vec3).toBeFalsy();
    });
  });

  describe('setCurve()', function() {
    it('creates quad', function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205);
      expect(a.command).toEqual('quad');
      expect(a.vec1).toEqual(new Rune.Vector(100, 105));
      expect(a.vec2).toEqual(new Rune.Vector(200, 205));
      expect(a.vec3).toBeFalsy();
    });

    it('creates cubic', function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305);
      expect(a.command).toEqual('cubic');
      expect(a.vec1).toEqual(new Rune.Vector(100, 105));
      expect(a.vec2).toEqual(new Rune.Vector(200, 205));
      expect(a.vec3).toEqual(new Rune.Vector(300, 305));
    });
  });

  describe('setClose()', function() {
    it('creates close', function() {
      var a = new Rune.Anchor().setClose();
      expect(a.command).toEqual('close');
      expect(a.vec1).toBeFalsy();
      expect(a.vec2).toBeFalsy();
      expect(a.vec3).toBeFalsy();
    });
  });

  describe('vectorAt()', function() {
    it('throws error for move', function() {
      var a = new Rune.Anchor().setMove(0, 0);
      expect(function() {
        a.vectorAt(0.5);
      }).toThrow(new Error('Cannot compute vectorAt for this type of anchor'));
    });

    it('returns vector for line', function() {
      var a = new Rune.Anchor().setLine(100, 100);
      expect(a.vectorAt(0.5)).toEqual(new Rune.Vector(50, 50));
    });

    it('returns vector for cubic bezier', function() {
      var a = new Rune.Anchor().setCurve(0, 100, 100, 100, 100, 0);
      expect(a.vectorAt(0.5)).toEqual(new Rune.Vector(50, 75));
    });

    it('returns vector for quad bezier', function() {
      var a = new Rune.Anchor().setCurve(50, 100, 100, 0);
      expect(a.vectorAt(0.5)).toEqual(new Rune.Vector(50, 50));
    });
  });

  describe('length()', function() {
    it('returns length for move', function() {
      var a = new Rune.Anchor().setMove(0, 0);
      expect(a.length()).toEqual(0);
    });

    it('returns length for line', function() {
      var a = new Rune.Anchor().setLine(100, 100);
      expect(a.length()).toEqual(141.4213562373095);
    });

    it('returns length for cubic bezier', function() {
      var a = new Rune.Anchor().setCurve(0, 100, 100, 100, 100, 0);
      expect(a.length()).toEqual(200);
    });

    it('returns length for quad bezier', function() {
      var a = new Rune.Anchor().setCurve(50, 100, 100, 0);
      expect(a.length()).toEqual(147.89428575453212);
    });
  });
});
