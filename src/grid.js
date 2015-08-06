(function(Rune) {

  // Constructor
  // --------------------------------------------------

  var Grid = Rune.Grid = function(options) {

    this.moveable();
    this.modules = [];

    var req = _.defaults(options || {}, {
      x:0,
      y:0,
      columns:12,
      rows:1
    });

    // do some calculations if grid was instantiated with
    // gutter shorthand or grid dimensions
    if(req.gutter && !req.gutterX)      req.gutterX = req.gutter;
    if(req.gutter && !req.gutterY)      req.gutterY = req.gutter;
    if(req.width && !req.moduleWidth)   req.moduleWidth = (req.width - ((req.columns-1) * req.gutterX)) / req.columns;
    if(req.height && !req.moduleHeight) req.moduleHeight = (req.height - ((req.rows-1) * req.gutterY)) / req.rows;

    var defaults = _.defaults(req, {
      gutterX:0,
      gutterY:0,
      moduleWidth:100,
      moduleHeight:0
    });

    _.extend(this.vars, defaults);

    this.computeGrid();
  };

  // Grid functions
  // --------------------------------------------------

  _.extend(Grid.prototype, Rune.Shapeable, Rune.Moveable, {

    type: "grid",

    add: function(child, column, row) {
      if(this.modules[column-1] && this.modules[column-1][row-1]) {
        this.modules[column-1][row-1].add(child);
      }
      else {
        throw new Error("Column or row does not exist");
      }
    },

    computeGrid: function() {

      this.modules = [];

      for(var x = 0; x < this.vars.columns; x++) {

        this.modules.push([]);

        for(var y = 0; y < this.vars.rows; y++) {

          var groupX = (x * this.vars.moduleWidth) + (x * this.vars.gutterX);
          var groupY = (y * this.vars.moduleHeight) + (y * this.vars.gutterY);
          this.modules[x].push(new Rune.Group(groupX, groupY));
        }
      }

    }

    //copy: function(group) {
    //  var g = new Rune.Group();
    //  this.shapeCopy(g, group);
    //  _.each(this.children, function(child) {
    //    child.copy(g);
    //  });
    //  return g;
    //}

  });

})(Rune);