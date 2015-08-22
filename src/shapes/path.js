(function(Rune) {

  var Path = Rune.Path = function(x, y) {

    this.moveable();
    this.styleable();

    this.vars.anchors = [];
    if(!_.isUndefined(x)) this.vars.x = x;
    if(!_.isUndefined(y)) this.vars.y = y;
  };

  _.extend(Path.prototype, Rune.Shapeable, Rune.Moveable, Rune.Styleable, {

    type: "path",

    moveTo: function(x, y, relative) {
      this.vars.anchors.push(new Rune.Anchor().setMove(x, y, relative));
      return this;
    },

    lineTo: function(x, y, relative) {
      this.checkStartMove();
      this.vars.anchors.push(new Rune.Anchor().setLine(x, y, relative));
      return this;
    },

    curveTo: function(a, b, c, d, e, f, g) {
      this.checkStartMove();
      this.vars.anchors.push(new Rune.Anchor().setCurve(a, b, c, d, e, f, g));
      return this;
    },

    closePath: function() {
      this.checkStartMove();
      this.vars.anchors.push(new Rune.Anchor().setClose());
      return this;
    },

    subpaths: function(group) {
      var subs = [];
      var lastMove = 0;
      _.each(this.vars.anchors, function(anchor, i) {
        if(i > lastMove && (anchor.command == 'move' || i == this.vars.anchors.length-1)) {
          if(i == this.vars.anchors.length-1) i++;
          var sub = this.copy(group);
          sub.vars.anchors = sub.vars.anchors.slice(lastMove, i);
          subs.push(sub);
          lastMove = i;
        }
      }, this);
      return subs;
    },

    length: function() {
      //var len = 0;
      //for(var i = 0; i < this.vars.anchors.length; i++) {
        // WHAT DO I DO WITH THE DIFFERENT TYPES?
        //var start = this.vars.vectors[i];
        //var stop = this.vars.vectors[(i+1)%this.vars.vectors.length];
        //len += stop.sub(start).length();
      //}
      return len;
    },

    toPolygons: function(opts) {

      // use subpaths!!!

      // if splitting the path into vectors with equal spacing
      //if(opts && opts.spacing) {
//
      //  var poly = new Rune.Polygon(this.vars.x, this.vars.y);
      //  var len = this.length();
      //  var num = len / opts.spacing;
      //  for(var i = 0; i < num; i++) {
      //    var vec = this.vectorAtLength(i * opts.spacing);
      //    poly.lineTo(vec.x, vec.y)
      //  }
      //  return poly;
      //}
//
      //return this;

    },

    copy: function(group) {
      var s = new Rune.Path();
      s.vars.anchors = _.map(this.vars.anchors, function(a) { return a.copy(); });
      this.shapeCopy(s, group);
      return s;
    },

    fillRule: function(val) { this.vars.fillRule = val; return this; },

    // Paths must start with a moveTo. This function is checks if
    // there is a moveTo at the beginning, and adds one if not.
    checkStartMove: function() {
      if(this.vars.anchors.length == 0) {
        this.moveTo(0, 0);
      }
    }

  });

})(Rune);