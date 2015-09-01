import _ from 'underscore'
import Helpers from '../helpers'

describe("Rune.Path", function() {

  var g;
  var s;

  beforeEach(function() {
    g = new Rune.Group();
    s = new Rune.Path(10, 15)
      .lineTo(100, 100)
      .curveTo(100, 200, -100, 200, -100, 100)
      .curveTo(-100, 0, 0, 0)
      .moveTo(0, 25)
      .lineTo(75, 75)
      .lineTo(-75, 75)
      .closePath();
    g.add(s);
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
      Helpers.setAllAnchors(p);
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

  describe("startVector()", function() {
    it("should return 0,0 if first command is not move", function() {
      var p = new Rune.Path(10, 15).lineTo(100, 100);
      expect(p.startVector()).toEqualVector(0, 0);
    });

    it("should return move location if first command is move", function() {
      var p = new Rune.Path(10, 15).moveTo(100, 100);
      expect(p.startVector()).toEqualVector(100, 100);
    });
  });

  describe("length()", function() {
    it("should return length of all subpaths", function() {
      expect(s.length()).toEqual(912.9528291563602);
    });
  });

  describe("vectorAt()", function() {

    it("should return vector at scalar", function() {
      var res = s.vectorAt(0.5);
      expect(res).toEqualVector(-95.04748002984878, 60.44400406520909);
    });

    it("should return vector if scalar is 0", function() {
      var res = s.vectorAt(0);
      expect(res).toEqualVector(0, 0);
    });

    it("should return vector if scalar is 1", function() {
      var res = s.vectorAt(1);
      expect(res).toEqualVector(0, 0);
    });

  });

  describe("vectorAtLength()", function() {

    it("should return vector at length", function() {
      var res = s.vectorAtLength(70);
      expect(res).toEqualVector(49.49747468305832, 49.49747468305832);
    });

    it("should return vector if length is 0", function() {
      var res = s.vectorAtLength(0);
      expect(res).toEqualVector(0, 0);
    });

    it("should return vector if length is more length", function() {
      var res = s.vectorAtLength(999999);
      expect(res).toEqualVector(0, 0);
    });

  });

  describe("subpaths()", function() {

    it("returns subpaths separated by moveTo", function() {
      var paths = s.subpaths();

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

    it("returns subpaths separated by closeShape", function() {

      var triangles = new Rune.Path(10, 15)
        .lineTo(100, 100)
        .lineTo(0, 100)
        .closePath()
        .lineTo(-100, 100)
        .lineTo(0, 100)
        .closePath();

      var paths = triangles.subpaths();

      expect(paths.length).toEqual(2);
      var p1 = paths[0];
      var p2 = paths[1];

      expect(p1.vars.x).toEqual(10);
      expect(p1.vars.y).toEqual(15);
      expect(p1.vars.anchors.length).toEqual(4);
      expect(p1.vars.anchors[0]).toBeAnchorMove(0, 0);
      expect(p1.vars.anchors[1]).toBeAnchorLine(100, 100);
      expect(p1.vars.anchors[2]).toBeAnchorLine(0, 100);
      expect(p1.vars.anchors[3]).toBeAnchorClose();

      expect(p2.vars.x).toEqual(10);
      expect(p2.vars.y).toEqual(15);
      expect(p2.vars.anchors.length).toEqual(3);
      expect(p2.vars.anchors[0]).toBeAnchorLine(-100, 100);
      expect(p2.vars.anchors[1]).toBeAnchorLine(0, 100);
      expect(p2.vars.anchors[2]).toBeAnchorClose();
    });

    it("adds subpaths to parent", function() {
      expect(g.children.length).toEqual(1);
      s.subpaths();
      expect(g.children.length).toEqual(3);
    });

    it("does not add subpaths to parent", function() {
      expect(g.children.length).toEqual(1);
      s.subpaths(false);
      expect(g.children.length).toEqual(1);
    });

    it("copies the mixin vars", function() {
      Helpers.setMixinVars(s);
      var paths = s.subpaths();
      expect(Helpers.getMixinVars(paths[0])).toBeIn(Helpers.getMixinVars(s));
      expect(Helpers.getMixinVars(paths[1])).toBeIn(Helpers.getMixinVars(s));
    });


  });

  describe("toPolygons()", function() {

    it("should return array of polygons and vectors with spacing", function() {
      var res = s.toPolygons({ spacing: 25 });
      expect(res.length).toEqual(2);

      var poly1 = res[0];
      expect(poly1.vars.x).toEqual(10);
      expect(poly1.vars.y).toEqual(15);
      expect(poly1.vars.vectors.length).toEqual(24);

      var poly2 = res[1];
      expect(poly2.vars.x).toEqual(10);
      expect(poly2.vars.y).toEqual(15);
      expect(poly2.vars.vectors.length).toEqual(14);
    });

    it("adds polygon to parent", function() {
      expect(g.children.length).toEqual(1);
      s.toPolygons({ spacing: 25 });
      expect(g.children.length).toEqual(3);
    });

    it("does not add polygon to parent", function() {
      expect(g.children.length).toEqual(1);
      s.toPolygons({ spacing: 25 }, false);
      expect(g.children.length).toEqual(1);
    });

    it("copies the mixin vars", function() {
      Helpers.setMixinVars(s)
      var p = s.toPolygons({ spacing: 25 });
      expect(Helpers.getMixinVars(p)).toBeIn(Helpers.getMixinVars(s));
    });

  });

  describe("copy()", function() {

    it("copies the object", function() {
      Helpers.setMixinVars(s);
      Helpers.setAllAnchors(s);
      var copy = s.copy();
      expect(copy).not.toBe(s);
      expect(copy.vars.anchors).not.toBe(s.vars.anchors)
      expect(copy).toEqual(s);
    });

    it("adds copy to parent", function() {
      expect(g.children.length).toEqual(1);
      s.copy();
      expect(g.children.length).toEqual(2);
    });

    it("does not add copy to parent", function() {
      expect(g.children.length).toEqual(1);
      s.copy(false);
      expect(g.children.length).toEqual(1);
    });

  });

});
