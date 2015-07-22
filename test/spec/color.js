describe("Rune.Color", function() {

  describe(".inputToColor", function() {

    it("works from hex", function() {
      var col1 = Rune.Color.inputToColor("#FF0000");
      var col2 = new Color().rgb(255, 0, 0);
      expect(col1).toEqual(col2);
    });

    it("works from rgb", function() {
      var col1 = Rune.Color.inputToColor(255, 0, 0);
      var col2 = new Color().rgb(255, 0, 0);
      expect(col1).toEqual(col2);
    });

    it("works from hsb", function() {
      var col1 = Rune.Color.inputToColor(Rune.HSB, 0, 100, 100);
      var col2 = new Color().rgb(255, 0, 0);
      expect(col1).toEqual(col2);
    });

  });

});
