import _ from "underscore"
import { Shapeable, Moveable, Styleable } from "../mixins"

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

  copy(group) {
    var t = new Text();
    t.vars.text = this.vars.text;
    this.shapeCopy(t, group);
    return t;
  }

}

_.extend(Text.prototype, Shapeable, Moveable, Styleable, { type: "text" });

export default Text;