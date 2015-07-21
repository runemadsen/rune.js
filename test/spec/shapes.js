describe("Rune", function() {

  var r;

  beforeEach(function() {
    r = new Rune();
  });

  describe(".rect()", function() {

    it("should create rect", function() {
      var rectangle = r.rect(10, 15, 200, 100);
      expect(rectangle.type).toEqual("rectangle")
      expect(rectangle.loc.x).toEqual(10);
      expect(rectangle.loc.y).toEqual(15);
      expect(rectangle.siz.x).toEqual(200);
      expect(rectangle.siz.y).toEqual(100);
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
      expect(ellipse.loc.x).toEqual(10);
      expect(ellipse.loc.y).toEqual(15);
      expect(ellipse.siz.x).toEqual(200);
      expect(ellipse.siz.y).toEqual(100);
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
      expect(circ.loc.x).toEqual(10);
      expect(circ.loc.y).toEqual(15);
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
      expect(line.loc.x).toEqual(10);
      expect(line.loc.y).toEqual(15);
      expect(line.end.x).toEqual(100);
      expect(line.end.y).toEqual(105);
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
      var polygon = r.polygon();
      expect(polygon.type).toEqual("polygon")
    });

    it("should add to stage", function() {
      var polygon = r.polygon();
      expect(r.stage.children.length).toEqual(1);
    });

    it("should add to group", function() {
      var group = new Rune.Group();
      var polygon = r.polygon(group);
      expect(r.stage.children.length).toEqual(0);
      expect(group.children.length).toEqual(1);
    });

    it("should not add", function() {
      var polygon = r.polygon(false);
      expect(r.stage.children.length).toEqual(0)
    });

  });

  describe(".shape()", function() {

    it("should create path", function() {
      var path = r.path();
      expect(path.type).toEqual("path")
    });

    it("should add to stage", function() {
      var path = r.path();
      expect(r.stage.children.length).toEqual(1);
    });

    it("should add to group", function() {
      var group = new Rune.Group();
      var path = r.path(group);
      expect(r.stage.children.length).toEqual(0);
      expect(group.children.length).toEqual(1);
    });

    it("should not add", function() {
      var path = r.path(false);
      expect(r.stage.children.length).toEqual(0)
    });

  });

});
