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