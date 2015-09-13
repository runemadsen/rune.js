import _ from "underscore"
import { Moveable, Styleable, Groupable } from "../mixins"
import Utils from '../utils'

class Triangle {

  constructor(x, y, x2, y2, x3, y3) {
    this.moveable();
    this.styleable();
    this.vars.x = x;
    this.vars.y = y;
    this.vars.x2 = x2;
    this.vars.y2 = y2;
    this.vars.x3 = x3;
    this.vars.y3 = y3;
  }

  copy(parent) {
    var copy = new Triangle();
    copy.vars.x2 = this.vars.x2;
    copy.vars.y2 = this.vars.y2;
    copy.vars.x3 = this.vars.x3;
    copy.vars.y3 = this.vars.y3;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }

}

_.extend(Triangle.prototype, Moveable, Styleable, Groupable, {type: "triangle"});

export default Triangle;