(function() {

  var Rectangle = Rune.Rectangle = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  };

  _.extend(Rectangle.prototype,
    Rune.Mixins.Translatable,
    Rune.Mixins.Sizeable,
    { type: "rectangle"}
  );

})();