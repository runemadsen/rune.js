import _ from "underscore"

beforeEach(function () {

  jasmine.addMatchers({

    toBeChildOf: function() {
      return {
        compare: function (child, parent) {

          var hasChild = _.any(parent.children, function(c) {
            return c == child;
          });

          var isChild = child.parent === parent;
          var pass = hasChild && isChild;
          var msg;

          if(pass) {
            msg = "Expected to not be child of parent"
          } else {
            msg = "Expected to be child of parent"
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    },

    // Matcher that takes two object and makes sure that all the
    // keys in subset matches the same key in full. Full may have
    // extra values.
    toBeIn: function() {
      return {
        compare: function (subset, full) {

          var noMatches = _.filter(subset, function(v, k) {
            return !_.isEqual(full[k], v);
          });

          var msg;
          var pass = noMatches.length == 0;

          if(pass) {
            msg = "Expected " + noMatches + " not to be in object"
          } else {
            msg = "Expected " + noMatches + " to be in object"
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    },

    toEqualVector: function () {
      return {
        compare: function (vec, x, y) {

          var msg;
          var pass = vec.x == x && vec.y == y;

          if (pass) {
            msg = "Expected " + vec + " not to equal vector " + new Rune.Vector(x, y);
          } else {
            msg = "Expected " + vec + " to equal vector " + new Rune.Vector(x, y);
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    },

    toBeTag: function () {
      return {
        compare: function (el, tagname) {

          var msg;
          var pass = el.tagName == tagname;

          if (pass) {
            msg = "Expected not to be tag " + tagname;
          } else {
            msg = "Expected " + el.tagName + " to be tag " + tagname;
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    },

    toHaveAttr : function() {
      return {
        compare: function (el, k, v) {
          var att = el.getAttribute(k);
          var result = {
            pass: true,
            message: "yup"
          }
          if(att != v + "") {
            result.pass = false;
            result.message = "Attribute " + k + " with value " + att + " did not match " + v;
          }
          return result;
        }
      };
    },

    toNotHaveAttr : function() {
      return {
        compare: function (el, k, v) {
          var att = el.getAttribute(k);
          var result = {
            pass: _.isUndefined(att) || att == null,
            message: "something"
          }
          return result;
        }
      };
    },

    toHaveAttrs : function() {
      return {
        compare: function (el, attrs) {
          var result = {
            message: ""
          }
          result.pass = _.all(attrs, function(v, k) {
            var att = el.getAttribute(k);
            if(att != v + "")
              result.message = "Attribute " + k + " with value " + att + " did not match " + v;
            return att == v
          });
          return result;
        }
      };
    },

    toHaveRotation : function() {
      return {
        compare: function (el, rotation, rotationX, rotationY) {
          var result = {
            pass: true,
            message: "Has rotation when it shouldn't"
          }

          var attr = "rotate(" + rotation;
          if(rotationX || rotationY)
            attr += " " + rotationX + " " + rotationY;
          attr += ")";

          if(!el.getAttribute("transform") || el.getAttribute("transform").indexOf(attr) < 0) {
            result.pass = false;
            result.message = "Transform does not have rotation or doesnt match: " + el.getAttribute("transform");
          }
          return result;
        }
      };
    },

    toHaveTranslation : function() {
      return {
        compare: function (el, x, y) {
          var result = {
            pass: true,
            message: "Has translation when it shouldn't"
          }
          if(!el.getAttribute("transform") || el.getAttribute("transform").indexOf("translate("+ x + " " + y +")") < 0) {
            result.pass = false;
            result.message = "Transform does not have translation";
          }
          return result;
        }
      };
    },

    toBeAnchorMove: function () {
      return {
        compare: function (vector, x, y) {

          var a = new Rune.Anchor();
          a.command = 'move';
          a.vec1 = new Rune.Vector(x, y);

          var msg = "";
          var pass = vector.command == a.command;
          pass = pass && vector.vec1.x == a.vec1.x;
          pass = pass && vector.vec1.y == a.vec1.y;
          pass = pass && _.isUndefined(vector.vec2);
          pass = pass && _.isUndefined(vector.vec3);

          if (pass) {
            msg = "Expected not to match";
          } else {
            msg = "Expected " + JSON.stringify(vector) + " to match " + JSON.stringify(a);
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    },

    toBeAnchorLine: function () {
      return {
        compare: function (vector, x, y) {

          var a = new Rune.Anchor();
          a.command = 'line';
          a.vec1 = new Rune.Vector(x, y);

          var msg = "";
          var pass = vector.command == a.command;
          pass = pass && vector.vec1.x == a.vec1.x;
          pass = pass && vector.vec1.y == a.vec1.y;
          pass = pass && _.isUndefined(vector.vec2);
          pass = pass && _.isUndefined(vector.vec3);

          if (pass) {
            msg = "Expected not to match";
          } else {
            msg = "Expected " + JSON.stringify(vector) + " to match " + JSON.stringify(a);
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    },

    toBeAnchorCubic: function () {
      return {
        compare: function (anchor, a, b, c, d, e, f) {
          var expected = new Rune.Anchor();
          expected.command = 'cubic';
          expected.vec1 = new Rune.Vector(a, b);
          expected.vec2 = new Rune.Vector(c, d);
          expected.vec3 = new Rune.Vector(e, f)
          return {
            pass: _.isEqual(anchor, expected),
            message: "Actual: " + JSON.stringify(anchor) + ", expected: " + JSON.stringify(expected)
          };
        }
      };
    },

    toBeAnchorQuad: function () {
      return {
        compare: function (anchor, a, b, c, d) {
          var expected = new Rune.Anchor();
          expected.command = 'quad';
          expected.vec1 = new Rune.Vector(a, b);
          expected.vec2 = new Rune.Vector(c, d);
          return {
            pass: _.isEqual(anchor, expected),
            message: "Actual: " + JSON.stringify(anchor) + ", expected: " + JSON.stringify(expected)
          }
        }
      };
    },

    toBeAnchorClose: function () {
      return {
        compare: function (vector) {

          var msg = "";
          var pass = vector.command == 'close';

          if (pass) {
            msg = "Expected not to match";
          } else {
            msg = "Expected to match";
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    }
  });

});