## 0.4.0

This is a release that **changes the existing API**. It fixes a number of problem discovered while using Rune.js. Most important, it implements a new React-inspired rendering mechanism that only re-renders changed objects. The library used to loop through every object to generate a virtual DOM patch. This would make the actual DOM change fast, but it still took up a lot of memory to iterate through every object. This new release changes the rendering so only shapes that changes are re-rendered in memory, making the library efficient both in the memory cycles and in the the DOM manipulation phase.

- `.vars` is now called `.state`
- `draw` event is now called `update`. This should make it clearer to not to Processing-style overpainting.
- Implemented a new rendering strategy. This makes it a no no to change`.state` directly without calling the `.changed()` method on a shape. `.changed()` is automatically called for all shape functions that change the shape. Render time for 10k shapes fell from 12 seconds to 400 milliseconds.
- `Line` method `move()` now moves the entire line and not just the starting position.
- Shape functions no longer accept vectors. Will re-implement soon.

## 0.3.0

- All mouseevents were off when the window scrolled

## 0.3.1

- Code is now node modules instead of ES6. This makes a lot of things easier.
- Rendering is now a bit faster.

## 0.2.19

- Most drawing functions now take vector arguments. Thanks to @philcn.
- Added `Utils.round()` to fix browser inconsistencies. Thanks for @danielmcq.

## 0.2.18

- `Polygon` method `centroid()` now calculates centroid as closed shape.

## 0.2.17

- Publish failed. Republishing.

## 0.2.16

- SVG now has correct namespaces
- Rendering is improved drastically by using internal color values

## 0.2.15

- Debug mode now works in groups too

## 0.2.14

- Adding `Image` to draw images in a SVG element
- `strokeWidth` is now scaled when calling `.scale()` on a shape
- Adding `round()` function to rectangles

## 0.2.13

- Certain shape variables weren't copied when using `copy()`. Now fixed.

## 0.2.12

- Adding `mousedown` mouse event
- Adding `mouseup` mouse event
- Adding `click` mouse event

## 0.2.11

- Adding `scale()` to all shapes
- Adding `scale()` to groups

## 0.2.10

- Removing colorString library to shrink size of library.

## 0.2.9

- `Polygon` now has a `contains(x,y)` function to know whether a point is inside or outside a polygon
- Group and shapes now have a `stagepos()` function that returns their absolute position according to the stage
- Removing `Groupable` mixin in favor of `Shape`
- Replacing underscore with lodash to shrink size of library
- Updated code to use Babel 6
- Removed bezier.js library to shrink size of library

## 0.2.8

- Text shapes are not copied with all their variables when calling `copy()`.

## 0.2.7

- Adding `Grid` `getModule` to easily access a grid module.
- Changing internal represenation of module from array of arrays to a single array of modules.

## 0.2.6

- Triangle `move()` now moves the entire triangle, not just the starting point.

## 0.2.5

- Fixing bugs around variables shadowing function names, which makes `Rune.js` work in Safari and most mobile browsers.

## 0.2.4

- Fixing a bug around `requestAnimationframe` not getting cancelled if used within the `draw` listener. [issue](https://github.com/runemadsen/rune.js/issues/4)

## 0.2.3

- NPM package now ships `rune.browser.js` for easy of install.

## 0.2.2

- Quick fix to not break node when checking for window.

## 0.2.1

- The npm package no longer has a `Rune` global. Require statement has to look like `var Rune = require('rune.js')`

## 0.2.0

- Complete rewrite of test structure and gulpfile used to generate NPM and Github releases. NPM tarball now actually works.

## 0.1.6

- `Rune.js` is now tested and working in server-side node. Hurrah!

## 0.1.5

- Removing `rgba()` fill and stroke values and introducing straight up `rgb()` with `fill-opacity` and `stroke-opacity`, as Illustrator does not recognize `rgba()`.


## 0.1.4

- Adding direct access to `Color.Convert` functions.

## 0.1.3

- Adding `Triangle` and `r.triangle()`
- Fixing some math in the `Polygon` `bounds()` function
- Bounds and `bounds()` and `centroid` now return a `Vector` that hasn't the shape positions added. They now return internal representations.

## 0.1.2

- Rerelease because I don't understand how GitHub releases work.

## 0.1.1

- `Grid` `gutterX` and `gutterY` has been renamed to `gutterWidth` and `gutterHeight`.
- Added `removeParent()` to all shapes to remove them from parent
- Added `addParent()` to all shapes to add them to parent

## 0.1.0

- Initial release!
