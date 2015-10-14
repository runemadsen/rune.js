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

  describe(".group()", function() {

    it("should create group", function() {
      var group = r.group(10, 15);
      expect(group.type).toEqual("group")
      expect(group.vars.x).toEqual(10);
      expect(group.vars.y).toEqual(15);
    });

    it("should add to group", function() {
      var group = new Rune.Group();
      var child = r.group(0, 0, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function() {
      var child = r.group(0, 0);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function() {
      var child = r.group(0, 0, false);
      expect(child.parent).toBeUndefined();
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

    it("should add to group", function() {
      var group = new Rune.Group();
      var child = r.rect(0, 0, 0, 0, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function() {
      var child = r.rect(0, 0, 0, 0);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function() {
      var child = r.rect(0, 0, 0, 0, false);
      expect(child.parent).toBeUndefined();
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

    it("should add to group", function() {
      var group = new Rune.Group();
      var child = r.ellipse(10, 15, 200, 100, group)
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function() {
      var child = r.ellipse(10, 15, 200, 100)
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function() {
      var child = r.ellipse(10, 15, 200, 100, false)
      expect(child.parent).toBeUndefined();
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

    it("should add to group", function() {
      var group = new Rune.Group();
      var child = r.circle(10, 15, 200, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function() {
      var child = r.circle(10, 15, 200);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function() {
      var child = r.circle(10, 15, 200, false);
      expect(child.parent).toBeUndefined();
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

    it("should add to group", function() {
      var group = new Rune.Group();
      var child = r.line(10, 15, 100, 105, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function() {
      var child = r.line(10, 15, 100, 105);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function() {
      var child = r.line(10, 15, 100, 105, false);
      expect(child.parent).toBeUndefined();
    });

  });

  describe(".triangle()", function() {

    it("should create triangle", function() {
      var tri = r.triangle(10, 15, 100, 105, 20, 120);
      expect(tri.type).toEqual("triangle")
      expect(tri.vars.x).toEqual(10);
      expect(tri.vars.y).toEqual(15);
      expect(tri.vars.x2).toEqual(100);
      expect(tri.vars.y2).toEqual(105);
      expect(tri.vars.x3).toEqual(20);
      expect(tri.vars.y3).toEqual(120);
    });

    it("should add to group", function() {
      var group = new Rune.Group();
      var child = r.line(10, 15, 100, 105, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function() {
      var child = r.line(10, 15, 100, 105);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function() {
      var child = r.line(10, 15, 100, 105, false);
      expect(child.parent).toBeUndefined();
    });

  });

  describe(".polygon()", function() {

    it("should create polygon", function() {
      var polygon = r.polygon(10, 15);
      expect(polygon.vars.x).toEqual(10);
      expect(polygon.vars.y).toEqual(15);
      expect(polygon.type).toEqual("polygon")
    });

    it("should add to group", function() {
      var group = new Rune.Group();
      var child = r.polygon(10, 15, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function() {
      var child = r.polygon(10, 15);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function() {
      var child = r.polygon(10, 15, false);
      expect(child.parent).toBeUndefined();
    });

  });

  describe(".path()", function() {

    it("should create path", function() {
      var path = r.path(10, 15);
      expect(path.vars.x).toEqual(10);
      expect(path.vars.y).toEqual(15);
      expect(path.type).toEqual("path")
    });

    it("should add to group", function() {
      var group = new Rune.Group();
      var child = r.path(10, 15, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function() {
      var child = r.path(10, 15);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function() {
      var child = r.path(10, 15, false);
      expect(child.parent).toBeUndefined();
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

    it("should add to group", function() {
      var group = new Rune.Group();
      var child = r.text("Hello", 10, 15, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function() {
      var child = r.text("Hello", 10, 15);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function() {
      var child = r.text("Hello", 10, 15, false);
      expect(child.parent).toBeUndefined();
    });

  });

  describe(".grid()", function() {

    it("should create group", function() {
      var grid = r.grid({x:10, y:15});
      expect(grid.type).toEqual("grid")
      expect(grid.vars.x).toEqual(10);
      expect(grid.vars.y).toEqual(15);
    });

    it("should add to group", function() {
      var group = new Rune.Group();
      var child = r.grid({}, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function() {
      var child = r.grid({});
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function() {
      var child = r.grid({}, false);
      expect(child.parent).toBeUndefined();
    });

  });

});
