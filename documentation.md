---
layout: default
title: "Rune.js Documentation"
bodyClass: "documentation"
---

<div id="toc"></div>

# Documentation

This is the technical documentation for Rune.js. See [Getting started](index.html) for a quick introduction on how to use the library. The [examples](http://printingcode.runemadsen.com/examples/) might also be a good place to look.

## The Rune instance

### `new Rune(options)`

Creates a new instance to be used for all drawing methods. You can use multiple instances on a single page. `options` is a JavaScript object that can hold the following properties.

- `container` - String selector or DOM element used as container for the SVG.
- `width` - Number. The width of the SVG
- `height` - Number. The height of the SVG
- `frameRate` - Number. The framerate used for the draw event
- `debug` - Boolean. Enables debug mode

### `draw()`

Draws the current stage graph to the SVG element. Will automatically be called when using `play()` and the `draw` event.

### `line(x1, y1, x2, y2, parent)`

Shortcut to create a new line object and add it to a group. Accepts same parameters as `new Rune.Line()`, but if `parent` is not set, it will add the object to the stage. If `parent` is a group, it will add the object as a child of this group. If `parent` is false, it will not add the object to any group, thus behaving exactly like `new Rune.Line()`.

### `circle(x, y, radius, parent)`

Shortcut to create a new circle object and add it to a group. See above or the [`Rune.Circle`](#runecircle) documentation.

### `ellipse(x, y, width, height, parent)`

Shortcut to create a new ellipse object and add it to a group. See above or the [`Rune.Ellipse`](#runeellipse) documentation.

### `rect(x, y, width, height, parent)`

Shortcut to create a new rectangle object and add it to a group. See above or the [`Rune.Rectangle`](#runerectangle) documentation.

### `triangle(x, y, x2, y2, x3, y3)`

Shortcut to create a new triangle object and add it to a group. See above or the [`Rune.Triangle`](#runetriangle) documentation.

### `polygon(x, y, parent)`

Shortcut to create a new polygon object and add it to a group. See above or the [`Rune.Polygon`](#runepolygon) documentation.

### `path(x, y, parent)`

Shortcut to create a new path object and add it to a group. See above or the [`Rune.Path`](#runepath) documentation.

### `text(text, x, y, parent)`

Shortcut to create a new text object and add it to a group. See above or the [`Rune.Text`](#runetext) documentation.

### `image(url, x, y, width, height)`

Shortcut to create a new image object and add it to a group. See above or the [`Rune.Image`](#runeimage) documentation.

### `grid(options, parent)`

Shortcut to create a new grid object and add it to a group. See above or the [`Rune.Grid`](#runegrid) documentation.

### `group(x, y, parent)`

Shortcut to create a new group object and add it to a group. See above or the [`Rune.Group`](#runegroup)

### `play()`

Starts triggering the `draw` event `frameRate` times a second. The `draw()` function will automatically be called on every frame.

### `pause()`

Stop triggering the `draw` event.

### `on(event, callback)`

Used to listen to events. This is how you would listen to the `draw` even after calling `play()`.

```js
r.on('draw', function() {
  console.log("here")
});
```

The following events are supported: `draw`, `mousemove`, `mousedown`, `mouseup`, `click`.

### `appendTo(container)`

If you don't use the `container` option when instantiating the Rune object, you can use this to append the SVG element to a container on the page. You can omit both the container and `appendTo()` and use Rune to render SVG's server-side in node. This is still a bit untested.

### `getEl()`

Returns the SVG element.

## Static helpers

### `Rune.random(low, high)`

Returns a random float between two numbers. Can also be used with a single number as parameter, which will set `low` to 0.

### `Rune.degrees(radians)`

Converts radians to degrees.

### `Rune.radians(degrees)`

Converts degrees to radians.

## All shapes

All shape instances share the following functions.

### `fill(...)`

Sets the fill of the shape according to the parameters passed into the function. All of the following inputs are valid.

```js
fill(255) // Grayscale
fill(255, 0.1) // Grayscale and alpha
fill(255, 255, 255) // RGB
fill(255, 255, 255, 0.5) // RGBA
fill('hsv', 360, 100, 100) // HSV
fill('hsv', 360, 100, 100, 0.5) // HSVA
fill("#FF000") // Hex string
fill("#FF000", 0.5) // HEX string and alpha
fill(new Rune.Color(...)) // Color object
fill(false) // no fill
```

### `stroke(...)`

Set the stroke of the shape according to the parameters passed into the function. Accepts same inputs as the `fill()` function above.

### `move(x, y, relative)`

Moves the shape to a new position on the screen. If `relative` is set to `true`, the new position will be added to the current position of the shape.

### `rotate(degrees, x, y, relative)`

Rotates the shape to a degree on the screen. If `x` and `y` is not set, the shape will rotate around the position of its parent group. If `x` and `y` is set, the shape will rotate around this position inside its parent group. If `relative` is set to `true`, the degrees will be added to the current rotation of the shape.

### `copy(parent)`

Makes a copy of the shape. The `parent` parameter uses the same logic as the shorthand shape functions on the Rune instance: If not set, the new copy will be added to the same parent as the base shape. If `parent` is a group, the new copy will be added to this group. If `parent` is false, the new copy will not have a parent.

### `scale(scalar)`

Can be used to scale both shapes and groups. If called on a shape, the shape will scale while staying at the same position. If called on a group, the group will scale all children, including their `x` and `y` positions.

### `addParent(parent)`

Changes the parent of the shape to group passed in the `parent` parameter.

### `removeParent()`

Detaches the shape from its parent group, making it invisible.

### `toPolygon(options, parent)`

Converts the shape to a polygon by converting lines and curves to equally spaced vectors. `options` is a JavaScript object that currently only takes a single property.

- `spacing` - Number. The number of pixels between each vector in the new polygon.

The `parent` parameter uses the same logic as the shorthand shape functions on the Rune instance: If not set, the new copy will be added to the same parent as the base shape. If `parent` is a group, the new copy will be added to this group. If `parent` is false, the new copy will not have a parent.

Note that on `Rune.Path` object, this function is called `toPolygons()`, as it returns an array of polygons due to the nature of the path shape. Also note that `Rune.Polygon` also has a `toPolygon` function that can be used to divide the polygon into a new polygon with evenly spaced vectors.

### `strokeWidth(num)`

Sets the width of the stroke in pixels. Defaults to 1.

### `strokeCap(type)`

Specifies the shape to be used at the end of open lines when they are stroked.

- `type` - String. Options are `"butt"` (default), `"round"`, and `"square"`

### `strokeJoin(type)`

Specifies the shape to be used at the corners of paths or basic shapes when they are stroked.

- `type` - String. Options are `"miter"` (default), `"round"`, and `"bevel"`

### `strokeMiterlimit(num)`

When two lines meet at a sharp angle and `strokeJoin` has been set to `miter`, it is possible for the miter to extend far beyond the thickness of the line stroking the path. `strokeMiterLimit()` imposes a limit on the ratio of the miter length to the `strokeWidth`. When the limit is exceeded, the join is converted from a miter to a bevel.

### `strokeDash(dasharray)`

Can be used to turn the stroke into dashes. See the [Mozilla Developer Documentation](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray) for more info.

- `dasharray` - String. Comma or whitespace-separated list of dasharray.


### `strokeDashOffset(offset)`

Specifies the distance into the dash pattern to start the dash.

- `offset` - Percentage string or number.

### `stagepos()`

Returns the absolute position of the shape or group in relation to the canvas `0,0`. This is helpful if you have a lot of nested groups, and you want to find the position of a shape in relation to the canvas.


## Rune.Rectangle

### `new Rune.Rectangle(x, y, width, height)`

Creates a new rectangle object. The new rectangle is not added to the stage.

### `round(x, y)`

Gives the rectangle rounded corners.

- `x` - x-axis radius of the ellipse used to round off the corners of the rectangle
- `y` - (optional) y-axis radius of the ellipse used to round off the corners of the rectangle

## Rune.Line

### `new Rune.Line(x1, y1, x2, y2)`

Creates a new line object. The new line is not added to the stage.

- `x1` - The x position of the start of the line
- `y1` - The y position of the start of the line
- `x2` - The x position of the end of the line
- `y2` - The y position of the end of the line

## Rune.Circle

### `new Rune.Circle(x, y, radius)`

Creates a new circle object. The new circle is not added to the stage.

## Rune.Ellipse

### `new Rune.Ellipse(x, y, width, height)`

Creates a new ellipse object. The new circle is not added to the stage.

## Rune.Triangle

### `new Rune.Triangle(x, y, x2, y2, x3, y3)`

Creates a new triangle object with points at the 3 `xy` positions.

## Rune.Polygon

### `new Rune.Polygon(x, y)`

Creates a new polygon object. The new polygon is not added to the stage.

### `lineTo(x, y)`

Creates a line from the current position to the new position. The first time `lineTo()` is called, it the `xy` determines the starting position of the shape. All outlines created via `lineTo` are relative to the `xy` position of the polygon.

### `length()`

Returns the length of the polygon, calculated by combining the length of all vectors in the polygon.

### `vectorAt(scalar)`

Returns a `Rune.Vector` describing a point on the outline of the polygon.

- `scalar` - A float between 0 and 1. Passing `0.5` will return the point midway on the outline of the polygon.

### `vectorAtLength(length)`

Returns a `Rune.Vector` describing a point on the outline of the polygon.

- `length` - A number between 0 and `length()` of the polygon. Passing `100` will return the point 100 pixels along the outline of the polygon.

### `bounds()`

Returns a JavaScript object with `x`, `y`, `width` and `height` properties describing the outer bounds of the polygon. This is the internal representation of the bounds, which means that the polygon `xy` values are not added to the bounds.

### `centroid()`

Returns a `Rune.Vector` holding the centroid of the shape. This is the internal representation of the centroid, which means that the polygon `xy` values are not added to the centroid.

### `contains(x, y)`

Returns a boolean to indicate whether or not the `xy` point is inside the polygon. If the polygon belongs belongs to the stage, this will be calculated using the absolute position of the polygon to the stage. If the polygon does not belong to a group, this will be calculated using just the polygon position and outline.


## Rune.Path

### `new Rune.Path(x, y)`

Creates a new path object. The new path is not added to the stage.

### `moveTo(x, y)`

Moves the current position to the new `xy` position. By default, all paths start at `0,0`, and calling `moveTo()` will change this. Calling `moveTo()` after other drawing methods like `lineTo()` or `moveTo()` will create a new subpath in the path. All moves are relative to the `xy` position of the path.

### `lineTo(x, y)`

Creates a line from the current position ending at `xy`. All outlines created via `lineTo()` are relative to the `xy` position of the path. If `lineTo()` is used as the first function in an empty path, it will draw a line from `0,0` to `xy`.

### `curveTo(...)`

Create a curve from the current position in the path. There are two different types of curves: a quad bezier (a bezier curve with a single control point), and a cubic bezier (a bezier curve with two control points).

The following will draw a quad bezier curve from the current path position to `200,0`, with the curve going through a single control point at `100,100`.

```js
curveTo(100, 100, 200, 0);
```

The following will draw a cubic bezier curve from the current path position to `200,0`, with the curve going through two control points at `100,100` and `200,200`.

```js
curveTo(100, 100, 200, 200, 200, 0);
```

### `closePath()`

Closes the path by drawing a straight line back to the beginning of the subpath.

### `subpaths(parent)`

Divides the path into an array of paths, where each path only has a single subpath. The `parent` parameter uses the same logic as the shorthand shape functions on the Rune instance: If not set, the new copy will be added to the same parent as the base shape. If `parent` is a group, the new subpaths will be added to this group. If `parent` is false, the new subpaths will not have a parent.

### `length()`

Returns the combined length of all subpaths in the path.

### `vectorAt(scalar)`

Returns a `Rune.Vector` describing a point on the outline of the path.

- `scalar` - A float between 0 and 1. Passing `0.5` will return the point midway on the outline of the path.

### `vectorAtLength(length)`

Returns a `Rune.Vector` describing a point on the outline of the path.

- `length` - A number between 0 and `length()` of the path. Passing `100` will return the point 100 pixels along the outline of the path.

### `fillRule(type)`

Sets the fillrule for the subpaths. This can be used to add or subtract subpath from one another. See [Understanding the SVG fill-rule property](http://www.sitepoint.com/understanding-svg-fill-rule-property/) for more info.

- `type` - String. Either `"nonzero"` or `"evenodd"`.

## Rune.Text

### `new Rune.Text(text, x, y)`

Creates a new text object. The new text is not added to the stage. The text object currently does not support bounds and multiple lines.

- `text` - String to be displayed
- `x` - x position of the text baseline
- `y` - y position of the text baseline

### `fontFamily(font)`

Name of the font to use. You can use the names of all default system fonts, or any webfonts imported on the page, for example Google Fonts.

- `font` - String. Set to font family name, e.g. `"Georgia`.

### `fontSize(size)`

Sets the size of the font. `size` can be a number in pixels, or a string with other valid CSS values.

### `textAlign(align)`

Specifies how the text should flow to its `x` and `y` position. Options are `"left"`, `"center"`, and `"right"`.

### `fontStyle(style)`

Specifies the font style to use. Options are `"normal"`, `"italic"`, and `"oblique"`

### `fontWeight(weight)`

Specifies the font weight to use. `weight` can be a string of `"normal"` or `"bold"`, or a number corresponding to the font weight. This is especially important when using webfonts like Google Fonts.

### `letterSpacing(spacing)`

Sets the spacing between the letters. `spacing` can be a number in pixels, or a string with other valid CSS values.

### `textDecoration(textDecoration)`

Specifies the font decoration. `weight` can be a string of `"none"`, `"underline"`, `"overline"`, `"line-through"`, and `"blink"`.

## Rune.Image

### `new Rune.Image(url, x, y, width, height)`

Creates a new image object that is not added to the stage. SVG does not support initial image sizes, so you must specify a width and a height for the image.

## Rune.Group

### `new Rune.Group(x, y)`

Creates a new group object with no children. The new group is not added to the stage.

### `add(child)`

Adds a child to the group. If the child has an existing parent, it will be removed before adding it to the group.

### `remove(child)`

Removes a child from the group.

## Rune.Grid

### `new Rune.Grid(options)`

Creates a new grid object. The new grid is not added to the stage. `options` is a JavaScript object that can hold the following options.

- `x` - Number. The x position of the grid
- `y` - Number. The y position of the grid
- `columns` - Number. Defines the number of columns in the grid. Defaults to 10.
- `rows` - Number. Defines the number of rows in the grid. Defaults to 1
- `gutterWidth` - Number. Defines the width of the space between modules
- `gutterHeight` - Number. Defines the height of the space between modules
- `gutter` - Number. Shorthand way to define the same gutter width and height
- `moduleWidth` - Number. Defines the width of each module in the grid
- `moduleHeight` - Number. Defines the height of each module in the grid
- `width` - Number. Defines the full width of the grid, including the gutter and module widths. Do not use with `moduleWidth`.
- `height` - Number. Defines the full height of the grid, including the gutter and module heights. Do not use with `moduleheight`.

### `add(child, column, row)`

Adds a child to one of the module grids specified by the column and row number.

## Rune.Color

### `new Rune.Color(...)`

Creates a new color object. Accepts the same inputs as the `fill()` and `stroke()` functions.

### Getters

Use the following functions to return a JavaScript object with the color values in a specific space.

```js
rgb();
hsv();
hsl();
hwb();
cmyk();
```

The following methods can be used to return an array with the same color values.

```js
rgbArray();
hsvArray();
hslArray();
hwbArray();
cmykArray();
```

### Manipulation

The following chainable methods can be used to manipulate the color.

```js
negate()         // rgb(0, 100, 255) -> rgb(255, 155, 0)

lighten(0.5)     // hsl(100, 50%, 50%) -> hsl(100, 50%, 75%)
darken(0.5)      // hsl(100, 50%, 50%) -> hsl(100, 50%, 25%)

saturate(0.5)    // hsl(100, 50%, 50%) -> hsl(100, 75%, 50%)
desaturate(0.5)  // hsl(100, 50%, 50%) -> hsl(100, 25%, 50%)
greyscale()      // #5CBF54 -> #969696

whiten(0.5)      // hwb(100, 50%, 50%) -> hwb(100, 75%, 50%)
blacken(0.5)     // hwb(100, 50%, 50%) -> hwb(100, 50%, 75%)

clearer(0.5)     // rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 0.4)
opaquer(0.5)     // rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 1.0)

rotate(180)      // hsl(60, 20%, 20%) -> hsl(240, 20%, 20%)
rotate(-90)      // hsl(60, 20%, 20%) -> hsl(330, 20%, 20%)

mix(new Rune.Color("#FFFF00")) // cyan -> rgb(128, 255, 128)
```

### Luminosity

Get the [WCAG luminosity](http://www.w3.org/TR/WCAG20/#relativeluminancedef) of the color. 0 is black, 1 is white.

```js
luminosity();  // 0.412
```

Get the [WCAG contrast ratio](http://www.w3.org/TR/WCAG20/#contrast-ratiodef) to another color from 1 (same color) to 21 (white/black contrast).

```js
contrast(new Rune.Color("#FF0000"))
```

Get whether the color is "light" or "dark", useful for deciding text color.

```js
light();
dark();
```

### `copy()`

Returns a copy of the color object.

## Rune.Vector

### `new Rune.Vector(x, y)`

A vector is a very simple object that has an `x` and `y` variable. This returns a new Vector.

### `set(x, y)`

Updates the vector with new `x` and `y` values.

### `add(vector)`

Adds `vector` to the base vector and returns a new vector. This does not change the original vectors.

### `sub(vector)`

Subtracts `vector` from the base vector and returns a new vector. This does not change the original vectors.

### `multiply(vector)`

Multiplies `vector` with the base vector and returns a new vector. This does not change the original vectors.

### `divide(vector)`

Divides the base vector with  `vector` and returns a new vector. This does not change the original vectors.

### `distance(vector)`

Returns the distance between two vectors.

### `distanceSquared(vector)`

Returns the distance squared between two vectors.

### `lerp(vector, scalar)`

Returns the linear interpolation of the two vectors by a `scalar` amount.

- `Scalar`. Normalized float between 0 and 1.

### `dot(vector)`

Returns the dot product of the two vectors.

### `length()`

Returns the length of the vector.

### `lengthSquare()`

Returns the squared length of the vector.

### `normalize()`

Normalizes the vector values so they are between 0-1.

### `rotation()`

Returns the rotation of the vector.

### `rotate(deg)`

Rotates the vector relative to its current rotation.

### `copy()`

Returns a copy of the vector.


## Rune.Anchor

An anchor is used to describe the individual points on a path, that being moves, lines, curves or closes.

### `setMove(x, y)`

Often used like `new Rune.Anchor().setMove(x,y)` to create a new anchor holding move command.

### `setLine(x, y)`

Often used like `new Rune.Anchor().setLine(x,y)` to create a new anchor holding line command.

### `setCurve(...)`

Often used like `new Rune.Anchor().setCurve(...)` to create a new anchor holding a quad or bezier curve. Accepts the same parameters as the path `curveTo()` function.

### `setClose()`

Often used like `new Rune.Anchor().setClose()` to create a new anchor holding close command.

### `add(vector)`

Adds a vector to an anchor.

### `sub(vector)`

Subtracts a vector from an anchor.

### `length()`

Returns the length of the anchor, whether it's a curve or a line. Move anchors will have a length of 0, while close anchors will throw an error.

### `vectorAt(scalar)`

Returns a `Rune.Vector` with a point on the anchor defined by `scalar`, a normalized float from 0 to 1. For example, if `scalar` is 0.5 and it's called on a curve anchor, this function will return the point that is midways on the curve.
