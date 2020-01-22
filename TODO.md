# TODO

- Rename `scale()` to `resize()` and add `scale()` that uses transform scale
- Docs: `start()` and `end()`
- Rename circle.radius to diameter? Change toPolygon so they don't double in size
- Change `draw` event to `update` event in doc
- Cache `.length()` on Polygon and Path if object did not call `changed()`

## Backlog

- Ability to add custom attributes to any shape
- Clipping path support
- mouse events should work on individual shapes
- Polygon `intersects()` http://bjornharrtell.github.io/jsts/
- Polygon `intersection()` http://bjornharrtell.github.io/jsts/
- Polygon `difference()` http://bjornharrtell.github.io/jsts/
- Polygon `union()` http://bjornharrtell.github.io/jsts/
- Polygon `symdifference()` http://bjornharrtell.github.io/jsts/
- Text layout with bounds, lineHeight, etc
- Filters
- Blend modes
- masking
- Gradients
- `textWidth()`
- `keypressed`
- requestAnimationFrame should work in node
- Debug should have full polygon vectors and anchor vectors
- Ability to set debug line color and debug circle color
