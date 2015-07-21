(function() {

  var root = this;

  var Rune = root.Rune = function(options) {

    var params = _.defaults(options || {}, {
      width: 640,
      height: 480
    });

    // Create default SVG element
    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  }

})();