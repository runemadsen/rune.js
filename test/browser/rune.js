describe('Browser', function() {
  var r;

  beforeEach(function() {
    r = new Rune();
  });

  describe('instantiation', function() {
    beforeEach(function() {
      // Remove existing els if present
      var els = document.getElementsByClassName('parent');
      for (var i = 0; i < els.length; i++) {
        els[0].parentNode.removeChild(els[0]);
      }

      // create element
      var div = document.createElement('div');
      document.body.appendChild(div);
      div.style.width = '500px';
      div.style.height = '400px';
      div.setAttribute('class', 'parent');
    });

    it('should use width and height', function() {
      var r = new Rune({ width: 100, height: 105, container: '.parent' });
      expect(r.width).toEqual(100);
      expect(r.height).toEqual(105);
    });

    describe('when no width and height', function() {
      it('should set to el dimensions', function() {
        var r = new Rune({ container: '.parent' });
        expect(r.width).toEqual(300);
        expect(r.height).toEqual(150);
      });

      it('should not render width and height in SVG', function() {
        var r = new Rune({ container: '.parent' });
        expect(r.el.getAttribute('width')).toBeFalsy();
        expect(r.el.getAttribute('height')).toBeFalsy();
        r.draw();
        expect(r.el.getAttribute('width')).toBeFalsy();
        expect(r.el.getAttribute('height')).toBeFalsy();
      });
    });
  });

  describe('on()', function() {
    describe('update', function() {
      it(
        'triggers update event',
        function(done) {
          var mock = { draw: function() {} };
          spyOn(mock, 'draw');
          var r = new Rune();
          r.on('update', mock.draw);
          r.play();
          setTimeout(function() {
            expect(mock.draw).toHaveBeenCalled();
            done();
          }, 100);
        },
        110
      );
    });
  });

  describe('pause()', function() {
    it(
      'pauses draw loop',
      function(done) {
        var mock = { onetime: function() {} };
        spyOn(mock, 'onetime');
        var r = new Rune();
        r.on('update', function() {
          mock.onetime();
          r.pause();
        });
        r.play();
        setTimeout(function() {
          expect(mock.onetime.calls.count()).toEqual(1);
          done();
        }, 100);
      },
      150
    );
  });

  describe('frameRate()', function() {
    var mock;

    beforeEach(function() {
      mock = { draw: function() {} };
      spyOn(mock, 'draw');
    });

    it(
      'defaults to 60 fps',
      function(done) {
        var r = new Rune();
        r.on('update', mock.draw);
        r.play();
        setTimeout(function() {
          expect(mock.draw.calls.count() > 14).toBe(true);
          expect(mock.draw.calls.count() < 18).toBe(true);
          done();
        }, 250);
      },
      260
    );

    it(
      'follows framerate',
      function(done) {
        var r = new Rune({ frameRate: 10 });
        r.on('update', mock.draw);
        r.play();
        setTimeout(function() {
          expect(mock.draw.calls.count() > 1).toBe(true);
          expect(mock.draw.calls.count() < 3).toBe(true);
          done();
        }, 250);
      },
      260
    );
  });
});
