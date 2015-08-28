---
layout: default
title: "Rune.js Documentation"
---

<div id="logo"></div>

# Rune.js

Rune.js is a JavaScript library for programming graphic design systems with SVG. It features a chainable drawing API, an unobtrusive scene graph, and a range of features aimed specifically at graphic designers: native support for color conversion, grid systems, typography, pixel iteration, as well as an expanding set of computational geometry helpers. Oh, and it uses [virtual-dom](https://github.com/Matt-Esch/virtual-dom) under the hood.


## Download

Download info to Github here!


## Getting started

First download the `rune.js` file and place it next to your HTML document. Then, add a link to the file in the `<head>` tag of the document.

```html
<head>
  <script type="text/javascript" src="rune.js"></script>
</head>
```

Now create a new file called `sketch.js` and add a link to this file inside the `<body>` tag of the document.

```html
<body>
  <script type="text/javascript" src="sketch.js"></script>
</body>
```

Finally, put the following code in `sketch.js` to create a new Rune object.

```js
var r = new Rune({
  container: "body",
  width: 500,
  height: 400
});
```

If you open the HTML file in your browser, you will see a blank page, as we haven't called any drawing functions yet. Add the following code to `sketch.js` and refresh your browser.

```js
r.rect(0, 0, 200, 200).fill(0, 0, 255);
```

You should now see a blue rectangle in the top-left corner of the screen. If stuck, [download the example project](#).

### Basic shapes

`Rune.js` comes with a number of built-in functions to help you draw both simple and complex shapes.

```js
// some simple shapes

r.line(0, 0, 100, 100);

r.rect(0, 0, 100, 50);

r.ellipse(0, 0, 100, 50);

r.circle(0, 0, 100);

// more complex shapes

r.polygon(0, 0).lineTo(100, 0).lineTo(100, 100).lineTo(0, 100);

r.path(0, 0).lineTo(100, 0).curveTo(100, 100, 0, 100, 0, 0);
```

You can read about these functions in the [documentation](#), but the most important thing is that they all create a new shape object, add it to the stage, and return it. This means that you can save the object into a variable and chain functions after each other.

```js
var myRect = r.rect(0, 0, 100, 50)
  .move(...)
  .fill(...);
```

### Polygons

The polygon is a shape made up of a number of straight lines connected to each other. The following example draws a polygon triangle on the screen.

```js
r.polygon(0, 0)
  .lineTo(100, 100)
  .lineTo(-100, 100)
```

The `lineTo()` function draws a new line from the last location to the new location. Notice that the example above does not draw a line back to the beginning to complete the triangle. This will happen automatically, as polygons are always closed shapes.

Polygons come with a number of helper functions to make it easier to do [geometry calculations](#). As an example, here we're drawing a circle midway on the outline of the same triangle.

```js
var tri = r.polygon(0, 0)
  .lineTo(100, 100)
  .lineTo(-100, 100)

var midway = tri.vectorAt(0.5);

r.circle(midway.x, midway.y, 10);
```

### Paths

The path is the most complex shape, as it can consist of multiple subpaths made up of straight lines or bezier curves. Paths can also be open, and fill rules can be used to subtract one subpath from another. 

MORE

fillrule


### Moving shapes

All shapes come with a `move()` function that changes the current position of the shape. An optional boolean can be provided as a third parameter to move the shape relative to its current position.

```js
r.circle(0, 0, 100)    // x:0 y:0
  .move(100, 100);     // x:100 y:100
  .move(20, 20, true); // x:120 y:120
```

The `rotate()` function can be used to change the rotation of a shape. If you use it with only a degree, the shape will rotate around 0,0. So even though a rectangle has a position in the middle of the screen, it will rotate around the top-left corner.

```js
r.rect(100, 100, 100, 100)
  .rotate(45);
```

However, you can change the point of rotation. For example, here's that same rectangle rotating around its own center.

```js
r.rect(100, 100, 100, 100)
  .rotate(45, 150, 150);
```

If you pass a boolean as the last parameter of the function, the rotation will be relative to the current rotation.

```js
r.rect(100, 100, 100, 100)
  .rotate(45); // 45 degrees rotation
  .rotate(45, 0, 0, true); // 90 degrees rotation
```

The `Rune.degrees()` and `Rune.radians()` functions can be used to convert from and to radians. `Rune.js` has a lot of helper functions that you can read more about in the [documentation](#).

### Using colors

Drawing is not fun without color. All shapes have a default stroke and fill color that can be manipulated via the `stroke()` and `fill()` functions.

```js
r.rect(0, 0, 100, 50)
  .stroke(255, 0, 0) // red
  .fill(0, 255, 0) // green
```

The example above creates a rectangle with a red stroke and green fill, by using `RGB` values from 0 to 255. If you prefer to use `HSV`, this is easy too.

```js
r.rect(0, 0, 100, 50)
  .stroke('hsv', 0, 100, 100) // red
  .fill('hsv', 120, 100, 100) // green
```

On top of that, all of the following inputs can be used for strokes and fills.

```js
.fill("#FF000") // red
.fill("#FF000", 0.5) // red with opacity
.fill(255) // white
.fill(0) // black with opacity
.fill(255, 255, 255) // white RGB
.fill('hsv', 0, 100, 100) // red HSV
.fill('hsv', 0, 100, 100, 0.5) // red HSV with opacity
.fill(new Rune.Color(255, 0, 0)) // using color object
```

You can access the current color objects of any shape via `vars.fill` and `vars.stroke`. You can also create new color objects via `new Rune.Color()`. Color objects are chainable, and come with a bunch of functions for manipulating the color.

```js
new Rune.Color(255, 0, 0)
    .lighten(0.1)
    .desaturate(0.3)
    .rotate(120)
    // a lot more in the docs!
```

You can also disable colors by passing `false` to the functions.

```js
// you can't see me!
r.rect(0, 0, 100, 50)
  .stroke(false)
  .fill(false)
```

### The stage and groups

Groups and stuff
absolute position

### Shape variables

All shapes have a `vars` object that hold the current state of the shape. This is mostly done to separate functions and state, so you can use `.fill()` to set the fill color, and `vars.fill` to access the current color.

Unless you know what you're doing, **the vars object should only be used to to read values**. For example, here's how you get the current position of a shape within its parent.

```js
var x = myShape.vars.x;
var y = myShape.vars.y;
console.log("my shape is at", x, y);
```

### Draw loop

### Grid systems


## Documentation

All shapes share some common functions. Here's an overview.

#### `.function(x, y, relative)`

This is something to say about this code example. It might be a little crazy, but that's how it is baby.

<script type="text/javascript" src="js/app.js"></script>