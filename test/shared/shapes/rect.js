describe("Rune.Rectangle", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Rectangle(10, 15, 300, 305);
    g = new Rune.Group();
  });

  describe("toPolygon()", function() {

    it("defaults to corner vectors", function() {
      var poly = s.toPolygon();
      expect(poly.state.x).toEqual(10);
      expect(poly.state.y).toEqual(15);
      expect(poly.state.vectors.length).toEqual(4);
      expect(poly.state.vectors[0]).toEqual(new Rune.Vector(0, 0));
      expect(poly.state.vectors[1]).toEqual(new Rune.Vector(300, 0));
      expect(poly.state.vectors[2]).toEqual(new Rune.Vector(300, 305));
      expect(poly.state.vectors[3]).toEqual(new Rune.Vector(0, 305));
    });

    it("returns polygon with even spaced vectors", function() {
      var poly = s.toPolygon({ spacing: 50 });
      expect(poly.state.x).toEqual(10);
      expect(poly.state.y).toEqual(15);
      expect(poly.state.vectors.length).toEqual(25);
    });

    it("adds polygon to parent", function() {
      g.add(s);
      expect(g.children.length).toEqual(1);
      s.toPolygon();
      expect(g.children.length).toEqual(2);
    });

    it("does not add polygon to parent", function() {
      g.add(s);
      expect(g.children.length).toEqual(1);
      s.toPolygon({}, false);
      expect(g.children.length).toEqual(1);
    });

    it("copies the mixin state", function() {
      setMixinVars(s)
      var p = s.toPolygon();
      expect(getMixinVars(p)).toBeIn(getMixinVars(s));
    });

  });

  describe("copy()", function() {
    it("has shared copy functionality", function() {
      expectCopy(s);
    });
  });

  describe("round()", function() {

    it('sets uniform round corners', function() {
      s.round(25);
      expect(s.state.rx).toEqual(25);
      expect(s.state.ry).toEqual(25);
    });

    it('sets roundness for both x and y', function() {
      s.round(25, 15);
      expect(s.state.rx).toEqual(25);
      expect(s.state.ry).toEqual(15);
    });

  });

  describe("scale()", function() {

    it("scales the rectangle", function() {
      spyOn(s, 'scaleBox');
      spyOn(s, 'scaleStyles');
      s.scale(2);
      expect(s.state.x).toEqual(10);
      expect(s.state.y).toEqual(15);
      expect(s.scaleBox).toHaveBeenCalledWith(2);
      expect(s.scaleStyles).toHaveBeenCalledWith(2);
    });

  });

  describe("render()", function() {

    var r;
    beforeEach(function() {
      r = new Rune();
    });

    it("should render rectangle", function() {
      r.rect(100, 105, 300, 400);
      r.draw();
      var el = r.el.childNodes[0];
      expect(el.tagName).toEqual("rect");
      expect(el.getAttribute('x')).toEqual('100');
      expect(el.getAttribute('y')).toEqual('105');
      expect(el.getAttribute('width')).toEqual('300');
      expect(el.getAttribute('height')).toEqual('400');
      expect(el.getAttribute('rx')).toBeNull();
      expect(el.getAttribute('ry')).toBeNull();
      expect(el.getAttribute('transform')).toBeNull();
    });

    it("should render rounded corners", function() {
      r.rect(100, 105, 300, 400).round(25, 15);
      r.draw();
      var el = r.el.childNodes[0];
      expect(el.getAttribute('rx')).toEqual('25');
      expect(el.getAttribute('ry')).toEqual('15');
    });

  });

  describe('Shared render()', function() {

    var r;
    beforeEach(function() {
      r = new Rune();
    });

    // SHARED TESTS BABY!
    // These functions test rendering across all shapes with the rect as example.
    // All other shapes just make sure that the mixin rendering functions are called.

    it('renders styles', function() {
      r.rect(0, 0, 100, 100)
        .rotate(45, 100, 105)
        .fill(255, 0, 0, 0.5)
        .stroke(0, 255, 0, 0.6)
        .strokeWidth(5)
        .strokeCap('round')
        .strokeJoin('miter')
        .strokeMiterlimit(7)
        .strokeDash("3,4,5")
        .strokeDashOffset(10);
      r.draw();
      var el = r.el.childNodes[0];
      expect(el.getAttribute('fill')).toEqual("rgb(255, 0, 0)");
      expect(el.getAttribute('fill-opacity')).toEqual("0.5")
      expect(el.getAttribute('stroke')).toEqual("rgb(0, 255, 0)");
      expect(el.getAttribute('stroke-opacity')).toEqual("0.6")
      expect(el.getAttribute('stroke-width')).toEqual("5");
      expect(el.getAttribute('stroke-linecap')).toEqual("round");
      expect(el.getAttribute('stroke-linejoin')).toEqual("miter");
      expect(el.getAttribute('stroke-miterlimit')).toEqual("7");
      expect(el.getAttribute('stroke-dasharray')).toEqual("3,4,5");
      expect(el.getAttribute('stroke-dashoffset')).toEqual("10");
    })

    it("renders rotation", function() {
      r.rect(0, 0, 0, 0).rotate(45);
      r.draw();
      var el = r.el.childNodes[0];
      expect(el.getAttribute('transform')).toEqual('rotate(45)');
    });

    it("renders rotation around x and y", function() {
      r.rect(0, 0, 0, 0).rotate(45, 0, 10);
      r.draw();
      var el = r.el.childNodes[0];
      expect(el.getAttribute('transform')).toEqual('rotate(45 0 10)');
    });

    it("should render false values correctly", function() {
      r.rect(0, 0, 0, 0)
        .fill(false)
        .stroke(false)
        .strokeWidth(false)
        .strokeCap(false)
        .strokeJoin(false)
        .strokeMiterlimit(false)
        .strokeDash(false)
        .strokeDashOffset(false)
      r.draw();
      var el = r.el.childNodes[0];
      expect(el.getAttribute('fill')).toEqual("none")
      expect(el.getAttribute('stroke')).toEqual("none")
      expect(el.getAttribute('stroke-width')).toBeNull();
      expect(el.getAttribute('stroke-linecap')).toBeNull();
      expect(el.getAttribute('stroke-linejoin')).toBeNull();
      expect(el.getAttribute('stroke-miterlimit')).toBeNull();
      expect(el.getAttribute('stroke-dasharray')).toBeNull();
      expect(el.getAttribute('stroke-dashoffset')).toBeNull();
    });

    // it('should renders gradients', function() {
    //   var gradient = new Rune.Gradient();
    //   gradient.stop(new Rune.Color(255, 0, 0), 0);
    //   gradient.stop(new Rune.Color(0, 255, 0), 1);
    //   r.rect(0, 0, 0, 0).fill(gradient);
    //   r.draw();
    //   var defs = r.el.childNodes[0];
    //   var rect = r.el.childNodes[1];
    //   expect(defs.tagName).toEqual('defs');
    //   expect(rect.getAttribute('fill')).toEqual('url(#gradient)')
    // });

  })

});
