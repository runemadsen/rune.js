beforeEach(function () {

  jasmine.addMatchers({

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
            result.message = "Transform does not have rotation";
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
          a.command = Rune.MOVE;
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
          a.command = Rune.LINE;
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
          expected.command = Rune.CUBIC;
          expected.vec1 = new Rune.Vector(a, b);
          expected.vec2 = new Rune.Vector(c, d);

          if(_.isNumber(e)) {
            expected.relative = g;
            expected.vec3 = new Rune.Vector(e, f)
          } else {
            expected.relative = e;
          }

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
          expected.command = Rune.QUAD;
          expected.vec1 = new Rune.Vector(a, b);
          if(_.isNumber(c)) {
            expected.vec2 = new Rune.Vector(c, d);
            expected.relative = e === true;
          } else {
            expected.relative = c === true;
          }

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
          var pass = vector.command == Rune.CLOSE;

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