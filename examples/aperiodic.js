// Substitution rule:
// http://web.media.mit.edu/~black/tiles/aperiodic.html

var maxLevel = 8;
var startSize = 1700;

drawL(0, 0, 1700, 0, 0, r.color(60, 100, 150))
  .translate(0, -850)


function drawL(x, y, sideLength, rot, level, col) {

  // draw shape
  var l = r.path(x, y)
    .lineTo(0, sideLength)
    .lineTo(sideLength, sideLength)
    .lineTo(sideLength, sideLength/2)
    .lineTo(sideLength/2, sideLength/2)
    .lineTo(sideLength / 2, 0)
    .closePath();

  // rotate it around
  l.rotate(r.radians(rot))
    .fill(col);

  // subdivide
  if(level < maxLevel)
  {
    level++;

    drawL(sideLength/4, sideLength/4, sideLength/2, 0, level, color(60, 100, 150));
    drawL(sideLength/2, 0, sideLength/2, 90, level, color(140, 180, 220));
    drawL(0, sideLength/2, sideLength/2, 0, level, color(40, 40, 40));
    drawL(sideLength/2, sideLength, sideLength/2, -90, level, color(50, 60, 70));
  }

  return l;
}
