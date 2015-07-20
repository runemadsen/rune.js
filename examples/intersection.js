var ellipse = r.ellipse(0, 0, 200, 200);
var rect = r.rect(600, 400, 200, 200);
var diff = ellipse.intersection(rect);

r.on('draw', function() {

  ellipse.position(r.mouseX, r.mouseY);

  if(ellipse.intersects(rect)) {
    diff.replaceWith(ellipse.intersection(rect));
  }

});