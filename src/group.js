import _ from "underscore"
import { Moveable, Groupable } from "./mixins"
import Utils from './utils'
import Vector from './vector'

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

  copy(parent) {
    var copy = new Group();
    _.each(this.children, function(child) {
      child.copy(copy);
    });
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }

  stagepos() {
    var vec = new Vector(this.vars.x, this.vars.y);
    if(this.parent) {
      vec = vec.add(this.parent.stagepos());
    }
    return vec;
  }

}

// Should we figure out a better way to do mixins for ES6?
_.extend(Group.prototype, Moveable, Groupable, {type: "group"});

export default Group;
