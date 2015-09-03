import _ from 'underscore'
import Helpers from '../helpers'

describe("Rune.Text", function() {

  var s;

  beforeEach(function() {
    s = new Rune.Text("Hello", 10, 15);
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

    it("sets var", function() {
      _.each(setters, function(v, k) {
        s[k](v);
        expect(s.vars[k]).toEqual(v);
      });
    });

    it("is chainable", function() {
      _.each(setters, function(v, k) {
        var res = s[k](v);
        expect(res).toBe(res);
      });
    });

  });

  describe("toPolygon", function() {

    it("throws error if Rune.Font is not present", function() {
      expect( function(){ s.toPolygon() } ).toThrow(new Error("You need the Rune.Font plugin to convert text to polygon"));
    });

  });

  describe("copy()", function() {

    var g;

    beforeEach(function() {
      g = new Rune.Group();
      g.add(s);
    });

    it("copies the object", function() {
      Helpers.setMixinVars(s);
      var copy = s.copy();
      expect(copy).not.toBe(s);
      expect(copy).toEqual(s);
    });

    it("adds copy to parent", function() {
      expect(g.children.length).toEqual(1);
      s.copy();
      expect(g.children.length).toEqual(2);
    });

    it("does not add copy to parent", function() {
      expect(g.children.length).toEqual(1);
      s.copy(false);
      expect(g.children.length).toEqual(1);
    });

  });

});