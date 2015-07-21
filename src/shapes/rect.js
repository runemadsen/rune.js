(function() {

  //var Path = Two.Path;

  var Rectangle = Rune.Rectangle = function(x, y, width, height) {

    this.loc = new Rune.Vector(x, y);
    this.siz = new Rune.Vector(width, height);

    //Path.call(this, [
    //  new Two.Anchor(-w2, -h2),
    //  new Two.Anchor(w2, -h2),
    //  new Two.Anchor(w2, h2),
    //  new Two.Anchor(-w2, h2)
    //], true);

    //this.translation.set(x, y);

  };

  _.extend(Rectangle.prototype, {
    type: "rectangle"
  });

  //_.extend(Rectangle.prototype, Path.prototype);
  //Path.MakeObservable(Rectangle.prototype);

})();