- [ ] `.rotate` function should take optional x,y to rotate around given axis
- [ ] Group translation
- [ ] Paths and polygons should be able to translate without putting them in a group. Figure out how to keep the API clean while still preserving SVG spec. For example should polygon have `move()` that affect translate? Then all points are relative to that x and y? I THINK SO! Also, right now rotate is lumped in with x,y which is weird for paths and polygons. It should probably be Moveable and Transformable? BUT, .move should move everything.
- [ ] SVG parser


## Documentation

- Different shape types
- The way `.move` works for all polygons and shapes, as well as x and y values
