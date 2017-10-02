describe('Rune.Text', function() {
  var s;

  var textVars = {
    textAlign: 'center',
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 32,
    letterSpacing: 0.5,
    textDecoration: 'underline'
  };
  var textVarKeys = Object.keys(textVars);

  function setTextVars(text) {
    textVarKeys.forEach(function(key) {
      s[key](textVars[key]);
    });
  }

  function expectTextVars(text) {
    textVarKeys.forEach(function(key) {
      expect(s.state[key]).toEqual(textVars[key]);
    });
  }

  beforeEach(function() {
    s = new Rune.Text('Hello', 10, 15);
  });

  describe('Common text state', function() {
    it('sets var', function() {
      setTextVars(s);
      expectTextVars(s);
    });

    it('is chainable', function() {
      textVarKeys.forEach(function(key) {
        var res = s[key](textVars[key]);
        expect(res).toBe(res);
      });
    });
  });

  describe('toPolygon', function() {
    it('throws error if Rune.Font is not present', function() {
      expect(function() {
        s.toPolygon();
      }).toThrow(
        new Error('You need the Rune.Font plugin to convert text to polygon')
      );
    });
  });

  describe('copy()', function() {
    it('has shared copy functionality', function() {
      setTextVars(s);
      expectCopy(s);
    });
  });

  it('scales the rectangle', function() {
    spyOn(s, 'scaleStyles');
    s.scale(2);
    expect(s.state.x).toEqual(10);
    expect(s.state.y).toEqual(15);
    expect(s.state.fontSize).toEqual(32);
    expect(s.scaleStyles).toHaveBeenCalledWith(2);
  });
});
