## Codebase

### Must


Segmentor:
UNIFORMLENGTH = all points have equal distance, even though it's straight or curved lines. Must get a number of pixels between each.
ADAPTATIVE = lines don't get segmented. Curves vary depending on their slope. A single curve gets denser around the curved areas.
UNIFORMSTEP = lines don't get segmented. Curves are just uniformly segmented by incrementing theta.


- [ ] ALL SHAPES: `toPolygon(segmentatoroptions={})`
- [ ] ALL SHAPES: `bounds()`
- [ ] ALL SHAPES: `centroid()`
- [ ] Polygon and Path: `vectorAt(norm)`
- [ ] Polygon and Path: `intersects(pathorpoly)`
- [ ] Polygon and Path: `intersection(pathorpoly)` (xor, union, diff?)
- [ ] Path arc
- [ ] Rune.Font plugin
- [ ] `keypressed`
- [ ] masking / clipping
- [ ] Gradients

### Nice to have 

- [ ] whitelist values passed directly to SVG. Throw error if not supported.
- [ ] Default styleable settings
- [ ] Download SVG file (use SVG Crowbar)
- [ ] Groups should bubble down changes to children, so all children know their true x and y
- [ ] SVG parser
- [ ] `r.triangle()`

## Documentation

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