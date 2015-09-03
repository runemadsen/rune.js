import _ from "underscore"
import { Moveable, Styleable, Groupable } from "../mixins"
import Ellipse from "./ellipse"
import Utils from '../utils'

class Circle {

  constructor(x, y, radius) {
    this.moveable();
    this.styleable();

    this.vars.x = x;
    this.vars.y = y;
    this.vars.radius = radius;
  }

  toPolygon(opts, parent) {
    var ellipse = new Ellipse(this.vars.x, this.vars.y, this.vars.radius*2, this.vars.radius*2);
    var poly = ellipse.toPolygon(opts, false);
    Utils.copyMixinVars(this, poly);
    Utils.groupLogic(poly, this.parent, parent);
    return poly;
  }

  copy(parent) {
    var copy = new Circle();
    copy.vars.radius = this.vars.radius;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }

}

// Should we figure out a better way to do mixins for ES6?
_.extend(Circle.prototype, Moveable, Styleable, Groupable, { type: "circle" });

export default Circle;