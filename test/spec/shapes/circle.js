describe("Rune.Circle", function() {

  var circle;
  var group;

  beforeEach(function() {
    circle = new Rune.Circle(10, 15, 300);
    group = new Rune.Group();
    group.add(circle);
  });

  describe("copy()", function() {

    it("copies the object", function() {
      var copy = circle.copy();
      expect(copy === circle).toEqual(false);
      expect(copy).toEqual(circle);
    });

    it("adds copy to original group", function() {
      expect(group.children.length).toEqual(1);
      circle.copy();
      expect(group.children.length).toEqual(2);
    });

    it("adds copy to specified group", function() {
      var group2 = new Rune.Group();
      expect(group.children.length).toEqual(1);
      circle.copy(group2);
      expect(group.children.length).toEqual(1);
      expect(group2.children.length).toEqual(1);
    });

    it("does not add to group", function() {
      var group2 = new Rune.Group();
      expect(group.children.length).toEqual(1);
      circle.copy(false);
      expect(group.children.length).toEqual(1);
    });

  });

});