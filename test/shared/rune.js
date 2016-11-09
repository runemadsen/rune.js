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
    
    it("should define namespace in attributes", function() {
        var r = new Rune();
        expect(r.tree.properties.attributes.xmlns).not.toEqual(undefined);
        expect(r.tree.properties.attributes['xmlns:xlink']).not.toEqual(undefined);
    });

  });

  describe(".group()", function() {

    it("should create group", function() {
      var group = r.group(10, 15);
      expect(group.type).toEqual("group")
      expect(group.state.x).toEqual(10);
      expect(group.state.y).toEqual(15);
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
      expect(rectangle.state.x).toEqual(10);
      expect(rectangle.state.y).toEqual(15);
      expect(rectangle.state.width).toEqual(200);
      expect(rectangle.state.height).toEqual(100);
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
      expect(ellipse.state.x).toEqual(10);
      expect(ellipse.state.y).toEqual(15);
      expect(ellipse.state.width).toEqual(200);
      expect(ellipse.state.height).toEqual(100);
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
      expect(circ.state.x).toEqual(10);
      expect(circ.state.y).toEqual(15);
      expect(circ.state.radius).toEqual(200);
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
      expect(line.state.x).toEqual(10);
      expect(line.state.y).toEqual(15);
      expect(line.state.x2).toEqual(100);
      expect(line.state.y2).toEqual(105);
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
      expect(tri.state.x).toEqual(10);
      expect(tri.state.y).toEqual(15);
      expect(tri.state.x2).toEqual(90);
      expect(tri.state.y2).toEqual(90);
      expect(tri.state.x3).toEqual(10);
      expect(tri.state.y3).toEqual(105);
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
      expect(polygon.state.x).toEqual(10);
      expect(polygon.state.y).toEqual(15);
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
      expect(path.state.x).toEqual(10);
      expect(path.state.y).toEqual(15);
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
      expect(text.state.x).toEqual(10);
      expect(text.state.y).toEqual(15);
      expect(text.state.text).toEqual("Hello")
      expect(text.state.fontSize).toEqual(16)
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
      expect(grid.state.x).toEqual(10);
      expect(grid.state.y).toEqual(15);
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
