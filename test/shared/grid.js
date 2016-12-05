describe("Rune.Grid", function() {

  describe("constructor", function() {

    it("has default settings", function() {
      var grid = new Rune.Grid();
      expect(grid.state.x).toEqual(0);
      expect(grid.state.y).toEqual(0);
      expect(grid.state.gutterWidth).toEqual(0);
      expect(grid.state.gutterHeight).toEqual(0);
      expect(grid.state.columns).toEqual(10);
      expect(grid.state.rows).toEqual(1);
      expect(grid.state.moduleWidth).toEqual(50);
      expect(grid.state.moduleHeight).toEqual(500);
      expect(grid.state.width).toEqual(500);
      expect(grid.state.height).toEqual(500);
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

      expect(grid.state.x).toEqual(0);
      expect(grid.state.y).toEqual(0);
      expect(grid.state.gutterWidth).toEqual(15);
      expect(grid.state.gutterHeight).toEqual(20);
      expect(grid.state.columns).toEqual(10);
      expect(grid.state.rows).toEqual(5);
      expect(grid.state.moduleWidth).toEqual(50);
      expect(grid.state.moduleHeight).toEqual(40);
      expect(grid.state.width).toEqual(635);
      expect(grid.state.height).toEqual(280);

      expect(grid.modules.length).toBe(50);
      expect(grid.modules[0].type).toEqual("group");
      expect(grid.modules[0].state.x).toEqual(0);
      expect(grid.modules[0].state.y).toEqual(0);
      expect(grid.modules[14].type).toEqual("group");
      expect(grid.modules[14].state.x).toEqual(260);
      expect(grid.modules[14].state.y).toEqual(60);
    });

    it("works with gutter shorthand", function() {
      var grid = new Rune.Grid({
        gutter: 15,
        width: 600,
        height: 500,
        columns: 10,
        rows: 5
      });
      expect(grid.state.x).toEqual(0);
      expect(grid.state.y).toEqual(0);
      expect(grid.state.gutterWidth).toEqual(15);
      expect(grid.state.gutterHeight).toEqual(15);
      expect(grid.state.columns).toEqual(10);
      expect(grid.state.rows).toEqual(5);
      expect(grid.state.moduleWidth).toEqual(46.5);
      expect(grid.state.moduleHeight).toEqual(88);
      expect(grid.state.width).toEqual(600);
      expect(grid.state.height).toEqual(500);
    });

    it("works with no gutter", function() {
      var grid = new Rune.Grid({
        width: 600,
        height: 500,
        columns: 10,
        rows: 5
      });
      expect(grid.state.x).toEqual(0);
      expect(grid.state.y).toEqual(0);
      expect(grid.state.gutterWidth).toEqual(0);
      expect(grid.state.gutterHeight).toEqual(0);
      expect(grid.state.columns).toEqual(10);
      expect(grid.state.rows).toEqual(5);
      expect(grid.state.moduleWidth).toEqual(60);
      expect(grid.state.moduleHeight).toEqual(100);
      expect(grid.state.width).toEqual(600);
      expect(grid.state.height).toEqual(500);
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
      expect(module.state.x).toEqual(60);
      expect(module.state.y).toEqual(120);
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

  describe("render()", function() {

    it("should render grid", function() {
      var r = new Rune();
      var g = r.grid({
        x: 10,
        y: 15,
        gutterWidth: 20,
        gutterHeight: 30,
        moduleWidth: 40,
        moduleHeight: 50,
        columns: 4,
        rows: 3
      });
      var ellipse = new Rune.Circle(10, 15, 100);
      g.add(ellipse, 2, 3)
      r.draw();

      var el = r.el.childNodes[0];
      expect(el.tagName).toEqual("g")
      expect(el.getAttribute('transform')).toEqual('translate(10 15)');

      var mod = el.childNodes[0];
      expect(mod.tagName).toEqual("g");
      expect(mod.getAttribute('transform')).toEqual('translate(60 160)');

      var shape = mod.childNodes[0];
      expect(shape.tagName).toEqual("circle");
      expect(shape.getAttribute('cx')).toEqual('10');
      expect(shape.getAttribute('cy')).toEqual('15');
      expect(shape.getAttribute('r')).toEqual('100');
    });

    it("should render helpers in debug mode", function() {
      var r = new Rune({ debug: true });
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

      var child = r.el.childNodes[0];
      expect(child.tagName).toEqual("g");
      expect(child.getAttribute('transform')).toEqual('translate(10 15)');
      expect(child.childNodes[0].tagName).toEqual('rect')
      _.times(8, function(i) { expect(child.childNodes[i + 1].tagName).toEqual('line') });
      expect(child.childNodes[0]).toHaveAttrs({x: 0, y: 0, width:115, height:130});
      expect(child.childNodes[1]).toHaveAttrs({x1: 25, y1: 0, x2:25, y2:grid.state.height});
      expect(child.childNodes[2]).toHaveAttrs({x1: 45, y1: 0, x2:45, y2:grid.state.height});
      expect(child.childNodes[3]).toHaveAttrs({x1: 70, y1: 0, x2:70, y2:grid.state.height});
      expect(child.childNodes[4]).toHaveAttrs({x1: 90, y1: 0, x2:90, y2:grid.state.height});
      expect(child.childNodes[5]).toHaveAttrs({x1: 0, y1: 30, x2:grid.state.width, y2:30});
      expect(child.childNodes[6]).toHaveAttrs({x1: 0, y1: 50, x2:grid.state.width, y2:50});
      expect(child.childNodes[7]).toHaveAttrs({x1: 0, y1: 80, x2:grid.state.width, y2:80});
      expect(child.childNodes[8]).toHaveAttrs({x1: 0, y1: 100, x2:grid.state.width, y2:100});
    });

  });

});
