import assign from "lodash/object/assign"
import { Moveable, Styleable, VectorsAcceptable } from "../mixins"
import Vector from '../vector'
import Utils from '../utils'

class Line {

  constructor(x, y, x2, y2) {
    this.moveable();
    this.styleable();
    this.vectorsAcceptable(arguments);
  }

  init(x, y, x2, y2) {
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

  scale(scalar) {
    this.scaleStyleable(scalar);
    var start = new Vector(this.vars.x, this.vars.y)
    var end = new Vector(this.vars.x2, this.vars.y2)
    var vec = end.sub(start).multiply(scalar).add(start);
    this.vars.x2 = vec.x;
    this.vars.y2 = vec.y;
    return this;
  }

}

assign(Line.prototype, Moveable, Styleable, VectorsAcceptable, {type: "line"});

export default Line;
