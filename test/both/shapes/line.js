describe("Rune.Line", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Line(10, 15, 20, 25);
    g = new Rune.Group();
  });

  describe("constructor", function() {

    it("should set variables", function() {
      var l = new Rune.Line(10, 15, 20, 25);
      expect(l.state.x).toEqual(10);
      expect(l.state.y).toEqual(15);
      expect(l.state.x2).toEqual(20);
      expect(l.state.y2).toEqual(25);
    });

  });

  describe("copy()", function() {
    it("has shared copy functionality", function() {
      expectCopy(s);
    });
  });

  describe("scale()", function() {

    it("scales the line", function() {
      spyOn(s, 'scaleStyles');
      s.scale(2);
      expect(s.state.x).toEqual(10);
      expect(s.state.y).toEqual(15);
      expect(s.state.x2).toEqual(30);
      expect(s.state.y2).toEqual(35);
      expect(s.scaleStyles).toHaveBeenCalledWith(2);
    });

  });

  describe('start()', function() {
    it('should set the start position of the line', function() {
      var l = new Rune.Line(10, 15, 20, 25);
      l.start(100, 150)
      expect(l.state.x).toEqual(100);
      expect(l.state.y).toEqual(150);
      expect(l.state.x2).toEqual(20);
      expect(l.state.y2).toEqual(25);
    });
  });

  describe('end()', function() {
    it('should set the end position of the line', function() {
      var l = new Rune.Line(10, 15, 20, 25);
      l.end(200, 250)
      expect(l.state.x).toEqual(10);
      expect(l.state.y).toEqual(15);
      expect(l.state.x2).toEqual(200);
      expect(l.state.y2).toEqual(250);
    });
  });

  describe("move()", function() {

    it("moves the absolute", function() {
      s.move(50, 60);
      expect(s.state.x).toEqual(50);
      expect(s.state.y).toEqual(60);
      expect(s.state.x2).toEqual(60);
      expect(s.state.y2).toEqual(70);
    });

    it("moves the relative", function() {
      s.move(10, 20, true);
      expect(s.state.x).toEqual(20);
      expect(s.state.y).toEqual(35);
      expect(s.state.x2).toEqual(30);
      expect(s.state.y2).toEqual(45);
    });

  });

});
