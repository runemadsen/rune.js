---
layout: default
title: "Rune.js Documentation"
bodyClass: "documentation"
---

# Documentation

This is the technical documentation for Rune.js. See [Getting started](index.html) for a quick introduction on how to use the library. The [examples](http://printingcode.runemadsen.com/examples/) might also be a good place to look.

## The Rune instance

### `new Rune(options)`

Creates a new instance to be used for all drawing methods. You can use multiple instances on a single page. `options` is a javascript object that can hold the following properties.

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

### `polygon(x, y, parent)`

Shortcut to create a new polygon object and add it to a group. See above or the [`Rune.Polygon`](#runepolygon) documentation.

### `path(x, y, parent)`

Shortcut to create a new path object and add it to a group. See above or the [`Rune.Path`](#runepath) documentation.

### `text(text, x, y, parent)`

Shortcut to create a new text object and add it to a group. See above or the [`Rune.Text`](#runetext) documentation.

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

### `addParent(parent)`

Changes the parent of the shape to group passed in the `parent` parameter.

### `removeParent()`

Detaches the shape from its parent group, making it invisible.

### `toPolygon(options, parent)`

Converts the shape to a polygon by converting lines and curves to equally spaced vectors. `options` is a javascript object that currently only takes a single property.

- `spacing` - Number. The number of pixels between each vector in the new polygon.

The `parent` parameter uses the same logic as the shorthand shape functions on the Rune instance: If not set, the new copy will be added to the same parent as the base shape. If `parent` is a group, the new copy will be added to this group. If `parent` is false, the new copy will not have a parent.

Note that on `Rune.Path` object, this function is called `toPolygons()`, as it returns an array of polygons due to the nature of the path shape.

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

## Rune.Rectangle

### `new Rune.Rectangle(x, y, width, height)`

Creates a new rectangle object. The new rectangle is not added to the stage.

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

## Rune.Polygon

### `new Rune.Polygon(x, y)`

Creates a new polygon object. The new polygon is not added to the stage.

### `lineTo(x, y)`

Creates a line from the current position to the new position. The first time `lineTo()` is called, it the `xy` determines the starting position of the shape.

### `length()`

Returns the length of the polygon, calculated by combining the length of all vectors in the polygon.

### `vectorAt(scalar)`

Returns a `Rune.Vector` describing a point on the outline of the polygon.

- `scalar` - A float between 0 and 1. Passing `0.5` will return the point midway on the outline of the polygon.

### `vectorAtLength(length)`

Returns a `Rune.Vector` describing a point on the outline of the polygon.

- `length` - A number between 0 and `length()` of the polygon. Passing `100` will return the point 100 pixels along the outline of the polygon.

### `bounds()`

Returns a javascript object with `x`, `y`, `width` and `height` properties describing the outer bounds of the polygon. This is the external representation of the bounds, which means that the polygon `xy` values are added to the bounds.

### `centroid()`

Returns a `Rune.Vector` holding the centroid of the shape. This is the external representation of the centroid, which means that the polygon `xy` values are added to the centroid.


## Rune.Path

### `new Rune.Path(x, y)`

Creates a new path object. The new path is not added to the stage.

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
