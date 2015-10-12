describe("Utils", function() {

  describe("groupLogic()", function() {

    var child;
    var fallback;
    var group;

    beforeEach(function() {
      child = new Rune.Rectangle(10, 20, 30, 40);
      fallback = new Rune.Group();
      group = new Rune.Group();
    });

    it("should add to group", function() {
      Rune.groupLogic(child, fallback, group)
      expect(group.children[0]).toBe(child);
      expect(fallback.children.length).toEqual(0);
    });

    it("should add to fallback", function() {
      Rune.groupLogic(child, fallback)
      expect(group.children.length).toEqual(0);
      expect(fallback.children[0]).toBe(child);
    });

    it("should not add", function() {
      Rune.groupLogic(child, fallback, false)
      expect(group.children.length).toEqual(0);
      expect(fallback.children.length).toEqual(0);
    });

  });

  describe("random()", function() {

    it("works with only high", function() {
      var ran = Rune.random(500);
      expect(ran >= 0).toBe(true);
      expect(ran <= 500).toBe(true);
    });

    it("works with low and high", function() {
      var ran = Rune.random(500, 1000);
      expect(ran >= 500).toBe(true);
      expect(ran <= 1000).toBe(true);
    });

  });

});