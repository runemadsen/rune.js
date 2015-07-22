beforeEach(function () {

  jasmine.addMatchers({

    toBeVectorMove: function () {
      return {
        compare: function (vector, x, y, relative) {

          var msg = "";
          var pass = true;
          pass = pass && vector.command == Rune.MOVE;
          pass = pass && vector.relative == relative;
          pass = pass && vector.vec1.x == x;
          pass = pass && vector.vec1.y == y;
          pass = pass && _.isUndefined(vector.vec2);
          pass = pass && _.isUndefined(vector.vec3);

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
    },

    toBeVectorLine: function () {
      return {
        compare: function (vector, x, y, relative) {

          var msg = "";
          var pass = true;
          pass = pass && vector.command == Rune.LINE;
          pass = pass && vector.relative == relative;
          pass = pass && vector.vec1.x == x;
          pass = pass && vector.vec1.y == y;
          pass = pass && _.isUndefined(vector.vec2);
          pass = pass && _.isUndefined(vector.vec3);

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
    },

    toBeVectorCubic: function () {
      return {
        compare: function (vector, a, b, c, d, e, f, g) {

          var msg = "";
          var pass = true;
          pass = pass && vector.command == Rune.CUBIC;

          pass = pass && vector.vec1.x == a;
          pass = pass && vector.vec1.y == b;
          pass = pass && vector.vec2.x == c;
          pass = pass && vector.vec2.y == d;

          if(_.isNumber(e)) {
            pass = pass && vector.vec3.x == e;
            pass = pass && vector.vec3.y == f;
            pass = pass && vector.relative == g;
          } else {
            pass = pass && vector.relative == e;
            pass = pass && _.isUndefined(vector.vec3);
          }


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
    },

    toBeVectorQuad: function () {
      return {
        compare: function (vector, a, b, c, d, e) {

          var msg = "";
          var pass = true;
          pass = pass && vector.command == Rune.QUAD;

          pass = pass && vector.vec1.x == a;
          pass = pass && vector.vec1.y == b;

          if(_.isNumber(c)) {
            pass = pass && vector.vec2.x == c;
            pass = pass && vector.vec2.y == d;
            pass = pass && vector.relative == e;
          } else {
            pass = pass && vector.relative == c;
            pass = pass && _.isUndefined(vector.vec2);
          }

          pass = pass && _.isUndefined(vector.vec3);


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