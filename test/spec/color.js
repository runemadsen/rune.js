describe("Rune.Color", function() {

  describe(".inputToColor", function() {

    it("works from hex", function() {
      var col1 = Rune.Color.inputToColor("#FF0000");
      var col2 = new Color().rgb(255, 0, 0);
      expect(col1).toEqual(col2);
    });

    it("works from hex alpha", function() {
      var col1 = Rune.Color.inputToColor("#FF0000", 0.5);
      var col2 = new Color().rgb(255, 0, 0).alpha(0.5);
      expect(col1).toEqual(col2);
    });

    it("works from rgb", function() {
      var col1 = Rune.Color.inputToColor(255, 0, 0);
      var col2 = new Color().rgb(255, 0, 0);
      expect(col1).toEqual(col2);
    });

    it("works from rgba", function() {
      var col1 = Rune.Color.inputToColor(255, 0, 0, 0.5);
      var col2 = new Color().rgb(255, 0, 0).alpha(0.5);
      expect(col1).toEqual(col2);
    });

    it("works from hsb", function() {
      var col1 = Rune.Color.inputToColor(Rune.HSB, 0, 100, 100);
      var col2 = new Color().rgb(255, 0, 0);
      expect(col1).toEqual(col2);
    });

    it("works from hsba", function() {
      var col1 = Rune.Color.inputToColor(Rune.HSB, 0, 100, 100, 0.5);
      var col2 = new Color().rgb(255, 0, 0).alpha(0.5);
      expect(col1).toEqual(col2);
    });

  });

});
