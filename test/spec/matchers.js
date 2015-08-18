beforeEach(function () {

  jasmine.addMatchers({

    toEqualVector: function () {
      return {
        compare: function (vec, x, y) {

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
        compare: function (jel, tagname) {

          var pass = jel.prop("tagName") == tagname;

          if (pass) {
            msg = "Expected not to be tag " + tagname;
          } else {
            msg = "Expected " + jel.prop("tagName") + " to be tag " + tagname;
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
        compare: function (jel, k, v) {
          jel = $(jel);
          var result = {
            pass: true,
            message: "yup"
          }
          if(jel.attr(k) != v + "") {
            result.pass = false;
            result.message = "Attribute " + k + " with value " + jel.attr(k) + " did not match " + v;
          }
          return result;
        }
      };
    },

    toHaveAttrs : function() {
      return {
        compare: function (jel, attrs) {
          jel = $(jel);
          var result = {
            message: ""
          }
          result.pass = _.all(attrs, function(v, k) {
            if(jel.attr(k) != v + "")
              result.message = "Attribute " + k + " with value " + jel.attr(k) + " did not match " + v;
            return jel.attr(k) == v
          });
          return result;
        }
      };
    },

    toHaveRotation : function() {
      return {
        compare: function (jel, rotation, rotationX, rotationY) {
          var result = {
            pass: true,
            message: "Has rotation when it shouldn't"
          }

          var attr = "rotate(" + rotation;
          if(rotationX || rotationY)
            attr += " " + rotationX + " " + rotationY;
          attr += ")";

          if(!jel.attr("transform") || jel.attr("transform").indexOf(attr) < 0) {
            result.pass = false;
            result.message = "Transform does not have rotation or doesnt match: " + jel.attr("transform");
          }
          return result;
        }
      };
    },

    toHaveTranslation : function() {
      return {
        compare: function (jel, x, y) {
          var result = {
            pass: true,
            message: "Has translation when it shouldn't"
          }
          if(!jel.attr("transform") || jel.attr("transform").indexOf("translate("+ x + " " + y +")") < 0) {
            result.pass = false;
            result.message = "Transform does not have translation";
          }
          return result;
        }
      };
    },

    toBeAnchorMove: function () {
      return {
        compare: function (vector, x, y, relative) {

          var a = new Rune.Anchor();
          a.command = 'move';
          a.relative = relative;
          a.vec1 = new Rune.Vector(x, y);

          var msg = "";
          var pass = vector.command == a.command;
          pass = pass && vector.relative == a.relative;
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
        compare: function (vector, x, y, relative) {

          var a = new Rune.Anchor();
          a.command = 'line';
          a.relative = relative;
          a.vec1 = new Rune.Vector(x, y);

          var msg = "";
          var pass = vector.command == a.command;
          pass = pass && vector.relative == a.relative;
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
        compare: function (anchor, a, b, c, d, e, f, g) {
          var expected = new Rune.Anchor();
          expected.command = 'cubic';
          expected.vec1 = new Rune.Vector(a, b);
          expected.vec2 = new Rune.Vector(c, d);
          expected.vec3 = new Rune.Vector(e, f)
          expected.relative = g === true;
          return {
            pass: _.isEqual(anchor, expected),
            message: "Actual: " + JSON.stringify(anchor) + ", expected: " + JSON.stringify(expected)
          };
        }
      };
    },

    toBeAnchorQuad: function () {
      return {
        compare: function (anchor, a, b, c, d, e) {
          var expected = new Rune.Anchor();
          expected.command = 'quad';
          expected.vec1 = new Rune.Vector(a, b);
          expected.vec2 = new Rune.Vector(c, d);
          expected.relative = e === true;
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