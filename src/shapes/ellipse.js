import _ from "underscore"
import {Shapeable, Moveable, Sizeable, Styleable} from "../mixins"

class Ellipse {

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

    var numVectors = 16;

    // if we're calculating the number of vectors based on spacing
    // find circumference and divide by spacing.
    if(opts && opts.spacing) {
      var circumference = Math.PI * (this.vars.width+this.vars.height);
      numVectors = circumference / opts.spacing;
    } else if(opts && opts.vectors) {
      numVectors = opts.vectors;
    } else if(opts && opts.division) {
      numVectors = 1 / opts.division;
    }

    var vectorAngle = 360/numVectors;

    var poly =  new Rune.Polygon(this.vars.x, this.vars.y);
    for(var i = 0; i < numVectors; i++) {
      var x = Math.cos(Rune.radians(i * vectorAngle)) * this.vars.width;
      var y = Math.sin(Rune.radians(i * vectorAngle)) * this.vars.height;
      poly.lineTo(x, y);
    }

    return poly;
  }

  copy(group) {
    var e = new Rune.Ellipse();
    this.shapeCopy(e, group);
    return e;
  }

}

// Should we figure out a better way to do mixins for ES6?
_.extend(Ellipse.prototype, Rune.Shapeable, Rune.Moveable, Rune.Sizeable, Rune.Styleable, {type: "ellipse"});

export { Ellipse };