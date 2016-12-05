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
      expect(s.state.x).toEqual(10);
      expect(s.state.y).toEqual(15);
      expect(s.scaleBox).toHaveBeenCalledWith(2);
    });

  });

  describe("render()", function() {

    it("should render image", function() {
      var r = new Rune();
      r.image("myimage.jpg", 10, 15);
      r.draw();
      var el = r.el.childNodes[0];
      expect(el.tagName).toEqual("image");
      expect(el.getAttribute('x')).toEqual('10');
      expect(el.getAttribute('y')).toEqual('15');
      expect(el.getAttributeNS("http://www.w3.org/1999/xlink", "href")).toEqual("myimage.jpg")
      expect(el.getAttribute('width')).toBeNull();
      expect(el.getAttribute('height')).toBeNull();
      expect(el.getAttribute('transform')).toBeNull();
    });

    it("should render width and height if set", function() {
      var r = new Rune();
      r.image("myimage.jpg", 10, 15, 300, 400);
      r.draw();
      var el = r.el.childNodes[0];
      expect(el.getAttribute('width')).toEqual('300');
      expect(el.getAttribute('height')).toEqual('400');
    });

  });

});
