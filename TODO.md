## Codebase

### Must

- [ ] ALL SHAPES: `polygonize(segmentatoroptions={})`
- [ ] Polygon and Path: `bounds()` // return {x,y,w,h}
- [ ] `path.centroid()` // return vector
- [ ] Polygon and Path: `vectorAt(norm)`
- [ ] Polygon and Path: `intersects(pathorpoly)`
- [ ] Polygon and Path: `intersection(pathorpoly)` (xor, union, diff?)
- [ ] Vector multiply
- [ ] Path arc
- [ ] SVG fill-rule
- [ ] Rune.Font plugin
- [ ] `keypressed`
- [ ] masking / clipping
- [ ] Gradients

### Nice to have 

- [ ] whitelist values passed directly to SVG. Throw error if not supported.
- [ ] All `Rune.` constants should be accessible as `r.`
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
- bounds and centroid are relative to to internal 0,0. Must add x,y of shape and groups to get the absolute.

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
