describe("Rune.Anchor", function() {

  var a1;
  var v1;

  beforeEach(function() {
    a1 = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305);
    v1 = new Rune.Vector(10, 15);
  });

  describe("add()", function() {
    it("adds vector to anchor vectors", function() {
      var res = a1.add(v1);
      expect(res).toBeAnchorCubic(110, 120, 210, 220, 310, 320);
      expect(res).not.toBe(a1);
    });
  });

  describe("sub()", function() {
    it("subtracts vectors", function() {
      var res = a1.sub(v1);
      expect(res).toBeAnchorCubic(90, 90, 190, 190, 290, 290);
      expect(res).not.toBe(a1);
    });
  });

  describe("copy()", function() {

    it("copies the anchor", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305);
      var b = a.copy();
      expect(a).toEqual(b);
      expect(a === b).toBe(false);
      expect(a.vec1 === b.vec1).toBe(false);
      expect(a.vec2 === b.vec2).toBe(false);
      expect(a.vec3 === b.vec3).toBe(false);
    });

  });

  describe("setMove()", function() {

    it("creates move", function() {
      var a = new Rune.Anchor().setMove(100, 105);
      expect(a).toBeAnchorMove(100, 105);
    });

  });

  describe("setLine()", function() {

    it("creates line", function() {
      var a = new Rune.Anchor().setLine(100, 105);
      expect(a).toBeAnchorLine(100, 105);
    });

  });

  describe("setCurve()", function() {

    it("creates cubic", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305);
      expect(a).toBeAnchorCubic(100, 105, 200, 205, 300, 305);
    });

    it("creates quad", function() {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205);
      expect(a).toBeAnchorQuad(100, 105, 200, 205);
    });

  });

  describe("setClose()", function() {

    it("creates close", function() {
      var a = new Rune.Anchor().setClose();
      expect(a).toBeAnchorClose();
    });

  });

  describe("vectorAt()", function() {

    it("throws error for move", function() {
      var a = new Rune.Anchor().setMove(0, 0);
      expect(function() { a.vectorAt(0.5) }).toThrow(new Error("Cannot compute vectorAt for this type of anchor"));
    });

    it("returns vector for line", function() {
      var a = new Rune.Anchor().setLine(100, 100);
      expect(a.vectorAt(0.5)).toEqualVector(50, 50);
    });

    it("returns vector for cubic bezier", function() {
      var a = new Rune.Anchor().setCurve(0, 100, 100, 100, 100, 0);
      expect(a.vectorAt(0.5)).toEqualVector(50, 75);
    });

    it("returns vector for quad bezier", function() {
      var a = new Rune.Anchor().setCurve(50, 100, 100, 0);
      expect(a.vectorAt(0.5)).toEqualVector(50, 50);
    });

  });

  describe("length()", function() {

    it("returns length for move", function() {
      var a = new Rune.Anchor().setMove(0, 0);
      expect(a.length()).toEqual(0);
    });

    it("returns length for line", function() {
      var a = new Rune.Anchor().setLine(100, 100);
      expect(a.length()).toEqual(141.4213562373095);
    });

    it("returns length for cubic bezier", function() {
      var a = new Rune.Anchor().setCurve(0, 100, 100, 100, 100, 0);
      expect(a.length()).toEqual(200);
    });

    it("returns length for quad bezier", function() {
      var a = new Rune.Anchor().setCurve(50, 100, 100, 0);
      expect(a.length()).toEqual(147.89428575453212);
    });

  });

});

describe("Rune.Color", function() {

  // ADD ALL TESTS FROM COLOR.JS

  describe("constructor", function() {

    it("works from hex", function() {
      var col1 = new Rune.Color("#FF0000");
      expect(col1.rgb()).toEqual({
        r:255,
        g:0,
        b:0
      });
    });

    it("works from hex alpha", function() {
      var col1 = new Rune.Color("#FF0000", 0.5);
      expect(col1.rgb()).toEqual({
        r:255,
        g:0,
        b:0,
        a:0.5
      });
    });

    it("works from color", function() {
      var col1 = new Rune.Color("#FF0000");
      var col2 = new Rune.Color(col1);
      expect(col1).toEqual(col2);
    });

    it("works from grayscale", function() {
      var col1 = new Rune.Color(120);
      expect(col1.rgb()).toEqual({
        r:120,
        g:120,
        b:120
      });
    });

    it("works from grayscale alpha", function() {
      var col1 = new Rune.Color(120, 0.5);
      expect(col1.rgb()).toEqual({
        r:120,
        g:120,
        b:120,
        a:0.5
      });
    });

    it("works from rgb", function() {
      var col1 = new Rune.Color(255, 0, 0);
      expect(col1.rgb()).toEqual({
        r:255,
        g:0,
        b:0
      });
    });

    it("works from rgba", function() {
      var col1 = new Rune.Color(255, 0, 0, 0.5);
      expect(col1.rgb()).toEqual({
        r:255,
        g:0,
        b:0,
        a:0.5
      });
    });

    it("works from hsb", function() {
      var col1 = new Rune.Color('hsv', 0, 100, 100);
      expect(col1.rgb()).toEqual({
        r:255,
        g:0,
        b:0
      });
    });

    it("works from hsba", function() {
      var col1 = new Rune.Color('hsv', 0, 100, 100, 0.5);
      expect(col1.rgb()).toEqual({
        r:255,
        g:0,
        b:0,
        a:0.5
      });
    });

    it("wraps around hue", function() {
      var col1 = new Rune.Color('hsv', 480, 100, 100);
      expect(col1.rgb()).toEqual({
        r:0,
        g:255,
        b:0,
      });
    });

  });

});

describe("Rune.Grid", function() {

  // you can add it to the stage via r.grid()

  describe("constructor", function() {

    it("has default settings", function() {
      var grid = new Rune.Grid();
      expect(grid.vars.x).toEqual(0);
      expect(grid.vars.y).toEqual(0);
      expect(grid.vars.gutterX).toEqual(0);
      expect(grid.vars.gutterY).toEqual(0);
      expect(grid.vars.columns).toEqual(10);
      expect(grid.vars.rows).toEqual(1);
      expect(grid.vars.moduleWidth).toEqual(50);
      expect(grid.vars.moduleHeight).toEqual(500);
      expect(grid.vars.width).toEqual(500);
      expect(grid.vars.height).toEqual(500);
    });

    it("works with all variables", function() {
      var grid = new Rune.Grid({
        gutterX: 15,
        gutterY: 20,
        moduleWidth: 50,
        moduleHeight: 40,
        columns: 10,
        rows: 5
      });

      expect(grid.vars.x).toEqual(0);
      expect(grid.vars.y).toEqual(0);
      expect(grid.vars.gutterX).toEqual(15);
      expect(grid.vars.gutterY).toEqual(20);
      expect(grid.vars.columns).toEqual(10);
      expect(grid.vars.rows).toEqual(5);
      expect(grid.vars.moduleWidth).toEqual(50);
      expect(grid.vars.moduleHeight).toEqual(40);
      expect(grid.vars.width).toEqual(635);
      expect(grid.vars.height).toEqual(280);

      expect(grid.modules.length).toBe(10);
      expect(grid.modules[0].length).toBe(5);
      expect(grid.modules[0][0].type).toEqual("group");
      expect(grid.modules[0][0].vars.x).toEqual(0);
      expect(grid.modules[0][0].vars.y).toEqual(0);
      expect(grid.modules[2][2].type).toEqual("group");
      expect(grid.modules[2][2].vars.x).toEqual(130);
      expect(grid.modules[2][2].vars.y).toEqual(120);
    });

    it("works with gutter shorthand", function() {
      var grid = new Rune.Grid({
        gutter: 15,
        width: 600,
        height: 500,
        columns: 10,
        rows: 5
      });
      expect(grid.vars.x).toEqual(0);
      expect(grid.vars.y).toEqual(0);
      expect(grid.vars.gutterX).toEqual(15);
      expect(grid.vars.gutterY).toEqual(15);
      expect(grid.vars.columns).toEqual(10);
      expect(grid.vars.rows).toEqual(5);
      expect(grid.vars.moduleWidth).toEqual(46.5);
      expect(grid.vars.moduleHeight).toEqual(88);
      expect(grid.vars.width).toEqual(600);
      expect(grid.vars.height).toEqual(500);
    });

    it("works with no gutter", function() {
      var grid = new Rune.Grid({
        width: 600,
        height: 500,
        columns: 10,
        rows: 5
      });
      expect(grid.vars.x).toEqual(0);
      expect(grid.vars.y).toEqual(0);
      expect(grid.vars.gutterX).toEqual(0);
      expect(grid.vars.gutterY).toEqual(0);
      expect(grid.vars.columns).toEqual(10);
      expect(grid.vars.rows).toEqual(5);
      expect(grid.vars.moduleWidth).toEqual(60);
      expect(grid.vars.moduleHeight).toEqual(100);
      expect(grid.vars.width).toEqual(600);
      expect(grid.vars.height).toEqual(500);
    });

  });

  describe("add()", function() {

    it("adds child to module and sets parent", function() {
      var g = new Rune.Grid({columns:10, rows:10});
      var s = new Rune.Ellipse();
      expect(g.modules[1][2].children.length).toBe(0);
      expect(s.parent).toBeUndefined();
      g.add(s, 2, 3);
      expect(g.modules[1][2].children[0]).toBe(s);
      expect(s.parent).toBe(g.modules[1][2]);
    });

    it("removes child from parent", function() {
      var group = new Rune.Group({columns:10, rows:10});
      var grid = new Rune.Grid({columns:10, rows:10});
      var s = new Rune.Ellipse();
      group.add(s);
      expect(s.parent).toBe(group);
      expect(group.children[0]).toBe(s);
      grid.add(s, 2, 3);
      expect(s.parent).toBe(grid.modules[1][2]);
      expect(group.children.length).toBe(0);
      expect(grid.modules[1][2].children[0]).toBe(s);
    });

  });

  // copy

  // you can add object into the modules
  // add(object, col, row)

  // TODO: you can change the grid dimensions to have all objects move
  // but if you added an object and moved it, it's going to move it
  // relative to the new position.

});

describe("Rune.Group", function() {

  describe("Group()", function() {

     it("should have optional x and y", function() {
      var g1 = new Rune.Group();
      expect(g1.vars.x).toEqual(0);
      expect(g1.vars.y).toEqual(0);

      var g2 = new Rune.Group(100, 101);
      expect(g2.vars.x).toEqual(100);
      expect(g2.vars.y).toEqual(101);
    });

  });

  describe("add()", function() {

    it("adds child to children and sets parent", function() {
      var g = new Rune.Group();
      var s = new Rune.Ellipse();
      expect(g.children.length).toBe(0);
      expect(s.parent).toBeUndefined();
      g.add(s);
      expect(g.children[0]).toBe(s);
      expect(s.parent).toBe(g);
    });

    it("removes child from parent", function() {
      var g1 = new Rune.Group();
      var g2 = new Rune.Group();
      var s = new Rune.Ellipse();
      g1.add(s);
      expect(s.parent).toBe(g1);
      expect(g1.children[0]).toBe(s);
      g2.add(s);
      expect(s.parent).toBe(g2);
      expect(g1.children.length).toBe(0);
      expect(g2.children[0]).toBe(s);
    });

  });

  describe("remove()", function() {

    it("removes child", function() {
      var g = new Rune.Group();
      var s = new Rune.Ellipse();
      g.add(s);
      g.remove(s);
      expect(s.parent).toBe(false);
      expect(g.children.length).toBe(0);
    })

  });

  describe("copy()", function() {

    it("copies the object", function() {
      var parent = new Rune.Group();
      var parentEllipse = new Rune.Circle(10, 15, 300);
      var child = new Rune.Group();
      var childEllipse = new Rune.Circle(10, 15, 300);
      setMixinVars(parent);
      setMixinVars(parentEllipse);
      setMixinVars(child);
      setMixinVars(childEllipse);
      parent.add(parentEllipse);
      parent.add(child)
      child.add(childEllipse);

      var copy = parent.copy();
      expect(copy === parent).toEqual(false);
      expect(copy.children[0] === parentEllipse).toEqual(false);
      expect(copy.children[1] === child).toEqual(false);
      expect(copy.children[1].children[0] === childEllipse).toEqual(false);
      expect(copy).toEqual(parent);
    });

    it("calls shapeCopy", function() {
      var parent = new Rune.Group();
      spyOn(parent, "shapeCopy");
      parent.copy();
      expect(parent.shapeCopy).toHaveBeenCalled();
    });

  });

});

// Helpers
// --------------------------------------------------

function drawShared(shape) {
  shape.rotate(45, 100, 105)
    .fill(255, 0, 0, 0.5)
    .stroke(0, 255, 0, 0.6)
    .strokeWidth(5)
    .strokeCap('round')
    .strokeJoin('miter')
    .strokeMiterlimit(7)
    .strokeDash("3,4,5")
    .strokeDashOffset(10)
}

function expectShared(jshape) {
  expect(jshape).toHaveRotation(45, 100, 105);
  expect(jshape).toHaveAttr("fill", "rgba(255, 0, 0, 0.5)");
  expect(jshape).toHaveAttr("stroke", "rgba(0, 255, 0, 0.6)");
  expect(jshape).toHaveAttr("stroke-width", "5");
  expect(jshape).toHaveAttr("stroke-linecap", "round");
  expect(jshape).toHaveAttr("stroke-linejoin", "miter");
  expect(jshape).toHaveAttr("stroke-miterlimit", "7");
  expect(jshape).toHaveAttr("stroke-dasharray", "3,4,5");
  expect(jshape).toHaveAttr("stroke-dashoffset", "10");
}

describe("Rune.Render", function() {

  var r;
  var el;
  var jel;

  beforeEach(function() {
    r = new Rune({width:200, height:300});
    el = r.getEl();
    jel = $(el);
  });

  it("should create SVG element", function() {
    expect(el.tagName).toEqual('svg');
    expect(jel.attr('width')).toEqual("200");
    expect(jel.attr('height')).toEqual("300");
  });

  describe("All shapes", function() {

    it("should handle false vars", function() {
      var s = r.rect(0, 0, 0, 0)
        .fill(false)
        .stroke(false)
        .strokeWidth(false)
        .strokeCap(false)
        .strokeJoin(false)
        .strokeMiterlimit(false)
        .strokeDash(false)
        .strokeDashOffset(false)
      r.draw();
      var jshape = jel.children().first();
      expect(jshape).toBeTag("rect");
      expect(jshape.attr('fill')).toEqual("none");
      expect(jshape.attr('stroke')).toEqual("none");
      expect(jshape.attr('stroke-width')).toBeUndefined()
      expect(jshape.attr('stroke-linecap')).toBeUndefined()
      expect(jshape.attr('stroke-linejoin')).toBeUndefined()
      expect(jshape.attr('stroke-miterlimit')).toBeUndefined()
      expect(jshape.attr('stroke-dasharray')).toBeUndefined()
      expect(jshape.attr('stroke-dashoffset')).toBeUndefined()
    });

    it("renders rotation with 0", function() {
      var s = r.rect(0, 0, 0, 0)
        .rotate(45, 0, 10);
      r.draw();
      var jshape = jel.children().first();
      expect(jshape).toHaveRotation(45, 0, 10);
    });

  });

  describe("Rune.Rectangle", function() {

    it("should render rectangle", function() {
      var s = r.rect(100, 105, 300, 400);
      drawShared(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("rect");
      expect(jshape).toHaveAttrs({
        x: s.vars.x,
        y: s.vars.y,
        width: s.vars.width,
        height: s.vars.height
      });
      expect(jshape).not.toHaveTranslation(100, 105);
      expectShared(jshape);
    });

  });

  describe("Rune.Ellipse", function() {

    it("should render ellipse", function() {
      var s = r.ellipse(100, 105, 300, 400);
      drawShared(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("ellipse");
      expect(jshape).toHaveAttrs({
        cx: s.vars.x,
        cy: s.vars.y,
        rx: s.vars.width,
        ry: s.vars.height
      });
      expect(jshape).not.toHaveTranslation(100, 105);
      expectShared(jshape);
    });

  });

  describe("Rune.Circle", function() {

    it("should render circle", function() {
      var s = r.circle(100, 105, 300);
      drawShared(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("circle");
      expect(jshape).toHaveAttrs({
        cx: s.vars.x,
        cy: s.vars.y,
        r: s.vars.radius
      });
      expect(jshape).not.toHaveTranslation(100, 105);
      expectShared(jshape);
    });

  });

  describe("Rune.Line", function() {

    it("should render line", function() {
      var s = r.line(100, 105, 200, 205);
      drawShared(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("line");
      expect(jshape).toHaveAttrs({
        x1: s.vars.x,
        y1: s.vars.y,
        x2: s.vars.x2,
        y2: s.vars.y2
      });
      expect(jshape).not.toHaveTranslation(100, 105);
      expectShared(jshape);
    });

  });

  describe("Rune.Polygon", function() {

    it("should render polygon", function() {
      var s = r.polygon(10, 15)
        .lineTo(100, 101)
        .lineTo(200, 201)
        .lineTo(300, 301);
      drawShared(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("polygon");
      expect(jshape).toHaveAttr("points", "100 101 200 201 300 301")
      expect(jshape).toHaveTranslation(10, 15);
      expectShared(jshape);
    });

  });

  describe("Rune.Path", function() {

    it("should render path", function() {
      var s = r.path(10, 15);
      drawShared(s);
      setAllAnchors(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("path");
      expect(jshape).toHaveAttr("d", "M 0 0 L 104 105 M 106 107 C 108 109 110 111 112 113 Q 114 115 116 117 Z")
      expect(jshape).toHaveTranslation(10, 15);
      expectShared(jshape);
    });

    it("should render optional vars", function() {

      var optionals = {
        fillRule: ["fill-rule", "evenodd"]
      }

      _.each(optionals, function(v, k) {
        var s = r.path(10, 15);
        r.draw();
        expect($(el).children().first().attr(v[0])).toBeUndefined();
        s[k](v[1]);
        r.draw();
        expect($(el).children().first().attr(v[0])).toEqual(v[1] + "");
      });
    });

  });

  describe("Rune.Text", function() {

    var s;

    beforeEach(function() {
      s = r.text("Hello", 10, 15);
    });

    it("should render text", function() {
      drawShared(s);
      r.draw();
      var jshape = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jshape).toBeTag("text");
      expect(jshape).toHaveAttrs({
        x: s.vars.x,
        y: s.vars.y
      });
      expect(jshape).not.toHaveTranslation(10, 15);
      expect(jshape.text()).toEqual("Hello")
      expectShared(jshape);
    });

    it("should render optional vars", function() {

      var optionals = {
        fontFamily: ["font-family", "Georgia"],
        fontWeight: ["font-weight", "bold"],
        fontSize: ["font-size", 32],
        letterSpacing: ["letter-spacing", 0.5],
        textDecoration: ["text-decoration", "underline"]
      }

      _.each(optionals, function(v, k) {
        r.draw();
        expect($(el).children().first().attr(v[0])).toBeUndefined();
        s[k](v[1]);
        r.draw();
        expect($(el).children().first().attr(v[0])).toEqual(v[1] + "");
      });
    });

    describe("textAlign()", function() {

      it("should render proper attributes", function() {
        var aligns = [
          ["left", "start"],
          ["center", "middle"],
          ["right", "end"]
        ];
        _.each(aligns, function(align) {
          s.textAlign(align[0]);
          r.draw();
          var jshape = jel.children().first();
          expect(jshape).toHaveAttr("text-anchor", align[1]);
        });
      });

    });

  });

  describe("Rune.Group", function() {

    it("should render group", function() {
      var g = r.group(10, 15)
        .rotate(45);
      var e = new Rune.Circle(10, 15, 100);
      g.add(e)
      r.draw();

      var jgroup = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jgroup).toBeTag("g");
      expect(jgroup).toHaveTranslation(10, 15);
      expect(jgroup).toHaveRotation(g.vars.rotation);

      var jellipse = jgroup.children().first();
      expect(jellipse).toBeTag("circle");
      expect(jellipse).toHaveAttrs({
        cx: 10,
        cy: 15,
        r: 100
      });
    });

    it("should not render if empty", function() {
      var g = r.group(10, 15);
      r.draw();
      var jgroup = jel.children().first();
      expect(jel.children().length).toEqual(0);
    })

  });

  describe("Rune.Grid", function() {

    it("should render grid", function() {
      var g = r.grid({
        x: 10,
        y: 15,
        gutterX: 20,
        gutterY: 30,
        moduleWidth: 40,
        moduleHeight: 50,
        columns: 4,
        rows: 3
      }).rotate(45);
      var ellipse = new Rune.Circle(10, 15, 100);
      g.add(ellipse, 2, 3)
      r.draw();

      var jgrid = jel.children().first();
      expect(jel.children().length).toEqual(1);
      expect(jgrid).toBeTag("g")
      expect(jgrid).toHaveTranslation(10, 15);
      expect(jgrid).toHaveRotation(45);

      var jmodule = jgrid.children().first();
      expect(jmodule).toBeTag("g");
      expect(jmodule).toHaveTranslation(60, 160);

      var jellipse = jmodule.children().first();
      expect(jellipse).toBeTag("circle");
      expect(jellipse).toHaveAttrs({
        cx: 10,
        cy: 15,
        r: 100
      });

    });

  });

  describe("Debug mode", function() {

    it("should not render if debug false", function() {
      var p = r.path(10, 10);
      p.curveTo(100, 105, 200, 205, 300, 305).closePath();
      r.draw();
      expect(jel.find('line').length).toBe(0);
      expect(jel.find('circle').length).toBe(0);
    });

    it("should render cubic curve helpers", function() {
      r.debug = true;
      var p = r.path(10, 10);
      p.curveTo(100, 105, 200, 205, 300, 305).closePath();
      r.draw();

      expect(jel.find('line').length).toBe(2);
      expect(jel.find('line')[0]).toHaveAttrs({x1: 110, y1: 115, x2:310, y2:315});
      expect(jel.find('line')[1]).toHaveAttrs({x1: 210, y1: 215, x2:310, y2:315});

      expect(jel.find('circle').length).toBe(3);
      expect(jel.find('circle')[0]).toHaveAttrs({cx: 110, cy: 115});
      expect(jel.find('circle')[1]).toHaveAttrs({cx: 210, cy: 215});
      expect(jel.find('circle')[2]).toHaveAttrs({cx: 310, cy: 315});
    });

    it("should render quad curve helpers", function() {
      r.debug = true;
      var p = r.path(10, 10);
      p.curveTo(200, 205, 300, 305).closePath();
      r.draw();

      expect(jel.find('line').length).toBe(1);
      expect(jel.find('line')[0]).toHaveAttrs({x1: 210, y1: 215, x2:310, y2:315});

      expect(jel.find('circle').length).toBe(2);
      expect(jel.find('circle')[0]).toHaveAttrs({cx: 210, cy: 215});
      expect(jel.find('circle')[1]).toHaveAttrs({cx: 310, cy: 315});

    });

    it("should render grid helpers", function() {
      r.debug = true;
      var grid = r.grid({
        x: 10,
        y: 15,
        gutter: 20,
        moduleWidth: 25,
        moduleHeight: 30,
        columns: 3,
        rows: 3
      });
      r.draw();

      var jgrid = jel.children().first();
      expect(jgrid).toBeTag("g");
      expect(jgrid).toHaveTranslation(10, 15);

      expect(jgrid.find('rect').length).toBe(1);
      expect(jgrid.find('rect')[0]).toHaveAttrs({x: 0, y: 0, width:115, height:130});

      expect(jgrid.find('line').length).toBe(8);
      expect(jgrid.find('line')[0]).toHaveAttrs({x1: 25, y1: 0, x2:25, y2:grid.vars.height});
      expect(jgrid.find('line')[1]).toHaveAttrs({x1: 45, y1: 0, x2:45, y2:grid.vars.height});
      expect(jgrid.find('line')[2]).toHaveAttrs({x1: 70, y1: 0, x2:70, y2:grid.vars.height});
      expect(jgrid.find('line')[3]).toHaveAttrs({x1: 90, y1: 0, x2:90, y2:grid.vars.height});
      expect(jgrid.find('line')[4]).toHaveAttrs({x1: 0, y1: 30, x2:grid.vars.width, y2:30});
      expect(jgrid.find('line')[5]).toHaveAttrs({x1: 0, y1: 50, x2:grid.vars.width, y2:50});
      expect(jgrid.find('line')[6]).toHaveAttrs({x1: 0, y1: 80, x2:grid.vars.width, y2:80});
      expect(jgrid.find('line')[7]).toHaveAttrs({x1: 0, y1: 100, x2:grid.vars.width, y2:100});
    });

  })

  // MAKE A COMPLEX TEST THAT HAS A BUNCH OF GROUPS
  // NESTED IN EACH OTHER, etc.

});

describe("Rune", function() {

  var r;

  beforeEach(function() {
    r = new Rune();
  });

  describe("instantiation", function() {

    it("should save width and height", function() {
    var r = new Rune({width: 100, height: 105});
      expect(r.width).toEqual(100);
      expect(r.height).toEqual(105);
    });

  });

  describe("on()", function() {

    describe("draw", function() {

      it("triggers draw event", function(done) {
        var mock = { draw: function(){} };
        spyOn(mock, 'draw');
        var r = new Rune();
        r.on('draw', mock.draw);
        r.play();
        setTimeout(function() {
          expect(mock.draw).toHaveBeenCalled();
          done();
        }, 100);
      }, 110);

    });

  });

  describe("frameRate()", function() {

    var mock;

    beforeEach(function() {
      mock = { draw: function(){} };
      spyOn(mock, 'draw');
    });

    it("defaults to 60 fps", function(done) {
      var r = new Rune();
      r.on('draw', mock.draw);
      r.play();
      setTimeout(function() {
        expect(mock.draw.calls.count() > 14).toBe(true)
        expect(mock.draw.calls.count() < 18).toBe(true)
        done();
      }, 250);
    }, 260);

    it("follows framerate", function(done) {
      var r = new Rune({frameRate:10});
      r.on('draw', mock.draw);
      r.play();
      setTimeout(function() {
        expect(mock.draw.calls.count() > 1).toBe(true)
        expect(mock.draw.calls.count() < 3).toBe(true)
        done();
      }, 250);
    }, 260);

  });

  describe(".group()", function() {

    it("should create group", function() {
      var group = r.group(10, 15);
      expect(group.type).toEqual("group")
      expect(group.vars.x).toEqual(10);
      expect(group.vars.y).toEqual(15);
    });

    it("should call addToGroup()", function() {
      var group = new Rune.Group();
      spyOn(Rune, "addToGroup");
      var s = r.group(0, 0, group);
      expect(Rune.addToGroup).toHaveBeenCalledWith(s, r.stage, group);
    });

  });

  describe(".rect()", function() {

    it("should create rect", function() {
      var rectangle = r.rect(10, 15, 200, 100);
      expect(rectangle.type).toEqual("rectangle")
      expect(rectangle.vars.x).toEqual(10);
      expect(rectangle.vars.y).toEqual(15);
      expect(rectangle.vars.width).toEqual(200);
      expect(rectangle.vars.height).toEqual(100);
    });

    it("should call addToGroup()", function() {
      var group = new Rune.Group();
      spyOn(Rune, "addToGroup");
      var s = r.rect(0, 0, 0, 0, group);
      expect(Rune.addToGroup).toHaveBeenCalledWith(s, r.stage, group);
    });

  });

  describe(".ellipse()", function() {

    it("should create ellipse", function() {
      var ellipse = r.ellipse(10, 15, 200, 100);
      expect(ellipse.type).toEqual("ellipse")
      expect(ellipse.vars.x).toEqual(10);
      expect(ellipse.vars.y).toEqual(15);
      expect(ellipse.vars.width).toEqual(200);
      expect(ellipse.vars.height).toEqual(100);
    });

    it("should call addToGroup()", function() {
      var group = new Rune.Group();
      spyOn(Rune, "addToGroup");
      var s = r.ellipse(0, 0, 0, 0, group);
      expect(Rune.addToGroup).toHaveBeenCalledWith(s, r.stage, group);
    });

  });

  describe(".circle()", function() {

    it("should create circle", function() {
      var circ = r.circle(10, 15, 200);
      expect(circ.type).toEqual("circle")
      expect(circ.vars.x).toEqual(10);
      expect(circ.vars.y).toEqual(15);
      expect(circ.vars.radius).toEqual(200);
    });

    it("should call addToGroup()", function() {
      var group = new Rune.Group();
      spyOn(Rune, "addToGroup");
      var s = r.circle(0, 0, 0, group);
      expect(Rune.addToGroup).toHaveBeenCalledWith(s, r.stage, group);
    });

  });

  describe(".line()", function() {

    it("should create line", function() {
      var line = r.line(10, 15, 100, 105);
      expect(line.type).toEqual("line")
      expect(line.vars.x).toEqual(10);
      expect(line.vars.y).toEqual(15);
      expect(line.vars.x2).toEqual(100);
      expect(line.vars.y2).toEqual(105);
    });

    it("should call addToGroup()", function() {
      var group = new Rune.Group();
      spyOn(Rune, "addToGroup");
      var s = r.line(0, 0, 0, 0, group);
      expect(Rune.addToGroup).toHaveBeenCalledWith(s, r.stage, group);
    });

  });

  describe(".polygon()", function() {

    it("should create polygon", function() {
      var polygon = r.polygon(10, 15);
      expect(polygon.vars.x).toEqual(10);
      expect(polygon.vars.y).toEqual(15);
      expect(polygon.type).toEqual("polygon")
    });

    it("should call addToGroup()", function() {
      var group = new Rune.Group();
      spyOn(Rune, "addToGroup");
      var s = r.polygon(0, 0, group);
      expect(Rune.addToGroup).toHaveBeenCalledWith(s, r.stage, group);
    });

  });

  describe(".path()", function() {

    it("should create path", function() {
      var path = r.path(10, 15);
      expect(path.vars.x).toEqual(10);
      expect(path.vars.y).toEqual(15);
      expect(path.type).toEqual("path")
    });

    it("should call addToGroup()", function() {
      var group = new Rune.Group();
      spyOn(Rune, "addToGroup");
      var s = r.path(0, 0, group);
      expect(Rune.addToGroup).toHaveBeenCalledWith(s, r.stage, group);
    });

  });

  describe(".text()", function() {

    it("should create text", function() {
      var text = r.text("Hello", 10, 15);
      expect(text.vars.x).toEqual(10);
      expect(text.vars.y).toEqual(15);
      expect(text.vars.text).toEqual("Hello")
      expect(text.type).toEqual("text")
    });

    it("should call addToGroup()", function() {
      var group = new Rune.Group();
      spyOn(Rune, "addToGroup");
      var t = r.text("Hello", 10, 15, group);
      expect(Rune.addToGroup).toHaveBeenCalledWith(t, r.stage, group);
    });

  });

  describe(".grid()", function() {

    it("should create group", function() {
      var grid = r.grid({x:10, y:15});
      expect(grid.type).toEqual("grid")
      expect(grid.vars.x).toEqual(10);
      expect(grid.vars.y).toEqual(15);
    });

    it("should call addToGroup()", function() {
      var group = new Rune.Group();
      spyOn(Rune, "addToGroup");
      var s = r.grid({}, group);
      expect(Rune.addToGroup).toHaveBeenCalledWith(s, r.stage, group);
    });

  });

  describe("random()", function() {

    it("works with only high", function() {
      var ran = r.random(500);
      expect(ran >= 0).toBe(true);
      expect(ran <= 500).toBe(true);
    });

    it("works with low and high", function() {
      var ran = r.random(500, 1000);
      expect(ran >= 500).toBe(true);
      expect(ran <= 1000).toBe(true);
    });

  });

  describe("Rune.addToGroup", function() {

    var child;
    var fallback;
    var group;

    beforeEach(function() {
      child = new Rune.Rectangle(10, 20, 30, 40);
      fallback = new Rune.Group();
      group = new Rune.Group();
    });

    it("should add to group", function() {
      Rune.addToGroup(child, fallback, group)
      expect(group.children[0]).toBe(child);
      expect(fallback.children.length).toEqual(0);
    });

    it("should add to fallback", function() {
      Rune.addToGroup(child, fallback)
      expect(group.children.length).toEqual(0);
      expect(fallback.children[0]).toBe(child);
    });

    it("should not add", function() {
      Rune.addToGroup(child, fallback, false)
      expect(group.children.length).toEqual(0);
      expect(fallback.children.length).toEqual(0);
    });

  });

});

describe("Rune.Vector", function() {

  var v1;
  var v2;

  beforeEach(function() {
    v1 = new Rune.Vector(10, 15);
    v2 = new Rune.Vector(20, 25);
  });

  describe("add()", function() {
    it("adds vectors", function() {
      var res = v1.add(v2);
      expect(res).toEqualVector(30, 40);
      expect(res).not.toBe(v1);
    });
  });

  describe("sub()", function() {
    it("subtracts vectors", function() {
      var res = v1.sub(v2);
      expect(res).toEqualVector(-10, -10);
      expect(res).not.toBe(v1);
    });
  });

  describe("multiply()", function() {
    it("multiplies vector", function() {
      var res = v1.multiply(3);
      expect(res).toEqualVector(30, 45);
      expect(res).not.toBe(v1);
    });
  });

  describe("divide()", function() {
    it("divides vector", function() {
      var res = v1.divide(3);
      expect(res).toEqualVector(10 / 3, 5);
      expect(res).not.toBe(v1);
    });
  });

  describe("distance()", function() {
    it("finds distance", function() {
      var res = v1.distance(v2);
      expect(res).toEqual(14.142135623730951);
    });
  });

  describe("lerp()", function() {
    it("finds lerp", function() {
      var res = v1.lerp(v2, 0.5);
      expect(res).toEqualVector(15, 20);
      expect(res).not.toBe(v1);
    });
  });

  describe("dot()", function() {
    it("finds dot product", function() {
      var res = v1.dot(v2);
      expect(res).toEqual(575);
    });
  });

  describe("length()", function() {
    it("finds length", function() {
      var res = v1.length();
      expect(res).toEqual(18.027756377319946);
    });
  });

  describe("normalize()", function() {
    it("normalizes vector", function() {
      var res = v1.normalize();
      expect(res).toEqualVector(0.5547001962252291, 0.8320502943378437);
      expect(res).not.toBe(v1);
    });
  });

  describe("rotation()", function() {
    it("finds rotation of vector", function() {
      var res = v1.rotation();
      expect(res).toBe(56.309932474020215);
    });
  });

  describe("rotate()", function() {
    it("rotates vector", function() {
      var res = v1.rotate(90);
      expect(res).toEqualVector(-15, 10);
      expect(res).not.toBe(v1);
    });
  });

  describe("copy()", function() {
    it("creates a new vector", function() {
      var v3 = v1.copy();
      expect(v1).toEqual(v3);
      expect(v3).not.toBe(v1);
    });
  });

});

describe("Rune.Moveable", function() {

  var m;

  beforeEach(function() {
    m = newMixin(Rune.Moveable);
    m.moveable();
  });

  describe("moveable()", function() {

    it("assigns default variables", function() {
      expect(typeof m.moveable).toEqual("function");
      expect(m.vars.x).toEqual(0);
      expect(m.vars.y).toEqual(0);
      expect(m.vars.rotation).toEqual(0);
    });

    it("copies variables from object", function() {
      setMoveableVars(m);
      var m2 = newMixin(Rune.Moveable);
      m2.moveable(m);
      expect(m2.vars.x).toEqual(10);
      expect(m2.vars.y).toEqual(15);
      expect(m2.vars.rotation).toEqual(45);
    });

    it("copies negative values from object", function() {
      setMoveableVars(m, {
        x:-10,
        y:-15,
        rotation:-20,
        rotationX:-25,
        rotationY:-30
      });
      var m2 = newMixin(Rune.Moveable);
      m2.moveable(m);
      expect(m2.vars.x).toEqual(-10);
      expect(m2.vars.y).toEqual(-15);
      expect(m2.vars.rotation).toEqual(-20);
      expect(m2.vars.rotationX).toEqual(-25);
      expect(m2.vars.rotationY).toEqual(-30);
    });

  });

  describe("move()", function() {

    it("moves absolute", function() {
      setMoveableVars(m);
      var res = m.move(200, 205);
      expect(m.vars.x).toEqual(200);
      expect(m.vars.y).toEqual(205);
      expect(m).toEqual(res);
    });

    it("moves relative", function() {
      setMoveableVars(m);
      var res = m.move(200, 205, true);
      expect(m.vars.x).toEqual(210);
      expect(m.vars.y).toEqual(220);
      expect(m).toEqual(res);
    });

  });

  describe("rotate()", function() {

    it("rotates on degree", function() {
      var res = m.rotate(45);
      expect(m.vars.rotation).toEqual(45);
      expect(m.vars.rotationX).toEqual(0);
      expect(m.vars.rotationY).toEqual(0);
      expect(m).toEqual(res);
    });

    it("rotates on degree and xy", function() {
      m.rotate(45, 100, 105);
      expect(m.vars.rotation).toEqual(45);
      expect(m.vars.rotationX).toEqual(100);
      expect(m.vars.rotationY).toEqual(105);
    });

    it("rotates relative to own xy", function() {
      m.move(10, 15)
      m.rotate(45, 100, 105, true);
      expect(m.vars.rotation).toEqual(45);
      expect(m.vars.rotationX).toEqual(110);
      expect(m.vars.rotationY).toEqual(120);
    });

  });

});
describe("Rune.Shapeable", function() {

});
describe("Rune.Sizeable", function() {

  var m;

  beforeEach(function() {
    m = newMixin(Rune.Sizeable);
    m.sizeable();
  });

  describe("sizeable()", function() {

    it("assigns default variables", function() {
      expect(typeof m.sizeable).toEqual("function");
      expect(m.vars.width).toEqual(0);
      expect(m.vars.height).toEqual(0);
    });

    it("copies variables from object", function() {
      setSizeableVars(m);
      var m2 = newMixin(Rune.Sizeable);
      m2.sizeable(m);
      expect(m2.vars.width).toEqual(300);
      expect(m2.vars.height).toEqual(305);
    });

  });

});
describe("Rune.Styleable", function() {

  var m;

  beforeEach(function() {
    m = newMixin(Rune.Styleable);
    m.styleable();
  });

  describe("styleable()", function() {

    it("assigns default variable", function() {
      expect(typeof m.styleable).toEqual("function");
      expect(m.vars.fill.rgbArray()).toEqual([128, 128, 128]);
      expect(m.vars.stroke.rgbArray()).toEqual([0, 0, 0]);
    });

    it("copies variables from object", function() {
      setStyleableVars(m);
      var m2 = newMixin(Rune.Styleable);
      m2.styleable(m);
      expect(m2.vars.fill).toEqual(m.vars.fill);
      expect(m2.vars.stroke).toEqual(m.vars.stroke);
    });

    it("copies false variables from object", function() {
      m.fill(false);
      m.stroke(false);
      var m2 = newMixin(Rune.Styleable);
      m2.styleable(m);
      expect(m2.vars.fill).toBe(false);
      expect(m2.vars.stroke).toBe(false);
    });

    it("copies zero colors", function() {
      var m2 = newMixin(Rune.Styleable);
      m2.styleable(m);
      expect(m2.vars.fill).toEqual(m.vars.fill);
      expect(m2.vars.stroke).toEqual(m.vars.stroke);
    });

  });

  describe("fill()", function() {

    it("sets fill to color", function() {
      var res = m.fill("#ff0000");
      expect(m.vars.fill.rgbArray()).toEqual([255, 0, 0]);
      expect(m).toEqual(res);
    });

    it("sets fill to false", function() {
      m.fill(false);
      expect(m.vars.fill).toEqual(false);
    });

  });

  describe("stroke()", function() {

    it("sets stroke to color", function() {
      var res = m.stroke("#ff0000");
      expect(m.vars.stroke.rgbArray()).toEqual([255, 0, 0]);
      expect(m).toEqual(res);
    });

    it("sets stroke to false", function() {
      m.stroke(false);
      expect(m.vars.stroke).toEqual(false);
    });

  });

  describe("Basic setters", function() {

    it("sets the var value", function() {
      var funcs = ["strokeWidth", "strokeCap", "strokeJoin", "strokeMiterlimit", "strokeDash", "strokeDashOffset"]
      _.each(funcs, function(func) {
        var res = m[func](5);
        expect(m.vars[func]).toEqual(5)
        expect(m).toEqual(res);
      });
    })

  });

});
describe("Rune.Circle", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Circle(10, 15, 300);
    g = new Rune.Group();
    g.add(s);
  });

  describe("toPolygon()", function() {

    it("defaults to 16 vectors", function() {
      var poly = s.toPolygon();
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(16);
    });

    it("returns polygon with exact number of vectors", function() {
      var poly = s.toPolygon({ vectors: 10 });
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(10);
    });

    it("returns polygon with even spaced vectors", function() {
      var poly = s.toPolygon({ spacing: 50 });
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(76);
    });

    it("returns polygon with even spaced division", function() {
      var poly = s.toPolygon({ division: 0.2 });
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(5);
    });

  });

  describe("copy()", function() {

    it("copies the object", function() {
      setMixinVars(s);
      var copy = s.copy();
      expect(copy === s).toEqual(false);
      expect(copy).toEqual(s);
    });

    it("calls shapeCopy", function() {
      spyOn(s, "shapeCopy");
      s.copy(g);
      expect(s.shapeCopy).toHaveBeenCalled();
    });

  });

});
describe("Rune.Ellipse", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Ellipse(10, 15, 300, 305);
    g = new Rune.Group();
    g.add(s);
  });

  describe("toPolygon()", function() {

    it("defaults to 16 vectors", function() {
      var poly = s.toPolygon();
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(16);
    });

    it("returns polygon with exact number of vectors", function() {
      var poly = s.toPolygon({ vectors: 10 });
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(10);
    });

    it("returns polygon with even spaced vectors", function() {
      var poly = s.toPolygon({ spacing: 50 });
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(39);
    });

    it("returns polygon with even spaced division", function() {
      var poly = s.toPolygon({ division: 0.2 });
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(5);
    });

  });

  describe("copy()", function() {

    it("copies the object", function() {
      setMixinVars(s);
      var copy = s.copy();
      expect(copy === s).toEqual(false);
      expect(copy).toEqual(s);
    });

    it("calls shapeCopy", function() {
      spyOn(s, "shapeCopy");
      s.copy(g);
      expect(s.shapeCopy).toHaveBeenCalled();
    });

  });

});
describe("Rune.Line", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Line(10, 15, 20, 25);
    g = new Rune.Group();
    g.add(s);
  });

  describe("copy()", function() {

    it("copies the object", function() {
      setMixinVars(s);
      var copy = s.copy();
      expect(copy === s).toEqual(false);
      expect(copy).toEqual(s);
    });

    it("calls shapeCopy", function() {
      spyOn(s, "shapeCopy");
      s.copy(g);
      expect(s.shapeCopy).toHaveBeenCalled();
    });

  });

});
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
      expect(path.length()).toEqual(912.9528291563602);
    });
  });

  describe("vectorAt()", function() {

    it("should return vector at scalar", function() {
      var res = path.vectorAt(0.5);
      expect(res).toEqualVector(-95.04748002984878, 60.44400406520909);
    });

    it("should return vector if scalar is 0", function() {
      var res = path.vectorAt(0);
      expect(res).toEqualVector(0, 0);
    });

    it("should return vector if scalar is 1", function() {
      var res = path.vectorAt(1);
      expect(res).toEqualVector(0, 0);
    });

  });

  describe("vectorAtLength()", function() {

    it("should return vector at length", function() {
      var res = path.vectorAtLength(70);
      expect(res).toEqualVector(49.49747468305832, 49.49747468305832);
    });

    it("should return vector if length is 0", function() {
      var res = path.vectorAtLength(0);
      expect(res).toEqualVector(0, 0);
    });

    it("should return vector if length is more length", function() {
      var res = path.vectorAtLength(999999);
      expect(res).toEqualVector(0, 0);
    });

  });

  describe("subpaths()", function() {

    it("returns subpaths separated by moveTo", function() {
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

    it("should copy path styles") // SHOULD ALREADY WORK

    it("should work with scene graph") // I disabled this because I'm using it internally and don't want to add to stage automatically.
  });



  describe("toPolygons()", function() {

    //it("should return array of polygons and vectors with spacing", function() {
    //  var res = path.toPolygons({ spacing: 25 });
    //  expect(res.length).toEqual(2);
    //  var poly1 = res[0]
    //  var poly2 = res[1]
    //  expect(poly1.x).toEqual(10);
    //  expect(poly1.y).toEqual(15);
    //  expect(poly2.x).toEqual(10);
    //  expect(poly2.y).toEqual(15);
    //  console.log(poly1.vars.anchors);
    //  console.log(poly2.vars.anchors);
    //});

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

describe("Rune.Polygon", function() {

  var rhombus;

  beforeEach(function() {
    rhombus = new Rune.Polygon(10, 15)
      .lineTo(0, 0)
      .lineTo(60, 0)
      .lineTo(80, 60)
      .lineTo(20, 60);
  });

  describe("Polygon()", function() {

    it("should have optional x and y", function() {
      var p1 = new Rune.Polygon();
      expect(p1.vars.x).toEqual(0);
      expect(p1.vars.y).toEqual(0);

      var p2 = new Rune.Polygon(100, 101);
      expect(p2.vars.x).toEqual(100);
      expect(p2.vars.y).toEqual(101);
    });

  });

  describe("vectors", function() {

    it("should create vectors", function() {
      var p = new Rune.Polygon()
        .lineTo(100, 101)
        .lineTo(200, 201)
        .lineTo(300, 301);
      expect(p.vars.vectors[0].x).toEqual(100);
      expect(p.vars.vectors[0].y).toEqual(101);
      expect(p.vars.vectors[1].x).toEqual(200);
      expect(p.vars.vectors[1].y).toEqual(201);
      expect(p.vars.vectors[2].x).toEqual(300);
      expect(p.vars.vectors[2].y).toEqual(301);
    });

  });

  describe("centroid()", function() {
    it("should return centroid vector", function() {
      var vec = rhombus.centroid();
      expect(vec).toEqualVector(50, 45);
    });
  });

  describe("bounds()", function() {

    it("should return bounds", function() {
      expect(rhombus.bounds()).toEqual({
        x:10,
        y:15,
        width:80,
        height:60
      });
    });

    it("should work with minus values", function() {
      var circle = new Rune.Polygon(10, 10)
        .lineTo(-100, -100)
        .lineTo(100, -100)
        .lineTo(100, 100)
        .lineTo(-100, 100);
      expect(circle.bounds()).toEqual({
        x: -90,
        y: -90,
        width: 200,
        height: 200
      });
    });

  });

  describe("length()", function() {

    it("should return length of polygon", function() {
      var res = rhombus.length();
      expect(res).toEqual(246.49110640673518);
    });

  });

  describe("vectorAt()", function() {

    it("should return vector at scalar", function() {
      var res = rhombus.vectorAt(0.5);
      expect(res).toEqualVector(80, 60);
    });

    it("should return vector if scalar is 0", function() {
      var res = rhombus.vectorAt(0);
      expect(res).toEqualVector(0, 0);
    });

    it("should return vector if scalar is 1", function() {
      var res = rhombus.vectorAt(1);
      expect(res).toEqualVector(0, 0);
    });

  });

  describe("vectorAtLength()", function() {

    it("should return vector at length", function() {
      var res = rhombus.vectorAtLength(70);
      expect(res).toEqualVector(63.16227766016838, 9.486832980505138);
    });

    it("should return vector if length is 0", function() {
      var res = rhombus.vectorAtLength(0);
      expect(res).toEqualVector(0, 0);
    });

    it("should return vector if length is more length", function() {
      var res = rhombus.vectorAtLength(999999);
      expect(res).toEqualVector(0, 0);
    });

  });

  describe("toPolygon()", function() {

    it("should return self if no segmentor", function() {
      var res = rhombus.toPolygon();
      expect(res).toBe(res);
    });

    it("should return vectors with spacing", function() {
      var res = rhombus.toPolygon({ spacing: 25 });
      expect(res.vars.x).toEqual(10);
      expect(res.vars.y).toEqual(15);
      expect(res.vars.vectors.length).toEqual(10);
      expect(res.vars.vectors[0]).toEqualVector(0, 0);
      expect(res.vars.vectors[1]).toEqualVector(25, 0);
      expect(res.vars.vectors[2]).toEqualVector(50, 0);
      expect(res.vars.vectors[3]).toEqualVector(64.74341649025257, 14.230249470757707);
      expect(res.vars.vectors[4]).toEqualVector(72.64911064067351, 37.94733192202055);
      expect(res.vars.vectors[5]).toEqualVector(78.24555320336759, 60);
      expect(res.vars.vectors[6]).toEqualVector(53.24555320336759, 60);
      expect(res.vars.vectors[7]).toEqualVector(28.245553203367592,60);
      expect(res.vars.vectors[8]).toEqualVector(14.701778718652967,44.1053361559589);
      expect(res.vars.vectors[9]).toEqualVector(6.796084568232018,20.388253704696055);
    });

    it("should return vectors with spacing and corners");
    //it("should return vectors with spacing and corners", function() {
    //  var res = rhombus.toPolygon({ spacing: 25, corners:true });
    //  expect(res.vars.x).toEqual(10);
    //  expect(res.vars.y).toEqual(15);
    //  expect(res.vars.vectors.length).toEqual(13);
    //  expect(res.vars.vectors[0]).toEqualVector(0, 0);
    //  expect(res.vars.vectors[1]).toEqualVector(25, 0);
    //  expect(res.vars.vectors[2]).toEqualVector(50, 0);
    //  expect(res.vars.vectors[3]).toEqualVector(60, 0);
    //  expect(res.vars.vectors[4]).toEqualVector(64.74341649025257, 14.230249470757707);
    //  expect(res.vars.vectors[5]).toEqualVector(72.64911064067351, 37.94733192202055);
    //  expect(res.vars.vectors[6]).toEqualVector(78.24555320336759, 60);
    //  expect(res.vars.vectors[7]).toEqualVector(80, 60);
    //  expect(res.vars.vectors[8]).toEqualVector(53.24555320336759, 60);
    //  expect(res.vars.vectors[9]).toEqualVector(28.245553203367592,60);
    //  expect(res.vars.vectors[10]).toEqualVector(20,60);
    //  expect(res.vars.vectors[11]).toEqualVector(14.701778718652967,44.1053361559589);
    //  expect(res.vars.vectors[12]).toEqualVector(6.796084568232018,20.388253704696055);
    //});

  });

  describe("copy()", function() {

    var s;
    var g;

    beforeEach(function() {
      s = new Rune.Polygon()
        .lineTo(100, 101)
        .lineTo(200, 201)
        .lineTo(300, 301);
      g = new Rune.Group();
      g.add(s);
    });

    it("copies the object", function() {
      setMixinVars(s);
      var copy = s.copy();
      expect(copy === s).toEqual(false);
      expect(copy.vars.vectors === s.vars.vectors).toEqual(false);
      expect(copy).toEqual(s);
    });

    it("calls shapeCopy", function() {
      spyOn(s, "shapeCopy");
      s.copy(g);
      expect(s.shapeCopy).toHaveBeenCalled();
    });

  });





});

describe("Rune.Rectangle", function() {

  var s;
  var g;

  beforeEach(function() {
    s = new Rune.Rectangle(10, 15, 300, 305);
    g = new Rune.Group();
    g.add(s);
  });

  describe("toPolygon()", function() {

    it("defaults to corner vectors", function() {
      var poly = s.toPolygon();
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(4);
      expect(poly.vars.vectors[0]).toEqualVector(0, 0);
      expect(poly.vars.vectors[1]).toEqualVector(300, 0);
      expect(poly.vars.vectors[2]).toEqualVector(300, 305);
      expect(poly.vars.vectors[3]).toEqualVector(0, 305);
    });

    it("returns polygon with even spaced vectors", function() {
      // Actual vectors tested in polygon.toPolygon();
      var poly = s.toPolygon({ spacing: 50 });
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(25);
    });

  });

  describe("copy()", function() {

    it("copies the object", function() {
      setMixinVars(s);
      var copy = s.copy();
      expect(copy === s).toEqual(false);
      expect(copy).toEqual(s);
    });

    it("calls shapeCopy", function() {
      spyOn(s, "shapeCopy");
      s.copy(g);
      expect(s.shapeCopy).toHaveBeenCalled();
    });

  });

});
describe("Rune.Text", function() {

  var t;

  beforeEach(function() {
    t = new Rune.Text("Hello", 10, 15);
  });

  describe("Common setters", function() {

    var setters = {
      "textAlign" : "center",
      "fontFamily" : "Georgia",
      "fontStyle" : "italic",
      "fontWeight" : "bold",
      "fontSize" : 32,
      "letterSpacing" : 0.5,
      "textDecoration" : "underline"
    };

    it("sets var and is chainable", function() {
      _.each(setters, function(v, k) {
        var res = t[k](v);
        expect(res.vars[k]).toEqual(v);
        expect(res).toBe(res);
      });
    });

  });

  describe("toPolygon", function() {

    it("throws error if Rune.Font is not present", function() {
      expect( function(){ t.toPolygon() } ).toThrow(new Error("You need the Rune.Font plugin to convert text to polygon"));
    });

  });

  describe("copy()", function() {

    var g;

    beforeEach(function() {
      g = new Rune.Group();
      g.add(t);
    });

    it("copies the object", function() {
      setMixinVars(t);
      var copy = t.copy();
      expect(copy === t).toEqual(false);
      expect(copy).toEqual(t);
    });

    it("calls shapeCopy", function() {
      spyOn(t, "shapeCopy");
      t.copy(g);
      expect(t.shapeCopy).toHaveBeenCalled();
    });

  });

});