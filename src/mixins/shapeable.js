var Shapeable = Rune.Shapeable = {

  shapeCopy: function(s, group) {
    if(this.moveable)   s.moveable(this);
    if(this.sizeable)   s.sizeable(this);
    if(this.styleable)  s.styleable(this);
    Rune.addToGroup(s, this.parent, group);
  }

};