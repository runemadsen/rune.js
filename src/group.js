import without from "lodash/array/without"
import assign from "lodash/object/assign"
import each from "lodash/collection/each"
import { Moveable, VectorsAcceptable } from "./mixins"
import Utils from './utils'
import Vector from './vector'

class Group {

  constructor(x, y) {
    this.moveable();
    this.vectorsAcceptable(arguments);
  }

  init(x, y) {
    this.children = [];

    if(typeof x !== 'undefined') this.vars.x = x;
    if(typeof y !== 'undefined') this.vars.y = y;
  }

  add(child) {
    if(child.parent) child.parent.remove(child);
    this.children.push(child);
    child.parent = this;
  }

  remove(child) {
    this.children = without(this.children, child);
    child.parent = false;
  }

  copy(parent) {
    var copy = new Group();
    for(var i = 0; i < this.children.length; i++) {
      this.children[i].copy(copy)
    }
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }

  scale(scalar) {
    each(this.children, function(child) {
      child.vars.x *= scalar;
      child.vars.y *= scalar;
      child.scale(scalar);
    });
    return this;
  }

}

// Should we figure out a better way to do mixins for ES6?
assign(Group.prototype, Moveable, VectorsAcceptable, {type: "group"});

export default Group;
