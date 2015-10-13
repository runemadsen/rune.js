## 0.1.6

- `Rune.js` is now tested and working in server-side node. Hurrah!

## 0.1.5

- Removing `rgba()` fill and stroke values and introducing straight up `rgb()` with `fill-opacity` and `stroke-opacity`, as Illustrator does not recognize `rgba()`.


## 0.1.4

- Adding direct access to `Rune.Color.Convert` functions.

## 0.1.3

- Adding `Rune.Triangle` and `r.triangle()`
- Fixing some math in the `Rune.Polygon` `bounds()` function
- Bounds and `bounds()` and `centroid` now return a `Rune.Vector` that hasn't the shape positions added. They now return internal representations.

## 0.1.2

- Rerelease because I don't understand how GitHub releases work.

## 0.1.1

- `Rune.Grid` `gutterX` and `gutterY` has been renamed to `gutterWidth` and `gutterHeight`.
- Added `removeParent()` to all shapes to remove them from parent
- Added `addParent()` to all shapes to add them to parent

## 0.1.0

- Initial release!