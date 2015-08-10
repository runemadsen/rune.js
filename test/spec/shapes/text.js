describe("Rune.Text", function() {

  var t;

  beforeEach(function() {
    t = new Rune.Text("Hello", 10, 15);
  });

  describe("Common setters", function() {

    var setters = {
      "textAlign" : "center",
      "fontFamily" : "Georgia",
      "fontStyle" : "italic",
      "fontWeight" : "bold",
      "fontSize" : 32,
      "letterSpacing" : 0.5,
      "textDecoration" : "underline"
    };

    it("sets var and is chainable", function() {
      _.each(setters, function(v, k) {
        var res = t[k](v);
        expect(res.vars[k]).toEqual(v);
        expect(res).toBe(res);
      });
    });

  });

  describe("copy()", function() {

    var g;

    beforeEach(function() {
      g = new Rune.Group();
      g.add(t);
    });

    it("copies the object", function() {
      setMixinVars(t);
      var copy = t.copy();
      expect(copy === t).toEqual(false);
      expect(copy).toEqual(t);
    });

    it("calls shapeCopy", function() {
      spyOn(t, "shapeCopy");
      t.copy(g);
      expect(t.shapeCopy).toHaveBeenCalled();
    });

  });

});