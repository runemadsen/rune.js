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

  describe("Rune.Path", function() {

    it("should render path", function() {
      var s = r.path(10, 15);
      drawShared(s);
      setAllAnchors(s);
      r.draw();
      var path = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(path.tagName).toEqual("path");
      expect(path).toHaveAttr("d", "M 0 0 L 104 105 M 106 107 C 108 109 110 111 112 113 Q 114 115 116 117 Z")
      expect(path).toHaveTranslation(10, 15);
      expectShared(path);
    });

    it("should render optional state", function() {

      var optionals = {
        fillRule: ["fill-rule", "evenodd"]
      }

      _.each(optionals, function(val, func) {
        var shape = r.path(10, 15);
        r.draw();
        expect(r.el.childNodes[0].getAttribute(val[0])).toBeNull();
        shape[func](val[1]);
        r.draw();
        expect(r.el.childNodes[0].getAttribute(val[0])).toEqual(val[1] + "");
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
      var text = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(text.tagName).toEqual("text");
      expect(text).toHaveAttrs({
        x: s.state.x,
        y: s.state.y
      });
      expect(text).not.toHaveTranslation(10, 15);
      expect(text.childNodes[0].data).toEqual("Hello")
      expectShared(text);
    });

    it("should render optional state", function() {

      var optionals = {
        fontFamily: ["font-family", "Georgia"],
        fontWeight: ["font-weight", "bold"],
        letterSpacing: ["letter-spacing", 0.5],
        textDecoration: ["text-decoration", "underline"]
      }

      _.each(optionals, function(v, k) {
        r.draw();
        expect(r.el.childNodes[0].getAttribute(v[0])).toBeNull();
        s[k](v[1]);
        r.draw();
        expect(r.el.childNodes[0].getAttribute(v[0])).toEqual(v[1] + "");
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
          var jshape = r.el.childNodes[0];
          expect(jshape).toHaveAttr("text-anchor", align[1]);
        });
      });

    });

  });

  describe("Rune.Image", function() {

    it("should render image", function() {
      r.image("myimage.jpg", 10, 15);
      r.draw();
      var img = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(img.tagName).toEqual("image");
      expect(img).toHaveAttrs({
        x: 10,
        y: 15
      });
      expect(img.getAttributeNS("http://www.w3.org/1999/xlink", "href")).toEqual("myimage.jpg")
      expect(img).not.toHaveAttrs({ width: 0, height: 0 });
      expect(img).not.toHaveTranslation(10, 15);
    });

    it("should render width and height if set", function() {
      r.image("myimage.jpg", 10, 15, 300, 400);
      r.draw();
      var img = r.el.childNodes[0];
      expect(img).toHaveAttrs({
        width: 300,
        height: 400
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

      var jgroup = r.el.childNodes[0];
      expect(r.el.childNodes.length).toEqual(1);
      expect(jgroup.tagName).toEqual("g");
      expect(jgroup).toHaveTranslation(10, 15);
      expect(jgroup).toHaveRotation(g.state.rotation);

      var jellipse = jgroup.childNodes[0];
      expect(jellipse.tagName).toEqual("circle");
      expect(jellipse).toHaveAttrs({
        cx: 10,
        cy: 15,
        r: 100
      });
    });

    it("should not render if empty", function() {
      var g = r.group(10, 15);
      r.draw();
      expect(r.el.childNodes.length).toEqual(0);
    });

    it("should rerender if child group changed", function() {
      var parent = r.group(10, 15);
      var child = r.group(20, 25, parent);
      var c = r.circle(10, 15, 100, child);
      r.draw();
      c.move(1, 2, true);
      r.draw();
      var jcirc = r.el.childNodes[0].childNodes[0].childNodes[0];
      expect(jcirc.tagName).toEqual("circle");
      expect(jcirc).toHaveAttrs({
        cx: 11,
        cy: 17,
        r: 100
      });

    });

    it("should render in group if moved from stage to group", function() {
      var c = r.circle(10, 15, 100);
      var parent = r.group(10, 15);
      parent.add(c);
      r.draw();
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
