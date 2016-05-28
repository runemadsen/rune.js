describe("Rune.Image", function() {

  var s;

  beforeEach(function() {
    s = new Rune.Image("myimage.jpg", 10, 15, 300, 400);
  });

  describe("copy()", function() {
    it("has shared copy functionality", function() {
      expectCopy(s);
    });
  });

  describe("scale()", function() {

    it("scales the image", function() {
      spyOn(s, 'scaleBox');
      s.scale(2);
      expect(s.vars.x).toEqual(10);
      expect(s.vars.y).toEqual(15);
      expect(s.scaleBox).toHaveBeenCalledWith(2);
    });

  });



});
