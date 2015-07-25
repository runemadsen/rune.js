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
    })

  });

  describe("on()", function() {

    describe("draw", function() {

      it("triggers draw event every 60fps", function(done) {
        var mock = { draw: function(){} };
        spyOn(mock, 'draw');
        var r = new Rune();
        r.on('draw', mock.draw);
        r.play();
        setTimeout(function() {
          expect(mock.draw.calls.count() > 55).toBe(true)
          expect(mock.draw.calls.count() < 65).toBe(true)
          done();
        }, 1000);
      }, 1010);

    });

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

  describe(".shape()", function() {

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
