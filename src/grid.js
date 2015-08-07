(function(Rune) {

  // Constructor
  // --------------------------------------------------

  var Grid = Rune.Grid = function(options) {

    this.moveable();
    this.modules = [];

    var req = _.defaults(options || {}, {
      x:0,
      y:0,
      columns:10,
      rows:1,
      gutterX: 0,
      gutterY: 0,
      moduleWidth:50,
      moduleHeight:500
    });

    // if gutter is set, override gutterX and gutterY
    if(!_.isUndefined(req.gutter)) {
      req.gutterX = req.gutter;
      req.gutterY = req.gutter;
    }

    // if width is set, override moduleWidth
    if(!_.isUndefined(req.width)) {
      req.moduleWidth = (req.width - ((req.columns-1) * req.gutterX)) / req.columns;
    } else {
      req.width = (req.moduleWidth * req.columns) + (req.gutterX * (req.columns-1))
    }

    // if height is set, override moduleWidth
    if(!_.isUndefined(req.height)) {
      req.moduleHeight = (req.height - ((req.rows-1) * req.gutterY)) / req.rows;
    } else {
      req.height = (req.moduleHeight * req.rows) + (req.gutterY * (req.rows-1))
    }

    _.extend(this.vars, req);

    this.computeGrid();
  };

  // Grid functions
  // --------------------------------------------------

  _.extend(Grid.prototype, Rune.Shapeable, Rune.Moveable, {

    type: "grid",

    add: function(child, column, row) {

      if(!column) column = 1;
      if(!row) row = 1;

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