var Shapeable = Rune.Shapeable = {

  shapeCopy: function(s, group) {
    if(this.moveable)   s.moveable(this);
    if(this.sizeable)   s.sizeable(this);
    if(this.styleable)  s.styleable(this);
    Rune.addToGroup(s, this.parent, group);
  }

  // IF WE ADD MORE METHODS, REMEMBER THAT GROUP EXTENDS THIS
  // MIXIN. WE MIGHT NEED TO ADD shapeCopy FUNCTION TO SEPARATE
  // MIXING, and then remove the mixin from the group as group is
  // not a shape.

};