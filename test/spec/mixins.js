describe("Rune.Mixins", function() {

  var m;

  describe("Moveable", function() {

    beforeEach(function() {
      m = newModule(Rune.Mixins.Moveable);
    });

    it("creates variables", function() {
      expect(m.moveable).toEqual(true);
      expect(m.x).toEqual(0);
      expect(m.y).toEqual(0);
      expect(m.rotation).toEqual(0);
    });

    describe("move()", function() {

      it("moves absolute", function() {
        m.x = 100;
        m.y = 105;
        var res = m.move(200, 205);
        expect(m.x).toEqual(200);
        expect(m.y).toEqual(205);
        expect(m).toEqual(res);
      });

      it("moves relative", function() {
        m.x = 100;
        m.y = 105;
        var res = m.move(200, 205, true);
        expect(m.x).toEqual(300);
        expect(m.y).toEqual(310);
        expect(m).toEqual(res);
      });

    });

    describe("rotate()", function() {

      it("rotates absolute", function() {
        m.rotation = 45;
        var res = m.rotate(45);
        expect(m.rotation).toEqual(45);
        expect(m).toEqual(res);
      });

      it("rotates relative", function() {
        m.rotation = 45;
        var res = m.rotate(45, true);
        expect(m.rotation).toEqual(90);
        expect(m).toEqual(res);
      });

    });

  });

  describe("Sizeable", function() {

    beforeEach(function() {
      m = newModule(Rune.Mixins.Sizeable);
    });

    it("creates variables", function() {
      expect(m.sizeable).toEqual(true);
      expect(m.width).toEqual(0);
      expect(m.height).toEqual(0);
    });

  });

  describe("Styleable", function() {

    beforeEach(function() {
      m = newModule(Rune.Mixins.Styleable);
    });

    it("creates variables", function() {
      expect(m.styleable).toEqual(true);
      expect(m.fillColor).toEqual(new Color());
      expect(m.strokeColor).toEqual(new Color());
    });

    describe("fill()", function() {

      it("sets fill to color", function() {
        var res = m.fill("#ff0000");
        expect(m.fillColor).toEqual(new Color().rgb(255, 0, 0));
        expect(m).toEqual(res);
      });

      it("sets fill to false", function() {
        m.fill(false);
        expect(m.fillColor).toEqual(false);
      });

    });

    describe("stroke()", function() {

      it("sets stroke to color", function() {
        var res = m.stroke("#ff0000");
        expect(m.strokeColor).toEqual(new Color().rgb(255, 0, 0));
        expect(m).toEqual(res);
      });

      it("sets stroke to false", function() {
        m.stroke(false);
        expect(m.strokeColor).toEqual(false);
      });

    });




  });

});
