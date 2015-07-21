describe("Rune", function() {

  var r;

  beforeEach(function() {
    r = new Rune();
  });

  describe(".rect()", function() {

    it("should create rect", function() {
      var rectangle = r.rect(10, 15, 200, 100);
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

});
