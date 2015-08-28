import _ from "underscore"
import { Shapeable, Moveable, Styleable } from "../mixins"

class Line {

  constructor(x, y, x2, y2) {
    this.moveable();
    this.styleable();
    this.vars.x = x;
    this.vars.y = y;
    this.vars.x2 = x2;
    this.vars.y2 = y2;
  }

  copy(group) {
    var e = new Line();
    e.vars.x2 = this.vars.x2;
    e.vars.y2 = this.vars.y2;
    this.shapeCopy(e, group);
    return e;
  }

}

_.extend(Line.prototype, Shapeable, Moveable, Styleable, {type: "line"});

export default Line;