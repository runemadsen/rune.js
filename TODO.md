# TODO

## Next up

- Var should be called `state`
- Move all shape state into .state (make getters for .modules, etc)
- Color
  - stroke and fill getters
  - Assign parent in shape setters
  - Call parent changed in col functions
  - Add test
- Render: add setters for all .vars
      - circle .radius(rad, bool)
      - sizeable width() and height()
- Figure out vars.object changed (fill, vector, etc) or just say "call changed()"?
- mouse events should work on individual shapes
- Polygon `intersects()` http://bjornharrtell.github.io/jsts/
- Polygon `intersection()` http://bjornharrtell.github.io/jsts/
- Polygon `difference()` http://bjornharrtell.github.io/jsts/
- Polygon `union()` http://bjornharrtell.github.io/jsts/
- Polygon `symdifference()` http://bjornharrtell.github.io/jsts/

docs:
  - Rewrite as natural language ("Circle" . You can create a circle in two ways: new Rune.Circle or r.circle)
  - addParent -> addTo
  - draw -> update
  - new shape setters

## Backlog

- Text layout with bounds, lineHeight, etc
- Filters
- Blend modes
- masking
- Gradients
- Finish Runegen and use for Rune.Font and other plugins
- `textWidth()`
- `keypressed`
- requestAnimationFrame should work in node
- Debug should have full polygon vectors and anchor vectors
- Ability to set debug line color and debug circle color
- SVG parser


## Ideas
