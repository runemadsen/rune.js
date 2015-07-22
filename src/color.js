(function(Rune) {

  Rune.RGB = "rgb";
  Rune.HSB = "hsb";

  Rune.Color = {

    // This is a proxy function to make a nicer color API
    // for Rune, while using Color.js objects. It takes
    // the input for any color functions and return a color
    // object.
    inputToColor: function(a, b, c, d) {
      if(a == Rune.HSB)
        return new Color().hsv(b, c, d);
      else if(_.isString(a))
        return new Color(a);
      else
        return new Color().rgb(a, b, c);
    }

  };

})(Rune);