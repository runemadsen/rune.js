describe("Rune.Grid", function() {

  // you can add it to the stage via r.grid()

  describe("constructor", function() {

    it("has default settings", function() {
      var grid = new Rune.Grid();
      expect(grid.vars.x).toEqual(0);
      expect(grid.vars.y).toEqual(0);
      expect(grid.vars.gutterWidth).toEqual(0);
      expect(grid.vars.gutterHeight).toEqual(0);
      expect(grid.vars.columns).toEqual(10);
      expect(grid.vars.rows).toEqual(1);
      expect(grid.vars.moduleWidth).toEqual(50);
      expect(grid.vars.moduleHeight).toEqual(500);
      expect(grid.vars.width).toEqual(500);
      expect(grid.vars.height).toEqual(500);
    });

    it("works with all variables", function() {
      var grid = new Rune.Grid({
        gutterWidth: 15,
        gutterHeight: 20,
        moduleWidth: 50,
        moduleHeight: 40,
        columns: 10,
        rows: 5
      });

      expect(grid.vars.x).toEqual(0);
      expect(grid.vars.y).toEqual(0);
      expect(grid.vars.gutterWidth).toEqual(15);
      expect(grid.vars.gutterHeight).toEqual(20);
      expect(grid.vars.columns).toEqual(10);
      expect(grid.vars.rows).toEqual(5);
      expect(grid.vars.moduleWidth).toEqual(50);
      expect(grid.vars.moduleHeight).toEqual(40);
      expect(grid.vars.width).toEqual(635);
      expect(grid.vars.height).toEqual(280);

      expect(grid.modules.length).toBe(50);
      expect(grid.modules[0].type).toEqual("group");
      expect(grid.modules[0].vars.x).toEqual(0);
      expect(grid.modules[0].vars.y).toEqual(0);
      expect(grid.modules[14].type).toEqual("group");
      expect(grid.modules[14].vars.x).toEqual(260);
      expect(grid.modules[14].vars.y).toEqual(60);
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
      expect(grid.vars.gutterWidth).toEqual(15);
      expect(grid.vars.gutterHeight).toEqual(15);
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
      expect(grid.vars.gutterWidth).toEqual(0);
      expect(grid.vars.gutterHeight).toEqual(0);
      expect(grid.vars.columns).toEqual(10);
      expect(grid.vars.rows).toEqual(5);
      expect(grid.vars.moduleWidth).toEqual(60);
      expect(grid.vars.moduleHeight).toEqual(100);
      expect(grid.vars.width).toEqual(600);
      expect(grid.vars.height).toEqual(500);
    });

  });

  describe("getModule()", function() {

    it("returns the correct module", function() {
      var grid = new Rune.Grid({
        gutter: 10,
        moduleWidth: 50,
        moduleHeight: 50,
        columns: 3,
        rows: 3
      });
      var module = grid.getModule(2, 3)
      expect(module.type).toEqual("group")
      expect(module.vars.x).toEqual(60);
      expect(module.vars.y).toEqual(120);
    });

  });

  describe("add()", function() {

    it("adds child to module and sets parent", function() {
      var g = new Rune.Grid({columns:10, rows:10});
      var s = new Rune.Ellipse();

      var mod = g.getModule(2, 3);
      expect(mod.children.length).toBe(0);
      expect(s.parent).toBeUndefined();

      g.add(s, 2, 3);

      var mod = g.getModule(2, 3);
      expect(mod.children[0]).toBe(s);
      expect(s.parent).toBe(mod);
    });

    it("removes child from parent", function() {
      var group = new Rune.Group({columns:10, rows:10});
      var grid = new Rune.Grid({columns:10, rows:10});
      var s = new Rune.Ellipse();

      group.add(s);
      expect(s.parent).toBe(group);
      expect(group.children[0]).toBe(s);

      grid.add(s, 2, 3);

      var mod = grid.getModule(2, 3);
      expect(s.parent).toBe(mod);
      expect(group.children.length).toBe(0);
      expect(mod.children[0]).toBe(s);
    });

  });

  // copy

  // you can add object into the modules
  // add(object, col, row)

  // TODO: you can change the grid dimensions to have all objects move
  // but if you added an object and moved it, it's going to move it
  // relative to the new position.

});
