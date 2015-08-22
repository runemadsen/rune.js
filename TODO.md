## Codebase

### Must

- [ ] More functions from this: http://pomax.github.io/bezierjs/
- [ ] `path.toPolygon`
- [ ] `stagePos()` on shapes and groups to get absolute position
- [ ] `centroid`, `bounds`, `vectorAt` should have flag to either output according to x,y or according to stagePos.
- [ ] Ellipse has width and height but I think they are radius? need to /2
- [ ] `toPolygon` should copy mixin vars too!
- [ ] `toPolygon` should have stage handling too! pass in group or false.
- [ ] `keypressed`
- [ ] masking / clipping
- [ ] Gradients

### Nice to have 

- [ ] Ability to set debug line color and debug circle color
- [ ] Geomelement `contains`
- [ ] Geomelement `intersects` and `intersection`, `xor`, `union`, `diff`
- [ ] Rune.Font plugin
- [ ] whitelist values passed directly to SVG. Throw error if not supported.
- [ ] Default styleable settings
- [ ] Download SVG file (use SVG Crowbar)
- [ ] Groups should bubble down changes to children, so all children know their true x and y
- [ ] SVG parser
- [ ] `r.triangle()`

## Documentation

- [ ] ALL THE DIFFERENT `toPolygon` options for each object.

### Getting Started
- Constructor options (width, height, framerate, etc)

### Basic concepts
- chaining and `.vars`
- `draw` event and `play` and `pause`
- mousemove
- debug mode

### Shapes

#### Introduction
- creating shapes and the stage (r.shapetype())
- The way `.move` works for all polygons and shapes, as well as x, y and translate PLUS relative
- `rotate` relative and rotationX and rotationY
- 

#### Circle

#### Ellipse

#### Polygon
- closes automatically
- bounds and centroid doesn't include parent translations.

#### Path
- Path and `closePath()`. You can have multiple subpaths in one

### Color
- Link to color documentation.
- Sharing the same color across multiple objects (pass color into fill).

### Typography
- text, all its functions and constants used.

### Images

### Grid systems
- Grids, nested grids, rotation, etc

### Other
- `random`
