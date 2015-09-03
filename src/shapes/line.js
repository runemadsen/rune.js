import _ from "underscore"
import { Moveable, Styleable, Groupable } from "../mixins"
import Utils from '../utils'

class Line {

  constructor(x, y, x2, y2) {
    this.moveable();
    this.styleable();
    this.vars.x = x;
    this.vars.y = y;
    this.vars.x2 = x2;
    this.vars.y2 = y2;
  }

  copy(parent) {
    var copy = new Line();
    copy.vars.x2 = this.vars.x2;
    copy.vars.y2 = this.vars.y2;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }

}

_.extend(Line.prototype, Moveable, Styleable, Groupable, {type: "line"});

export default Line;