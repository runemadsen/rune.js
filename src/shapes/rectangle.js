import assign from "lodash/object/assign"
import { Moveable, Styleable, Sizeable, VectorsAcceptable } from "../mixins"
import Polygon from './polygon'
import Utils from '../utils'

class Rectangle {

  constructor(x, y, width, height) {
    this.moveable();
    this.sizeable();
    this.styleable();
    this.vectorsAcceptable(arguments);
  }

  init(x, y, width, height) {
    this.vars.x = x;
    this.vars.y = y;
    this.vars.width = width;
    this.vars.height = height;
  }

  round(rx, ry) {
    if(!ry) ry = rx;
    this.vars.rx = rx;
    this.vars.ry = ry;
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

  scale(scalar) {
    this.scaleSizeable(scalar);
    this.scaleStyleable(scalar);
    return this;
  }
}

assign(Rectangle.prototype, Moveable, Sizeable, Styleable, VectorsAcceptable, { type: "rectangle" });

export default Rectangle;
