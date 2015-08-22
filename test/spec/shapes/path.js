describe("Rune.Path", function() {

  var path;

  beforeEach(function() {
    path = new Rune.Path(10, 15)
      .lineTo(100, 100)
      .curveTo(100, 200, -100, 200, -100, 100)
      .curveTo(-100, 0, 0, 0)
      .moveTo(0, 25)
      .lineTo(75, 75)
      .lineTo(-75, 75)
      .closePath();
  });

  describe("Path()", function() {

    it("should have optional x and y", function() {
      var p1 = new Rune.Path();
      expect(p1.vars.x).toEqual(0);
      expect(p1.vars.y).toEqual(0);

      var p2 = new Rune.Path(100, 101);
      expect(p2.vars.x).toEqual(100);
      expect(p2.vars.y).toEqual(101);
    });

  });

  describe("anchors", function() {

    it("should create anchors", function() {
      var p = new Rune.Path();
      setAllAnchors(p);
      expect(p.vars.anchors[0]).toBeAnchorMove(0, 0);
      expect(p.vars.anchors[1]).toBeAnchorLine(104, 105);
      expect(p.vars.anchors[2]).toBeAnchorMove(106, 107);
      expect(p.vars.anchors[3]).toBeAnchorCubic(108, 109, 110, 111, 112, 113);
      expect(p.vars.anchors[4]).toBeAnchorQuad(114, 115, 116, 117);
    });

  });

  describe("Basic setters", function() {

    it("sets the var value", function() {
      var funcs = ["fillRule"]
      _.each(funcs, function(func) {
        var p = new Rune.Path();
        var res = p[func](5);
        expect(p.vars[func]).toEqual(5)
        expect(p).toEqual(res);
      });
    })

  });

  describe("length()", function() {
    it("should return length of all subpaths", function() {
      expect(path.length()).toEqual(0);
    });
  });

  describe("subpaths()", function() {

    it("should return subpath anchors in individual paths", function() {
      var paths = path.subpaths();

      expect(paths.length).toEqual(2);
      var p1 = paths[0];
      var p2 = paths[1];

      expect(p1.vars.x).toEqual(10);
      expect(p1.vars.y).toEqual(15);
      expect(p1.vars.anchors.length).toEqual(4);
      expect(p1.vars.anchors[0]).toBeAnchorMove(0, 0);
      expect(p1.vars.anchors[1]).toBeAnchorLine(100, 100);
      expect(p1.vars.anchors[2]).toBeAnchorCubic(100, 200, -100, 200, -100, 100);
      expect(p1.vars.anchors[3]).toBeAnchorQuad(-100, 0, 0, 0);

      expect(p2.vars.x).toEqual(10);
      expect(p2.vars.y).toEqual(15);
      expect(p2.vars.anchors.length).toEqual(4);
      expect(p2.vars.anchors[0]).toBeAnchorMove(0, 25);
      expect(p2.vars.anchors[1]).toBeAnchorLine(75, 75);
      expect(p2.vars.anchors[2]).toBeAnchorLine(-75, 75);
      expect(p2.vars.anchors[3]).toBeAnchorClose();
    });

    it("should copy path styles") // SHOULD ALREADY WORK

    it("should work with scene graph") // should already work
  });



  describe("toPolygons()", function() {

    it("should return array of polygons and vectors with spacing", function() {
      var res = path.toPolygons({ spacing: 25 });
      expect(res.length).toEqual(2);
      var poly1 = res[0]
      var poly2 = res[1]
      expect(poly1.x).toEqual(10);
      expect(poly1.y).toEqual(15);
      expect(poly2.x).toEqual(10);
      expect(poly2.y).toEqual(15);
      console.log(poly1.vars.anchors);
      console.log(poly2.vars.anchors);
    });

    // spacing
    // test moveTo after closePath....
    // test with and without closePath btw subpaths.... subpaths may be open or closed.

  });

  describe("copy()", function() {

    var s;
    var g;

    beforeEach(function() {
      s = new Rune.Path();
      g = new Rune.Group();
      g.add(s);
    });

    it("copies the object", function() {
      setMixinVars(s);
      setAllAnchors(s);
      var copy = s.copy();
      expect(copy === s).toEqual(false);
      expect(copy.vars.anchors === s.vars.anchors).toEqual(false);
      expect(copy).toEqual(s);
    });

    it("calls shapeCopy", function() {
      spyOn(s, "shapeCopy");
      s.copy(g);
      expect(s.shapeCopy).toHaveBeenCalled();
    });

  });

});
