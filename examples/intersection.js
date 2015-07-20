var ellipse = r.ellipse(0, 0, 200, 200);
var rect = r.rect(600, 400, 200, 200);

r.on('draw', function() {

  ellipse.position(r.mouseX, r.mouseY);

  if(ellipse.intersects(rect)) {
    ellipse.intersection(rect).lifetime(12);
  }

});