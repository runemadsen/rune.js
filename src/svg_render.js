(function(Rune) {

  var SVGRender = Rune.SVGRender = function(params) {

    this.params = params

    this.tree = virtualdom.svg('svg', {
      width: params.width,
      height: params.height
    });

    this.el = virtualdom.createElement(this.tree);

  }

  _.extend(SVGRender.prototype, {

    render: function(stage) {

      // this should obviously be replaced by the real
      // thing.
      var newTree = virtualdom.svg('svg', {
        width: this.params.width,
        height: this.params.height
      });

      var diff = virtualdom.diff(this.tree, newTree);
      this.el = virtualdom.patch(this.el, diff);
      this.tree = newTree;
    }

  });


})(Rune);