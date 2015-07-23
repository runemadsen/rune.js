(function(Rune) {

  var Render = Rune.Render = function(params) {

    this.params = params

    this.tree = virtualdom.svg('svg', {
      width: params.width,
      height: params.height
    });

    this.el = virtualdom.createElement(this.tree);

  }

  _.extend(Render.prototype, {

    render: function(stage) {

      var newTree = virtualdom.svg('svg', {
        width: this.params.width,
        height: this.params.height
      }, [this.objectsToSVG(stage.children)]);

      var diff = virtualdom.diff(this.tree, newTree);
      this.el = virtualdom.patch(this.el, diff);
      this.tree = newTree;

      console.log(this.el)
    },

    objectToSVG: function(object) {
      if(this[object.type + "ToSVG"])
        return this[object.type + "ToSVG"](object)
      else
        console.error("Rune.Render: Object not recognized", object)
    },

    objectsToSVG: function(objects) {
      return _.map(objects, _.bind(this.objectToSVG, this));
    },

    groupToSVG: function(group) {
      return virtualdom.svg('g', {}, this.objectsToSVG(group.children));
    },

    rectangleToSVG: function(rect) {
      return virtualdom.svg('rect', {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      });
    }

  });


})(Rune);