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

  describe("round()", function(){
    it("correctly rounds down", function(){
      expect(Rune.round(1.000004, 5)).toEqual(1);
      expect(Rune.round(1.00001, 4)).toEqual(1);
    });

    it("correctly rounds up", function(){
      expect(Rune.round(1.005, 2)).toEqual(1.01);
      expect(Rune.round(1.95, 1)).toEqual(2);
    });

    it("returns the same value when no rounding is required", function(){
      expect(Rune.round(1.045, 3)).toEqual(1.045);
      expect(Rune.round(1.95, 3)).toEqual(1.95);
    });

    it("only accepts integers for decimal places argument", function(){
      expect( isNaN(Rune.round(8.2442, 7.1)) ).toBe(true);
      expect( isNaN(Rune.round(8.2442, 2)) ).toBe(false);
      expect( isNaN(Rune.round(8.2442, null)) ).toBe(true);
    });
  });

  describe("map()", function() {
    
    it("returns scaled value", function() {
      expect(Rune.map(1, 0, 10, 0, 20)).toEqual(2);
    });

  });

});