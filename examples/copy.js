var rect = r.rect(0, 0, 50, 50);
var rect2 = rect.copy().translate(100, 0);

var tri = r.path(125, 35)
  .lineTo(0, 50)
  .lineTo(150, 150)
  .lineTo(0, 150)
  .close();

var tri2 = tri.copy().translate(100, 0);