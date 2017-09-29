var assign = require('object-assign');
var utils = require('./utils');
var Shape = require('./mixins/shape');
var Parent = require('./mixins/parent');
var Group = require('./group');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Grid = function(options) {
  this.shape();
  this.setupParent();

  var req = assign(
    {
      x: 0,
      y: 0,
      columns: 10,
      rows: 1,
      gutterWidth: 0,
      gutterHeight: 0,
      moduleWidth: 50,
      moduleHeight: 500
    },
    options
  );

  // if gutter is set, override gutterWidth and gutterHeight
  if (typeof req.gutter !== 'undefined') {
    req.gutterWidth = req.gutter;
    req.gutterHeight = req.gutter;
  }

  // if width is set, override moduleWidth
  if (typeof req.width !== 'undefined') {
    req.moduleWidth =
      (req.width - (req.columns - 1) * req.gutterWidth) / req.columns;
  } else {
    req.width =
      req.moduleWidth * req.columns + req.gutterWidth * (req.columns - 1);
  }

  // if height is set, override moduleWidth
  if (typeof req.height !== 'undefined') {
    req.moduleHeight =
      (req.height - (req.rows - 1) * req.gutterHeight) / req.rows;
  } else {
    req.height =
      req.moduleHeight * req.rows + req.gutterHeight * (req.rows - 1);
  }

  assign(this.state, req);

  this.computeGrid();
};

Grid.prototype = {
  add: function(child, column, row) {
    if (!column) column = 1;
    if (!row) row = 1;

    // index is x + (y * width)
    var index = column - 1 + (row - 1) * this.state.columns;

    if (this.children[index]) {
      this.children[index].add(child);
    } else {
      throw new Error('Column or row does not exist');
    }
  },

  getModule: function(column, row) {
    // index is x + (y * width)
    var index = column - 1 + (row - 1) * this.state.columns;
    if (this.children[index]) return this.children[index];
    else return undefined;
  },

  computeGrid: function() {
    for (var y = 0; y < this.state.rows; y++) {
      for (var x = 0; x < this.state.columns; x++) {
        var groupX = x * this.state.moduleWidth + x * this.state.gutterWidth;
        var groupY = y * this.state.moduleHeight + y * this.state.gutterHeight;
        this.addChild(new Group(groupX, groupY));
      }
    }
  },

  render: function(opts) {
    if (!this.children || this.children.length == 0) return;
    var attr = this.shapeAttributes({});
    var groups = this.renderChildren(opts);
    if (opts.debug) groups = groups.concat(this.renderDebug());
    return svg('g', attr, utils.flatten(groups, true));
  },

  renderDebug: function() {
    var els = [];

    // draw container rect
    els.push(this.debugRect(0, 0, this.state.width, this.state.height));

    // draw lines for columns
    var x = 0;
    for (var i = 0; i < this.state.columns - 1; i++) {
      x += this.state.moduleWidth;
      els.push(this.debugLine(x, 0, x, this.state.height));
      x += this.state.gutterWidth;
      els.push(this.debugLine(x, 0, x, this.state.height));
    }

    // draw lines for rows
    var y = 0;
    for (var i = 0; i < this.state.rows - 1; i++) {
      y += this.state.moduleHeight;
      els.push(this.debugLine(0, y, this.state.width, y));
      y += this.state.gutterHeight;
      els.push(this.debugLine(0, y, this.state.width, y));
    }

    return els;
  }
};

assign(Grid.prototype, Shape, Parent, { type: 'grid' });

module.exports = Grid;
