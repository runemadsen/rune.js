import assign from "lodash/object/assign"
import { Moveable, Sizeable, VectorsAcceptable } from "../mixins"
import Utils from '../utils'

class Image {

  constructor(url, x, y, width, height) {
    this.moveable();
    this.sizeable();
    this.vectorsAcceptable(arguments);
  }

  init(url, x, y, width, height) {
    this.vars.url = url;
    this.vars.x = x;
    this.vars.y = y;
    this.vars.width = width;
    this.vars.height = height;
  }

  scale(scalar) {
    this.scaleSizeable(scalar);
    return this;
  }

  copy(parent) {
    var copy = new Image();
    copy.vars.url = this.vars.url;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }

}

// Should we figure out a better way to do mixins for ES6?
assign(Image.prototype, Moveable, Sizeable, VectorsAcceptable, { type: "image" });

export default Image;
