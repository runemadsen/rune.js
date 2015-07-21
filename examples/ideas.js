// Instantiation
// --------------------------------------------

var r = new Rune({el: '#myContainer', width: 286, height: 200})
  .on('setup', setup)
  .on('draw', draw)

// Shapes
// --------------------------------------------

// automatically add shapes to the scene graph
var rect = r.rect(100, 100, 500, 300)

// draw a path
var wave = r.path(125, 35)
  .lineTo(0, 50)
  .bezierTo(50, 50, 0, 50, 25, 0)
  .bezierTo(100, 50, 50, 50, 75, 100)
  .bezierTo(150, 50, 100, 50, 125, 0)
  .lineTo(150, 150)
  .lineTo(0, 150)
  .closePath();

// all functions should have booleans to not add to stage
r.rect(100, 100, 500, 300, false).addTo(r.stage);
wave.copy(false).addTo(myGroup);


// Translations
// --------------------------------------------

wave.translate(100, 100)
  .rotate(Math.PI);


// Colors
// --------------------------------------------

rect.fill("#ff0000");
rect.fill(255, 0, 0);
rect.fill(r.HSB, 360, 100, 100)
rect.fillColor.lighten(0.5).desaturate(0.1);


// Groups
// --------------------------------------------

var child1 = r.rect(0, 0, 100, 100);
var child2 = r.rect(0, 0, 100, 100);

var parent = r.group(100, 100)
  .add(child1, child2)
  .translate(200, 200)

// now add parent to 300x300 inside superParents 100x100 origin
// so it's on 400x400
var superParent = r.group(0, 0)
  .add(parent)
  .translate(100, 100)


// Shape stuff
// --------------------------------------------

// bounds
wave.getBounds();

// intersection
var ellipse = r.ellipse(0, 0, 200, 200);
var rect = r.rect(600, 400, 200, 200);

r.on('draw', function() {

  ellipse.position(r.mouseX, r.mouseY);

  if(ellipse.intersects(rect)) {

    // automatically add to stage with lifetime
    ellipse.intersection(rect).lifetime(12);
  }

});


// Splitting a path into a polygon
// --------------------------------------------

// paths have anchors
_.each(poly.anchors, function(v) {
  console.log(v)
});

// automatically added to the stage
var poly = wave.toPolygon(r.UNIFORM, 25);

// or manual
var poly = new r.Polygon(line, r.UNIFORM, 25);

// polygons have vectors
_.each(poly.vertices, function(p) {
  console.log(p)
});


// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Clipping_and_masking
// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Other_content_in_SVG
// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Gradients
