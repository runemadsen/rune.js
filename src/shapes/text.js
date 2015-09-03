import _ from "underscore"
import { Moveable, Styleable, Groupable } from "../mixins"
import Utils from '../utils'

class Text {

  constructor(text, x, y) {
    this.moveable();
    this.styleable();
    this.vars.text = text;
    this.vars.x = x;
    this.vars.y = y;
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
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }

}

_.extend(Text.prototype, Moveable, Styleable, Groupable, { type: "text" });

export default Text;