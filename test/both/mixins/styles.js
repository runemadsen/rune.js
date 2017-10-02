describe('Rune.Styles', function() {
  var m;

  beforeEach(function() {
    m = newMixin(Rune.Shape, Rune.Styles);
    m.styles();
  });

  describe('styleable()', function() {
    it('assigns default variable', function() {
      expect(typeof m.styles).toEqual('function');
      expect(m.state.fill.rgbArray()).toEqual([128, 128, 128]);
      expect(m.state.stroke.rgbArray()).toEqual([0, 0, 0]);
    });

    it('copies variables from object', function() {
      setStylesVars(m);
      var copy = newMixin(Rune.Styles);
      copy.styles(m);
      expect(copy.state.fill).toEqual(m.state.fill);
      expect(copy.state.stroke).toEqual(m.state.stroke);
      expect(copy.state.strokeWidth).toEqual(m.state.strokeWidth);
      expect(copy.state.strokeCap).toEqual(m.state.strokeCap);
      expect(copy.state.strokeJoin).toEqual(m.state.strokeJoin);
      expect(copy.state.strokeMiterlimit).toEqual(m.state.strokeMiterlimit);
      expect(copy.state.strokeDash).toEqual(m.state.strokeDash);
      expect(copy.state.strokeDashOffset).toEqual(m.state.strokeDashOffset);
    });

    it('copies false variables from object', function() {
      m.fill(false);
      m.stroke(false);
      var m2 = newMixin(Rune.Styles);
      m2.styles(m);
      expect(m2.state.fill).toBe(false);
      expect(m2.state.stroke).toBe(false);
    });

    it('copies zero colors', function() {
      var m2 = newMixin(Rune.Styles);
      m2.styles(m);
      expect(m2.state.fill).toEqual(m.state.fill);
      expect(m2.state.stroke).toEqual(m.state.stroke);
    });
  });

  describe('fill()', function() {
    it('sets fill to color', function() {
      var res = m.fill('#ff0000');
      expect(m.state.fill.rgbArray()).toEqual([255, 0, 0]);
      expect(m).toEqual(res);
    });

    it('sets fill to false', function() {
      m.fill(false);
      expect(m.state.fill).toEqual(false);
    });

    it('sets fill to none', function() {
      m.fill('none');
      expect(m.state.fill).toEqual('none');
    });
  });

  describe('stroke()', function() {
    it('sets stroke to color', function() {
      var res = m.stroke('#ff0000');
      expect(m.state.stroke.rgbArray()).toEqual([255, 0, 0]);
      expect(m).toEqual(res);
    });

    it('sets stroke to false', function() {
      m.stroke(false);
      expect(m.state.stroke).toEqual(false);
    });
  });

  describe('Basic setters', function() {
    it('sets the var value', function() {
      var funcs = [
        'strokeWidth',
        'strokeCap',
        'strokeJoin',
        'strokeMiterlimit',
        'strokeDash',
        'strokeDashOffset'
      ];
      funcs.forEach(function(func) {
        var res = m[func](5);
        expect(m.state[func]).toEqual(5);
        expect(m).toEqual(res);
      });
    });
  });

  describe('scaleStyles()', function() {
    it('scales default strokeWidth', function() {
      m.scaleStyles(3);
      expect(m.state.strokeWidth).toEqual(3);
    });

    it('scales a specific strokeWidth', function() {
      m.state.strokeWidth = 4;
      m.scaleStyles(3);
      expect(m.state.strokeWidth).toEqual(12);
    });
  });
});
