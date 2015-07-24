describe("Rune.Circle", function() {

  var circle;

  beforeEach(function() {
    circle = new Rune.Circle(10, 15, 300);
  });

  describe("copy()", function() {

    it("copies the object", function() {
      var copy = circle.copy();
      expect(copy === circle).toEqual(false);
      expect(copy).toEqual(circle);
    });

    // add to orgs parent

    // add to specified group

    // don't add

  });

});