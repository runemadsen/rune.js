import _ from "underscore"
import { Moveable, Sizeable, Styleable, Groupable } from "../mixins"
import Polygon from './polygon'
import Utils from '../utils'

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

  toPolygon(opts, parent) {

    var numVectors = 16;

    // if we're calculating the number of vectors based on spacing
    // find circumference and divide by spacing.
    if(opts && opts.spacing) {
      var circumference = Math.PI * (this.vars.width+this.vars.height);
      numVectors = circumference / opts.spacing;
    }

    var vectorAngle = 360/numVectors;

    var poly =  new Polygon(this.vars.x, this.vars.y);
    for(var i = 0; i < numVectors; i++) {
      var x = Math.cos(Utils.radians(i * vectorAngle)) * this.vars.width;
      var y = Math.sin(Utils.radians(i * vectorAngle)) * this.vars.height;
      poly.lineTo(x, y);
    }

    Utils.copyMixinVars(this, poly);
    Utils.groupLogic(poly, this.parent, parent);

    return poly;
  }

  copy(parent) {
    var copy = new Ellipse();
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }

}

// Should we figure out a better way to do mixins for ES6?
_.extend(Ellipse.prototype, Moveable, Sizeable, Styleable, Groupable, {type: "ellipse"});

export default Ellipse;