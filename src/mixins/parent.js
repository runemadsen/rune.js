var utils = require('../utils');

var Parent = {
  setupParent: function() {
    this.children = [];
    this.changedChildren = [];
    this.renderedChildren = [];
  },

  addChild: function(child) {
    if (child.parent) child.parent.remove(child);
    this.children.push(child);
    child.parent = this;
    child.childId = this.children.length - 1;
    child.changed();
  },

  removeChild: function(child) {
    if (child.parent !== this) {
      return;
    }

    // check if it is in this parent
    this.renderedChildren.splice(child.childId, 1);
    this.children.splice(child.childId, 1);

    var childIndex = this.changedChildren.indexOf(child.childId);
    if (childIndex !== -1) {
      this.changedChildren.splice(childIndex, 1);
    }

    // Lower id's of all children above by one
    for (var i = child.childId; i < this.children.length; i++) {
      this.children[i].childId--;
    }

    // lower id's of all changedChildren by one
    for (var i = 0; i < this.changedChildren.length; i++) {
      if (this.changedChildren[i] > child.childId) this.changedChildren[i]--;
    }

    child.childId = null;
    child.parentNotified = false;
    child.parent = false;
    this.changed();
  },

  renderChildren: function(opts) {
    // loop through the changed children
    while (this.changedChildren.length > 0) {
      var childId = this.changedChildren.shift();
      this.renderedChildren[childId] = this.children[childId].render(opts);
      this.children[childId].parentNotified = false;
    }

    // FIGURE OUT HOW NOT TO FLATTEN EVERY TIME!
    return utils.flatten(this.renderedChildren, true);
  }
};

module.exports = Parent;
