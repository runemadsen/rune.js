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
      var lastSplit = 0;

      _.each(this.vars.anchors, function(anchor, i) {

        var isMove = anchor.command == 'move';
        var isAfterClose = this.vars.anchors[i-1] && this.vars.anchors[i-1].command == 'close'
        var isLast = i == this.vars.anchors.length-1;

        if(i > lastSplit && (isMove || isAfterClose || isLast)) {
          if(isLast) i++;
          var sub = this.copy(group);
          sub.vars.anchors = sub.vars.anchors.slice(lastSplit, i);
          subs.push(sub);
          lastSplit = i;
        }
      }, this);
      return subs;
    },

    length: function() {
      var len = 0;
      var paths = this.subpaths();

      for(var p = 0; p < paths.length; p++) {
        for(var i = 0; i < paths[p].vars.anchors.length; i++) {

          var isNotLast = i < paths[p].vars.anchors.length-1 ;
          var isLastClose = paths[p].vars.anchors[i].command == 'close';

          if(isNotLast || isLastClose) {
            var start = this.vars.anchors[i];
            var startVec = start.vec3 || start.vec2 || start.vec1;
            var stop = this.vars.anchors[(i+1)%this.vars.anchors.length];
            console.log(stop.sub(startVec).length())
            len += stop.sub(startVec).length()
          }
        }
      }

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