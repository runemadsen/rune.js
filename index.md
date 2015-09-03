---
layout: default
title: "Rune.js Documentation"
---

# Rune.js

Rune.js is a JavaScript library for programming graphic design systems with SVG. It features a chainable drawing API, an unobtrusive scene graph, and a range of features aimed specifically at graphic designers: native support for color conversion, grid systems, typography, pixel iteration, as well as an expanding set of computational geometry helpers. Oh, and it uses [virtual-dom](https://github.com/Matt-Esch/virtual-dom) under the hood.


## Download

**[Current version: 0.1.0](https://github.com/runemadsen/rune.js/releases/tag/0.1.0)**

| Filename              | Size   | Description   |
| --------------------- | ------ | -------------|
| `rune.browser.js`     | 260kb  | All dependencies included. |
| `rune.browser.min.js` | 114kb  | All dependencies included (minified) |
| `rune.common.js`      | 84kb   | Only core with commonjs requires |
| `rune.common.min.js`  | 44kb   | Only core with commonjs requires (minified) |

New releases will be announced on my Twitter account. 

<a href="https://twitter.com/runemadsen" class="twitter-follow-button" data-show-count="false" data-size="large">Follow @runemadsen</a>


## Getting started

First download the latest release and move `rune.browser.js` next to your HTML document. Then, add a link to the file in the `<head>` tag of the document.

```html
<head>
  <script type="text/javascript" src="rune.browser.js"></script>
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

// put code here

r.draw();
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
  .lineTo(0, 0)
  .lineTo(100, 100)
  .lineTo(-100, 100)
```

The `lineTo()` function draws a new line from the last location to the new location. Notice that the example above does not draw a line back to the beginning to complete the triangle. This will happen automatically, as polygons are always closed shapes.

Polygons come with a number of helper functions to make it easier to do [geometry calculations](#). As an example, here we're drawing a circle midway on the outline of the same triangle.

```js
var tri = r.polygon(0, 0)
  .lineTo(0, 0)
  .lineTo(100, 100)
  .lineTo(-100, 100)

var midway = tri.vectorAt(0.5);

r.circle(midway.x, midway.y, 10);
```

Polygons are important because most shapes can be converted to polygons by using the `toPolygon()` function. As you will see in the following section, paths can hold multiple subpaths, and can be converted to an array of polygons by using the `toPolygons()` function.

### Paths

The path is the most complex shape, as it can consist of multiple subpaths made up of straight lines or bezier curves. Paths can also be open, and fill rules can be used to subtract one subpath from another.

Paths have four main methods: `moveTo` to start a new subpath, `lineTo` to create a line in the current subpath, `curveTo` to create a bezier curve in the current subpath, and `closePath` to make a straight line to the beginning of the current subpath.

To start, let's recreate the triangle from before as a path. Notice how paths unlike polygons do not close automatically, so we need to call `closePath()`.

```js
r.path(0, 0)
  .lineTo(100, 100)
  .lineTo(-100, 100)
  .closePath();
```

`curveTo()` can be used to draw both quadratic and cubic bezier curves. 

Passing 4 values to the function will draw a quadratic bezier curve through a single control point to a new location.

```js
// control point, new location
.curveTo(50, 300, 100, 0);
```

Passing 6 values to `curveTo()` will draw a cubic bezier curve with two control points to a new location.

```js
// control point 1, control point 2, new location
.curveTo(0, 300, 100, 300, 100, 0);
```

You can draw multiple subpaths inside a single path by using `moveTo()` with the optional `closePath()`. Here's two triangles in the same path.

```js
r.path(0, 0)
  .lineTo(100, 100)
  .lineTo(-100, 100)
  .closePath()
  .moveTo(200, 200)
  .lineTo(300, 300)
  .lineTo(100, 300)
  .closePath();
```

You can use the `fillRule()` function to change whether subpaths add or subtract from each other. `fillRule("nonzero")` is the default setting. `fillRule("evenodd")` is the default setting. [Read more about SVG fillrules here](http://www.sitepoint.com/understanding-svg-fill-rule-property/).

If you have debug mode enabled, the path outline and bezier control points will be drawn on the screen for reference.


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

If you're coming from Processing, the concept of a stage graph might be a bit unfamiliar. However, the basics are actually pretty simple to understand. In Processing, the `rect()` function will just draw a rectangle on the screen. You have no way to later access the x, y, width or height of that rectangle.

In `Rune.js`, that same function will actually create a `Rune.Rectangle` object, and add it to the stage. Every time the `draw()` method is called, `Rune.js` will look through the stage objects and draw all of them on the screen in order. The benefit is that shape objects will always hold the current state of the shape. See *Shape variables* for more.

You can use groups to group many shapes together. A group can be created by using the `group()` function.

```js
var myGroup = r.group(100, 100);
```

This group has position of x:100,y:100 and any shapes added to the group will be positioned relative to the group position. The following example will draw a rectangle at x:150,y:150.

```js
var myGroup = r.group(100, 100);
r.rect(50, 50, 500, 500, myGroup);
```

You have probably noticed that I'm passing the group as the last parameter in the `rect()` drawing function. **All drawing functions accept a custom group as the last parameter**, and doing this will add the new shape to the group instead of the default stage. The `group` function also does this, so you can nest groups to construct some very complex scenarios.

```js
// create group on stage
var parent = r.group(100, 100);

// create group inside parent
var child = r.group(100, 100, parent);

// create rectangle inside child
r.rect(100, 100, 500, 500, child);
```

The stage itself is a group object, and can be accessed via `r.stage`. If you wish to create a new shape without adding it to the stage or a group, you can pass `false` as the last parameter in any drawing function.

```js
r.rect(100, 100, 500, 500, false);
```

You can also use the shape objects directly, which will bypass the stage logic.

```js
var myRect = new Rune.Rectangle(100, 100, 500, 500);
```

Groups have `move` and `rotate` functions like shapes. See the [documentation](documentation.html) for more info.

### Shape variables

All shapes have a `vars` object that hold the current state of the shape. This is mostly done to separate functions and state, so you can use `.fill()` to set the fill color, and `vars.fill` to access the current color.

You can use this `vars` object to get information about the shape. For example, here's how you get the current position of a shape.

```js
var x = myShape.vars.x;
var y = myShape.vars.y;
console.log("my shape is at", x, y);
```

Unless you know what you're doing, **the vars object should only be used to read values**. For example, here's how you get the current position of a shape within its parent.

### Draw loop

`Rune.js` has a built-in draw event that by default is fired 60 times a second. So moving a rectangle across the screen 1px at the time is as simple as this.

```js
var rectangle = r.rect(0, 0, 100, 50);

r.on('draw', function() {
  rectangle.move(1, 0, true);
});
```

It's very important to understand the difference between the code above that moves a single rectangle object, and the code below which adds a new rectangle to the stage on every frame.

```js
var x = 0;

r.on('draw', function() {
  r.rectangle(x, 0, 100, 50);
  x++;
});
```

You can change the framerate by passing in the `frameRate` parameter when creating your `Rune.js` instance:

```js
var r = new Rune({ frameRate: 10 })
```

### Grid systems

Designers often use different types of grid systems to lay out shapes on a page. `Rune.js` comes with a built-in grid object that can be used to create most types of grid, and because grids are a part of the stage graph, shapes can be added to the grid columns and rows.

Grids are very flexible, and can be created using a combination of parameters. Here's a simple grid created based on the full width of the grid.

```js
var grid = r.grid({
  x: 10,
  y: 10,
  width: 500,
  height: 500,
  gutter: 10,
  columns: 10,
  rows: 2
});
```

You can also create a grid by specifying the module height and width instead. The code below will create the exact same grid as the code above.

```js
var grid = r.grid({
  x: 10,
  y: 10,
  moduleWidth: 50,
  moduleHeight: 500,
  gutter: 10,
  columns: 3,
  rows: 2
});
```

You can also replace `gutter` with `gutterWidth` and `gutterHeight` if you need specific control over the module spacing.

A grid object is just a collection of groups with their locations based on the specified grid measurements. You can add shapes to the module groups with the `add()` function.

```js
var rect = r.rect(100, 100, 500, 500, false);

// add rectangle to first column, second row
grid.add(rect, 1, 2);
```

Grids have `.move` and `.rotate` functions to move all shapes in the grid.

If you have debug mode enabled, the grid modules will be drawn on the screen for reference.

### Debug mode

You can enable debug mode when creating a `Rune.js` instance.

```js
var r = new Rune({ debug: true });
```