describe("Rune.Vector", function() {
  var v1;
  var v2;

  beforeEach(function() {
    v1 = new Rune.Vector(10, 15);
    v2 = new Rune.Vector(20, 25);
  });

  describe("add()", function() {
    it("adds vectors", function() {
      var res = v1.add(v2);
      expect(res).toEqual(new Rune.Vector(30, 40));
      expect(res).not.toBe(v1);
    });
  });

  describe("sub()", function() {
    it("subtracts vectors", function() {
      var res = v1.sub(v2);
      expect(res).toEqual(new Rune.Vector(-10, -10));
      expect(res).not.toBe(v1);
    });
  });

  describe("multiply()", function() {
    it("multiplies vector", function() {
      var res = v1.multiply(3);
      expect(res).toEqual(new Rune.Vector(30, 45));
      expect(res).not.toBe(v1);
    });
  });

  describe("divide()", function() {
    it("divides vector", function() {
      var res = v1.divide(3);
      expect(res).toEqual(new Rune.Vector(10 / 3, 5));
      expect(res).not.toBe(v1);
    });
  });

  describe("distance()", function() {
    it("finds distance", function() {
      var res = v1.distance(v2);
      expect(res).toEqual(14.142135623730951);
    });
  });

  describe("lerp()", function() {
    it("finds lerp", function() {
      var res = v1.lerp(v2, 0.5);
      expect(res).toEqual(new Rune.Vector(15, 20));
      expect(res).not.toBe(v1);
    });
  });

  describe("dot()", function() {
    it("finds dot product", function() {
      var res = v1.dot(v2);
      expect(res).toEqual(575);
    });
  });

  describe("length()", function() {
    it("finds length", function() {
      var res = v1.length();
      expect(res).toEqual(18.027756377319946);
    });
  });

  describe("normalize()", function() {
    it("normalizes vector", function() {
      var res = v1.normalize();
      expect(res).toEqual(
        new Rune.Vector(0.5547001962252291, 0.8320502943378437)
      );
      expect(res).not.toBe(v1);
    });
  });

  describe("rotation()", function() {
    it("finds rotation of vector", function() {
      var res = v1.rotation();
      expect(res).toBe(56.309932474020215);
    });
  });

  describe("rotate()", function() {
    it("rotates vector", function() {
      var res = v1.rotate(90);
      expect(res).toEqual(new Rune.Vector(-15, 10));
      expect(res).not.toBe(v1);
    });
  });

  describe("copy()", function() {
    it("creates a new vector", function() {
      var v3 = v1.copy();
      expect(v1).toEqual(v3);
      expect(v3).not.toBe(v1);
    });
  });

  describe("limit()", function() {
    it("limits vector", function() {
      var res = new Rune.Vector(10, 10).limit(5);
      expect(res).toEqual(
        new Rune.Vector(3.5355339059327373, 3.5355339059327373)
      );
      expect(res).not.toBe(v1);
    });
  });
});
