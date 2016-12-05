describe("Rendering", function() {

  // These tests just test the basics of the virtual-dom
  // rendering. Each shape has their render() function
  // tested individually in the shape tests.

  var r;
  var el;

  beforeEach(function() {
    r = new Rune({ width:200, height:300 });
  });

  it("should create SVG element", function() {
    expect(r.el.tagName).toEqual('svg');
    expect(r.el.getAttribute('width')).toEqual('200');
    expect(r.el.getAttribute('height')).toEqual('300');
  });

  describe("All shapes", function() {

    it("should handle false state", function() {
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
      var rect = r.el.childNodes[0];
      expect(rect.tagName).toEqual("rect");
      expect(rect.getAttribute('fill')).toEqual("none")
      expect(rect.getAttribute('stroke')).toEqual("none")
      expect(rect.getAttribute('stroke-width')).toBeNull();
      expect(rect.getAttribute('stroke-linecap')).toBeNull();
      expect(rect.getAttribute('stroke-linejoin')).toBeNull();
      expect(rect.getAttribute('stroke-miterlimit')).toBeNull();
      expect(rect.getAttribute('stroke-dasharray')).toBeNull();
      expect(rect.getAttribute('stroke-dashoffset')).toBeNull();
    });

    // it('should handle gradients', function() {
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

    it("renders rotation with 0", function() {
      r.rect(0, 0, 0, 0)
        .rotate(45, 0, 10);
      r.draw();
      var rect = r.el.childNodes[0];
      expect(rect).toHaveRotation(45, 0, 10);
    });

  });

  describe("Rune.Grid", function() {

    it("should render grid", function() {
      var g = r.grid({
        x: 10,
        y: 15,
        gutterWidth: 20,
        gutterHeight: 30,
        moduleWidth: 40,
        moduleHeight: 50,
        columns: 4,
        rows: 3
      }).rotate(45);
      var ellipse = new Rune.Circle(10, 15, 100);
      g.add(ellipse, 2, 3)
      r.draw();

      var jgrid = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(jgrid.tagName).toEqual("g")
      expect(jgrid).toHaveTranslation(10, 15);
      expect(jgrid).toHaveRotation(45);

      var jmodule = jgrid.childNodes[0];
      expect(jmodule.tagName).toEqual("g");
      expect(jmodule).toHaveTranslation(60, 160);

      var ellip = jmodule.childNodes[0];
      expect(ellip.tagName).toEqual("circle");
      expect(ellip).toHaveAttrs({
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
      expect(r.el.childNodes.length).toBe(1)
    });

    it("should render cubic curve helpers", function() {
      r.debug = true;
      var p = r.path(10, 10);
      p.curveTo(100, 105, 200, 205, 300, 305).closePath();
      r.draw();
      expect(r.el.childNodes[1].tagName).toEqual('line')
      expect(r.el.childNodes[2].tagName).toEqual('line')
      expect(r.el.childNodes[3].tagName).toEqual('circle')
      expect(r.el.childNodes[4].tagName).toEqual('circle')
      expect(r.el.childNodes[5].tagName).toEqual('circle')

      expect(r.el.childNodes[1]).toHaveAttrs({x1: 110, y1: 115, x2:310, y2:315});
      expect(r.el.childNodes[2]).toHaveAttrs({x1: 210, y1: 215, x2:310, y2:315});
      expect(r.el.childNodes[3]).toHaveAttrs({cx: 110, cy: 115});
      expect(r.el.childNodes[4]).toHaveAttrs({cx: 210, cy: 215});
      expect(r.el.childNodes[5]).toHaveAttrs({cx: 310, cy: 315});
    });

    it("should render quad curve helpers", function() {
      r.debug = true;
      var p = r.path(10, 10);
      p.curveTo(200, 205, 300, 305).closePath();
      r.draw();
      expect(r.el.childNodes[1].tagName).toEqual('line')
      expect(r.el.childNodes[2].tagName).toEqual('circle')
      expect(r.el.childNodes[3].tagName).toEqual('circle')
      expect(r.el.childNodes[1]).toHaveAttrs({x1: 210, y1: 215, x2:310, y2:315});
      expect(r.el.childNodes[2]).toHaveAttrs({cx: 210, cy: 215});
      expect(r.el.childNodes[3]).toHaveAttrs({cx: 310, cy: 315});

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

      var child = r.el.childNodes[0];
      expect(child.tagName).toEqual("g");
      expect(child).toHaveTranslation(10, 15);

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

  })

});
