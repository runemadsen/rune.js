beforeEach(function () {

  jasmine.addMatchers({

    toBeVectorMove: function () {
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

    toBeVectorLine: function () {
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

    toBeVectorCubic: function () {
      return {
        compare: function (vector, a, b, c, d, e, f, g) {

          var an = new Rune.Anchor();
          an.command = Rune.CUBIC;
          an.vec1 = new Rune.Vector(a, b);
          an.vec2 = new Rune.Vector(c, d);

          var msg = "";
          var pass = vector.command == an.command;
          pass = pass && vector.vec1.x == an.vec1.x;
          pass = pass && vector.vec1.y == an.vec1.y;
          pass = pass && vector.vec2.x == an.vec2.x;
          pass = pass && vector.vec2.y == an.vec2.y;

          if(_.isNumber(e)) {
            an.relative = g;
            an.vec3 = new Rune.Vector(e, f)
            pass = pass && vector.vec3.x == an.vec3.x;
            pass = pass && vector.vec3.y == an.vec3.y;
          } else {
            an.relative = e;
            pass = pass && _.isUndefined(vector.vec3);
          }

          pass = pass && vector.relative == an.relative;

          if (pass) {
            msg = "Expected not to match";
          } else {
            msg = "Expected " + JSON.stringify(vector) + " to match " + JSON.stringify(an);
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
          var pass = vector.command == Rune.QUAD;
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