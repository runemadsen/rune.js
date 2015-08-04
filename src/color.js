(function(Rune) {

  Rune.Color = {

    // This is a proxy function to make a nicer color API
    // for Rune, while using Color.js objects. It takes
    // the input for any color functions and return a color
    // object.
    inputToColor: function(a, b, c, d, e) {

      var color;

      if(a == Rune.HSB) {
        color = new Color({h:b, s:c, v:d});
        if(e) color.alpha(e);
      }
      else if(_.isString(a)) {
        color = new Color(a);
        if(b) color.alpha(b);
      }
      else {
        color = new Color({r:a, g:b, b:c});
        if(d) color.alpha(d);
      }

      return color;
    }

  };

})(Rune);