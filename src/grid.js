var assign = require("lodash/object/assign");
var map = require("lodash/collection/map");
var flatten = require("lodash/array/flatten");
var defaults = require("lodash/object/defaults");
var Moveable = require("./mixins/moveable");
var Group = require('./group');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Grid = function(options) {

  this.moveable();
  this.modules = [];

  var req = defaults(options || {}, {
    x:0,
    y:0,
    columns:10,
    rows:1,
    gutterWidth: 0,
    gutterHeight: 0,
    moduleWidth:50,
    moduleHeight:500
  });

  // if gutter is set, override gutterWidth and gutterHeight
  if(typeof req.gutter !== 'undefined') {
    req.gutterWidth = req.gutter;
    req.gutterHeight = req.gutter;
  }

  // if width is set, override moduleWidth
  if(typeof req.width !== 'undefined') {
    req.moduleWidth = (req.width - ((req.columns-1) * req.gutterWidth)) / req.columns;
  } else {
    req.width = (req.moduleWidth * req.columns) + (req.gutterWidth * (req.columns-1))
  }

  // if height is set, override moduleWidth
  if(typeof req.height !== 'undefined') {
    req.moduleHeight = (req.height - ((req.rows-1) * req.gutterHeight)) / req.rows;
  } else {
    req.height = (req.moduleHeight * req.rows) + (req.gutterHeight * (req.rows-1))
  }

  assign(this.vars, req);

  this.computeGrid();
}

Grid.prototype = {

  add: function(child, column, row) {

    if(!column) column = 1;
    if(!row) row = 1;

    // index is x + (y * width)
    var index = (column-1) + ((row-1) * this.vars.columns)

    if(this.modules[index])
      this.modules[index].add(child)
    else
      throw new Error("Column or row does not exist");
  },

  getModule: function(column, row) {

    // index is x + (y * width)
    var index = (column-1) + ((row-1) * this.vars.columns)

    if(this.modules[index])
      return this.modules[index]
    else
      return undefined
  },

  computeGrid: function() {

    this.modules = [];

    for(var y = 0; y < this.vars.rows; y++) {
      for(var x = 0; x < this.vars.columns; x++) {

        var groupX = (x * this.vars.moduleWidth) + (x * this.vars.gutterWidth);
        var groupY = (y * this.vars.moduleHeight) + (y * this.vars.gutterHeight);

        this.modules.push(new Group(groupX, groupY));
      }
    }
  },

  render: function(opts) {
    var attr = this.moveableAttributes({});
    var groups = map(this.modules, function(module) {
      return module.render(opts);
    });
    if(opts.debug) groups = groups.concat(this.renderDebug());
    return svg('g', attr, flatten(groups, true));
  },

  renderDebug: function() {
    var els = [];

    // draw container rect
    els.push(this.debugRect(0, 0, this.vars.width, this.vars.height));

    // draw lines for columns
    var x = 0;
    for(var i = 0; i < this.vars.columns-1; i++) {
      x += this.vars.moduleWidth;
      els.push(this.debugLine(x, 0, x, this.vars.height));
      x += this.vars.gutterWidth;
      els.push(this.debugLine(x, 0, x, this.vars.height));
    }

    // draw lines for rows
    var y = 0;
    for(var i = 0; i < this.vars.rows-1; i++) {
      y += this.vars.moduleHeight;
      els.push(this.debugLine(0, y, this.vars.width, y));
      y += this.vars.gutterHeight;
      els.push(this.debugLine(0, y, this.vars.width, y));
    }

    return els;
  }

}

assign(Grid.prototype, Moveable, { type: "grid" });

module.exports = Grid;
