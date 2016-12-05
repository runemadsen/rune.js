describe("Rune.Text", function() {

  var s;

  var textVars = {
    "textAlign" : "center",
    "fontFamily" : "Georgia",
    "fontStyle" : "italic",
    "fontWeight" : "bold",
    "fontSize" : 32,
    "letterSpacing" : 0.5,
    "textDecoration" : "underline"
  };

  function setTextVars(text) {
    _.each(textVars, function(v, k) {
      s[k](v);
    });
  }

  function expectTextVars(text) {
    _.each(textVars, function(v, k) {
      expect(s.state[k]).toEqual(v);
    });
  }

  beforeEach(function() {
    s = new Rune.Text("Hello", 10, 15);
  });

  describe("Common text state", function() {

    it("sets var", function() {
      setTextVars(s);
      expectTextVars(s);
    });

    it("is chainable", function() {
      _.each(textVars, function(v, k) {
        var res = s[k](v);
        expect(res).toBe(res);
      });
    });

  });

  describe("toPolygon()", function() {

    it("throws error if Rune.Font is not present", function() {
      expect( function(){ s.toPolygon() } ).toThrow(new Error("You need the Rune.Font plugin to convert text to polygon"));
    });

  });

  describe("copy()", function() {
    it("has shared copy functionality", function() {
      setTextVars(s);
      expectCopy(s);
    });
  });

  describe('scale()', function() {
    it("scales the rectangle", function() {
      spyOn(s, 'scaleStyles');
      s.scale(2);
      expect(s.state.x).toEqual(10);
      expect(s.state.y).toEqual(15);
      expect(s.state.fontSize).toEqual(32);
      expect(s.scaleStyles).toHaveBeenCalledWith(2);
    });
  });

  describe("render()", function() {

    var r;
    var s;
    beforeEach(function() {
      r = new Rune();
      s = r.text("Hello", 10, 15);
    });

    it("should render text", function() {
      r.draw();
      var el = r.el.childNodes[0];
      expect(el.tagName).toEqual("text");
      expect(el.getAttribute('x')).toEqual('10');
      expect(el.getAttribute('y')).toEqual('15');
      expect(el.getAttribute('transform')).toBeNull();
      expect(el.childNodes[0].data).toEqual("Hello")
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
        expect(r.el.childNodes[0].getAttribute(v[0])).toEqual(v[1].toString());
      });
    });

    it('should render textAlign', function() {
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
