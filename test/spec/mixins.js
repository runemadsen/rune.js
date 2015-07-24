describe("Rune.Mixins", function() {

  var m;

  describe("Moveable", function() {

    beforeEach(function() {
      m = newMixin(Rune.Mixins.Moveable);
      m.moveable();
    });

    describe("moveable()", function() {

      it("assigns default variables", function() {
        expect(typeof m.moveable).toEqual("function");
        expect(m.vars.x).toEqual(0);
        expect(m.vars.y).toEqual(0);
        expect(m.vars.rotation).toEqual(0);
      });

      it("copies variables from object", function() {
        m.vars.x = 10;
        m.vars.y = 10;
        m.vars.rotation = 45;
        var m2 = newMixin(Rune.Mixins.Moveable);
        m2.moveable(m);
        expect(m2.vars.x).toEqual(10);
        expect(m2.vars.y).toEqual(10);
        expect(m2.vars.rotation).toEqual(45);
      });

    });

    describe("move()", function() {

      it("moves absolute", function() {
        m.vars.x = 100;
        m.vars.y = 105;
        var res = m.move(200, 205);
        expect(m.vars.x).toEqual(200);
        expect(m.vars.y).toEqual(205);
        expect(m).toEqual(res);
      });

      it("moves relative", function() {
        m.vars.x = 100;
        m.vars.y = 105;
        var res = m.move(200, 205, true);
        expect(m.vars.x).toEqual(300);
        expect(m.vars.y).toEqual(310);
        expect(m).toEqual(res);
      });

    });

    describe("rotate()", function() {

      it("rotates absolute", function() {
        m.vars.rotation = 45;
        var res = m.rotate(45);
        expect(m.vars.rotation).toEqual(45);
        expect(m).toEqual(res);
      });

      it("rotates relative", function() {
        m.vars.rotation = 45;
        var res = m.rotate(45, true);
        expect(m.vars.rotation).toEqual(90);
        expect(m).toEqual(res);
      });

    });

  });

  describe("Sizeable", function() {

    beforeEach(function() {
      m = newMixin(Rune.Mixins.Sizeable);
      m.sizeable();
    });

    describe("sizeable()", function() {

      it("assigns default variables", function() {
        expect(typeof m.sizeable).toEqual("function");
        expect(m.vars.width).toEqual(0);
        expect(m.vars.height).toEqual(0);
      });

      it("copies variables from object", function() {
        m.vars.width = 10;
        m.vars.height = 15;
        var m2 = newMixin(Rune.Mixins.Sizeable);
        m2.sizeable(m);
        expect(m2.vars.width).toEqual(10);
        expect(m2.vars.height).toEqual(15);
      });

    });



  });

  describe("Styleable", function() {

    beforeEach(function() {
      m = newMixin(Rune.Mixins.Styleable);
      m.styleable();
    });

    describe("styleable()", function() {

      it("assigns default variable", function() {
        expect(typeof m.styleable).toEqual("function");
        expect(m.vars.fill).toEqual(new Color());
        expect(m.vars.stroke).toEqual(new Color());
      });

      it("copies variables from object", function() {
        m.fill("#FF0000").stroke("#00FF00")
        var m2 = newMixin(Rune.Mixins.Styleable);
        m2.styleable(m);
        expect(m2.vars.fill).toEqual(new Color().rgb(255, 0, 0));
        expect(m2.vars.stroke).toEqual(new Color().rgb(0, 255, 0));
      });

    });



    describe("fill()", function() {

      it("sets fill to color", function() {
        var res = m.fill("#ff0000");
        expect(m.vars.fill).toEqual(new Color().rgb(255, 0, 0));
        expect(m).toEqual(res);
      });

      it("sets fill to false", function() {
        m.fill(false);
        expect(m.vars.fill).toEqual(false);
      });

    });

    describe("stroke()", function() {

      it("sets stroke to color", function() {
        var res = m.stroke("#ff0000");
        expect(m.vars.stroke).toEqual(new Color().rgb(255, 0, 0));
        expect(m).toEqual(res);
      });

      it("sets stroke to false", function() {
        m.stroke(false);
        expect(m.vars.stroke).toEqual(false);
      });

    });

    describe("Basic setters", function() {

      it("sets the var value", function() {
        var funcs = ["strokeWidth", "strokeCap", "strokeJoin", "strokeMiterlimit", "strokeDash", "strokeDashOffset"]
        _.each(funcs, function(func) {
          var res = m[func](5);
          expect(m.vars[func]).toEqual(5)
          expect(m).toEqual(res);
        });
      })

    });

  });

});
