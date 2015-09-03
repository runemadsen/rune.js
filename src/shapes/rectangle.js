import _ from "underscore"
import { Moveable, Styleable, Sizeable, Groupable } from "../mixins"
import Polygon from './polygon'
import Utils from '../utils'

class Rectangle {

  constructor(x, y, width, height) {
    this.moveable();
    this.sizeable();
    this.styleable();
    this.vars.x = x;
    this.vars.y = y;
    this.vars.width = width;
    this.vars.height = height;
  }

  toPolygon(opts, parent) {
    var poly =  new Polygon(this.vars.x, this.vars.y)
      .lineTo(0, 0)
      .lineTo(this.vars.width, 0)
      .lineTo(this.vars.width, this.vars.height)
      .lineTo(0, this.vars.height);

    if(opts) poly = poly.toPolygon(opts, false);

    Utils.copyMixinVars(this, poly);
    Utils.groupLogic(poly, this.parent, parent);

    return poly;
  }

  copy(parent) {
    var copy = new Rectangle();
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }
}

_.extend(Rectangle.prototype, Moveable, Sizeable, Styleable, Groupable, { type: "rectangle" });

export default Rectangle;