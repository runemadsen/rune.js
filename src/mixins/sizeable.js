var Sizeable = Rune.Sizeable = {

  sizeable: function(copy) {
    this.vars = this.vars || {};
    this.vars.width = copy ? copy.vars.width : 0;
    this.vars.height = copy ? copy.vars.height : 0;
  }

};