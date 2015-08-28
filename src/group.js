import _ from "underscore"
import { Shapeable, Moveable } from "./mixins"

class Group {

  constructor(x, y) {
    this.moveable();
    this.children = [];

    if(!_.isUndefined(x)) this.vars.x = x;
    if(!_.isUndefined(y)) this.vars.y = y;
  }

  add(child) {
    if(child.parent) child.parent.remove(child);
    this.children.push(child);
    child.parent = this;
  }

  remove(child) {
    this.children = _.without(this.children, child);
    child.parent = false;
  }

  copy(group) {
    var g = new Group();
    this.shapeCopy(g, group);
    _.each(this.children, function(child) {
      child.copy(g);
    });
    return g;
  }

}

// Should we figure out a better way to do mixins for ES6?
_.extend(Group.prototype, Shapeable, Moveable, {type: "group"});

export default Group;