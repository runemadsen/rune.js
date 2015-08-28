import _ from "underscore"
import { Shapeable, Moveable, Styleable, Sizeable } from "../mixins"

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

  toPolygon(opts) {
    var poly =  new Rune.Polygon(this.vars.x, this.vars.y)
      .lineTo(0, 0)
      .lineTo(this.vars.width, 0)
      .lineTo(this.vars.width, this.vars.height)
      .lineTo(0, this.vars.height);

    if(opts) poly = poly.toPolygon(opts);
    return poly;
  }

  copy(group) {
    var c = new Rune.Rectangle();
    this.shapeCopy(c, group);
    return c;
  }
}

_.extend(Rectangle.prototype, Shapeable, Moveable, Sizeable, Styleable, { type: "rectangle" });

export default Rectangle;