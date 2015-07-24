describe("Rune.Mixins", function() {

  var m;

  describe("Moveable", function() {

    beforeEach(function() {
      m = newModule(Rune.Mixins.Moveable);
      m.moveable();
    });

    it("creates variables", function() {
      expect(typeof m.moveable).toEqual("function");
      expect(m.vars.x).toEqual(0);
      expect(m.vars.y).toEqual(0);
      expect(m.vars.rotation).toEqual(0);
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
      m = newModule(Rune.Mixins.Sizeable);
      m.sizeable();
    });

    it("creates variables", function() {
      expect(typeof m.sizeable).toEqual("function");
      expect(m.vars.width).toEqual(0);
      expect(m.vars.height).toEqual(0);
    });

  });

  describe("Styleable", function() {

    beforeEach(function() {
      m = newModule(Rune.Mixins.Styleable);
      m.styleable();
    });

    it("creates variables", function() {
      expect(typeof m.styleable).toEqual("function");
      expect(m.vars.fill).toEqual(new Color());
      expect(m.vars.stroke).toEqual(new Color());
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
