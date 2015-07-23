describe("Rune", function() {

  var r;

  beforeEach(function() {
    r = new Rune();
  });

  describe(".group()", function() {

    it("should create group", function() {
      var group = r.group(10, 15);
      expect(group.type).toEqual("group")
      expect(group.x).toEqual(10);
      expect(group.y).toEqual(15);
    });

    it("should add to stage", function() {
      var group = r.group(10, 15);
      expect(r.stage.children.length).toEqual(1);
    });

    it("should add to group", function() {
      var parent = new Rune.Group();
      var child = r.group(10, 15, parent);
      expect(r.stage.children.length).toEqual(0);
      expect(parent.children.length).toEqual(1);
    });

    it("should not add", function() {
      var group = r.group(10, 15, false);
      expect(r.stage.children.length).toEqual(0)
    });

  });

  describe(".rect()", function() {

    it("should create rect", function() {
      var rectangle = r.rect(10, 15, 200, 100);
      expect(rectangle.type).toEqual("rectangle")
      expect(rectangle.x).toEqual(10);
      expect(rectangle.y).toEqual(15);
      expect(rectangle.width).toEqual(200);
      expect(rectangle.height).toEqual(100);
    });

    it("should add to stage", function() {
      var rectangle = r.rect(10, 15, 200, 100);
      expect(r.stage.children.length).toEqual(1);
    });

    it("should add to group", function() {
      var group = new Rune.Group();
      var rectangle = r.rect(10, 15, 200, 100, group);
      expect(r.stage.children.length).toEqual(0);
      expect(group.children.length).toEqual(1);
    });

    it("should not add", function() {
      var rectangle = r.rect(10, 15, 200, 100, false);
      expect(r.stage.children.length).toEqual(0)
    });

  });

  describe(".ellipse()", function() {

    it("should create ellipse", function() {
      var ellipse = r.ellipse(10, 15, 200, 100);
      expect(ellipse.type).toEqual("ellipse")
      expect(ellipse.x).toEqual(10);
      expect(ellipse.y).toEqual(15);
      expect(ellipse.width).toEqual(200);
      expect(ellipse.height).toEqual(100);
    });

    it("should add to stage", function() {
      var ellipse = r.ellipse(10, 15, 200, 100);
      expect(r.stage.children.length).toEqual(1);
    });

    it("should add to group", function() {
      var group = new Rune.Group();
      var ellipse = r.ellipse(10, 15, 200, 100, group);
      expect(r.stage.children.length).toEqual(0);
      expect(group.children.length).toEqual(1);
    });

    it("should not add", function() {
      var ellipse = r.ellipse(10, 15, 200, 100, false);
      expect(r.stage.children.length).toEqual(0)
    });

  });

  describe(".circle()", function() {

    it("should create circle", function() {
      var circ = r.circle(10, 15, 200);
      expect(circ.type).toEqual("circle")
      expect(circ.x).toEqual(10);
      expect(circ.y).toEqual(15);
      expect(circ.radius).toEqual(200);
    });

    it("should add to stage", function() {
      var circ = r.circle(10, 15, 200);
      expect(r.stage.children.length).toEqual(1);
    });

    it("should add to group", function() {
      var group = new Rune.Group();
      var circ = r.circle(10, 15, 200, group);
      expect(r.stage.children.length).toEqual(0);
      expect(group.children.length).toEqual(1);
    });

    it("should not add", function() {
      var circ = r.circle(10, 15, 200, false);
      expect(r.stage.children.length).toEqual(0)
    });

  });

  describe(".line()", function() {

    it("should create line", function() {
      var line = r.line(10, 15, 100, 105);
      expect(line.type).toEqual("line")
      expect(line.x).toEqual(10);
      expect(line.y).toEqual(15);
      expect(line.x2).toEqual(100);
      expect(line.y2).toEqual(105);
    });

    it("should add to stage", function() {
      var line = r.line(10, 15, 100, 105);
      expect(r.stage.children.length).toEqual(1);
    });

    it("should add to group", function() {
      var group = new Rune.Group();
      var line = r.line(10, 15, 100, 105, group);
      expect(r.stage.children.length).toEqual(0);
      expect(group.children.length).toEqual(1);
    });

    it("should not add", function() {
      var line = r.line(10, 15, 100, 105, false);
      expect(r.stage.children.length).toEqual(0)
    });

  });

  describe(".polygon()", function() {

    it("should create polygon", function() {
      var polygon = r.polygon(10, 15);
      expect(polygon.x).toEqual(10);
      expect(polygon.y).toEqual(15);
      expect(polygon.type).toEqual("polygon")
    });

    it("should add to stage", function() {
      var polygon = r.polygon();
      expect(r.stage.children.length).toEqual(1);
    });

    it("should add to group", function() {
      var group = new Rune.Group();
      var polygon = r.polygon(0, 0, group);
      expect(r.stage.children.length).toEqual(0);
      expect(group.children.length).toEqual(1);
    });

    it("should not add", function() {
      var polygon = r.polygon(0, 0, false);
      expect(r.stage.children.length).toEqual(0)
    });

  });

  describe(".shape()", function() {

    it("should create path", function() {
      var path = r.path(10, 15);
      expect(path.x).toEqual(10);
      expect(path.y).toEqual(15);
      expect(path.type).toEqual("path")
    });

    it("should add to stage", function() {
      var path = r.path();
      expect(r.stage.children.length).toEqual(1);
    });

    it("should add to group", function() {
      var group = new Rune.Group();
      var path = r.path(0, 0, group);
      expect(r.stage.children.length).toEqual(0);
      expect(group.children.length).toEqual(1);
    });

    it("should not add", function() {
      var path = r.path(0, 0, false);
      expect(r.stage.children.length).toEqual(0)
    });

  });

});
