---
layout: default
title: "Rune.js Documentation"
bodyClass: "documentation"
---

# Documentation

This is the technical documentation for Rune.js. See [Getting started](index.html) for a quick introduction on how to use the library.

## `Rune`

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

Shortcut to create a new circle object and add it to a group. See above or [`new Rune.Circle()`](#runecircle)

### `ellipse(x, y, width, height, parent)`

Shortcut to create a new ellipse object and add it to a group. See above or [`new Rune.Ellipse()`](#runeellipse)

### `rect(x, y, width, height, parent)`

Shortcut to create a new rectangle object and add it to a group. See above or [`new Rune.Rectangle()`](#runerectangle)

### `polygon(x, y, parent)`

Shortcut to create a new polygon object and add it to a group. See above or [`new Rune.Polygon()`](#runepolygon)

### `path(x, y, parent)`

Shortcut to create a new path object and add it to a group. See above or [`new Rune.Path()`](#runepath)

### `text(text, x, y, parent)`

Shortcut to create a new text object and add it to a group. See above or [`new Rune.Text()`](#runetext)

### `grid(options, parent)`

Shortcut to create a new grid object and add it to a group. See above or [`new Rune.Grid()`](#runegrid)

### `group(x, y, parent)`

Shortcut to create a new group object and add it to a group. See above or [`new Rune.Group()`](#runegroup)

### `play()`

Starts triggering the `draw` event `frameRate` times a second. The `draw()` function will automatically be called on every frame.

### `pause()`

Starts triggering the `draw` event.

### `on(event, callback)`

Used to listen to events. This is how you would listen to the `draw` even after calling `play()`.

```js
r.on('draw', function() {
  console.log("here") 
});
```

### `appendTo(container)`

### `getEl()`

### `UTIIIILS`

## `Rune.Line`

### `new Rune.Line(x1, y1, x2, y2)`

## `Rune.Circle`

### `new Rune.Circle(x, y, radius)`

## `Rune.Ellipse`

### `new Rune.Ellipse(x, y, width, height)`

## `Rune.Rectangle`

### `new Rune.Rectangle(x, y, width, height)`

## `Rune.Text`

### `new Rune.Text(text, x, y)`

## `Rune.Polygon`

### `new Rune.Polygon(x, y)`

## `Rune.Path`

### `new Rune.Path(x, y)`