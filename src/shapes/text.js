import assign from "lodash/object/assign"
import { Moveable, Styleable, VectorsAcceptable } from "../mixins"
import Utils from '../utils'

class Text {

  constructor(text, x, y) {
    this.moveable();
    this.styleable();
    this.vectorsAcceptable(arguments);
  }

  init(text, x, y) {
    this.vars.text = text;
    this.vars.x = x;
    this.vars.y = y;
    this.vars.fontSize = 16;
  }

  toPolygon() {
    throw new Error("You need the Rune.Font plugin to convert text to polygon");
  }

  textAlign(textAlign) { this.vars.textAlign = textAlign; return this; }
  fontFamily(fontFamily) { this.vars.fontFamily = fontFamily; return this; }
  fontStyle(fontStyle) { this.vars.fontStyle = fontStyle; return this; }
  fontWeight(fontWeight) { this.vars.fontWeight = fontWeight; return this; }
  fontSize(fontSize) { this.vars.fontSize = fontSize; return this; }
  letterSpacing(letterSpacing) { this.vars.letterSpacing = letterSpacing; return this; }
  textDecoration(textDecoration) { this.vars.textDecoration = textDecoration; return this; }

  copy(parent) {
    var copy = new Text();
    copy.vars.text = this.vars.text;
    copy.vars.textAlign = this.vars.textAlign;
    copy.vars.fontFamily = this.vars.fontFamily;
    copy.vars.fontStyle = this.vars.fontStyle;
    copy.vars.fontWeight = this.vars.fontWeight;
    copy.vars.fontSize = this.vars.fontSize;
    copy.vars.letterSpacing = this.vars.letterSpacing;
    copy.vars.textDecoration = this.vars.textDecoration;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }

  scale(scalar) {
    this.scaleStyleable(scalar);
    this.vars.fontSize *= scalar;
    return this;
  }

}

assign(Text.prototype, Moveable, Styleable, VectorsAcceptable, { type: "text" });

export default Text;
