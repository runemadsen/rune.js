import _ from "underscore"
import {Shapeable, Moveable, Styleable} from "../mixins"

class Circle {

  constructor(x, y, radius) {
    this.moveable();
    this.styleable();

    this.vars.x = x;
    this.vars.y = y;
    this.vars.radius = radius;
  }

  toPolygon(opts) {
    var ellipse = new Rune.Ellipse(this.vars.x, this.vars.y, this.vars.radius*2, this.vars.radius*2);
    return ellipse.toPolygon(opts);
  }

  copy(group) {
    var c = new Rune.Circle();
    c.vars.radius = this.vars.radius;
    this.shapeCopy(c, group);
    return c;
  }

}

// Should we figure out a better way to do mixins for ES6?
_.extend(Circle.prototype, Shapeable, Moveable, Styleable, { type: "circle" });

export { Circle };