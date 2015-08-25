---
layout: default
title: "Rune.js Documentation"
---

# Rune.js

Rune.js is a JavaScript library for programming graphic design systems with SVG. It features a beautiful drawing API, an unobtrusive scene graph, and a range of other features developed to make it pleasant to create algorithmic designs for both print and web.

Features include:

- Beautiful, chainable drawing API.
- A scene graph that beginners can ignore, and experienced users will love.
- Built-in color manipulation
- Shapes with helpers for computational geometry.
- SVG rendering via [virtual-dom](https://github.com/Matt-Esch/virtual-dom)
- Typography support
- Built-in grid system to help with alignment and positioning.
- Debug mode to visualize polygon vectors and grids.

Follow [@runemadsen](https://www.twitter.com/runemadsen) for updates on new features.

## Getting started

First download the `rune.js` file and place it next to your HTML document. Then, add a link to the file in the `<head>` tag of the document.

```html
<head>
  <script type="text/javascript" src="rune.js"></script>
</head>
```

To start using the library, create a new file called `sketch.js` and add a link to this file inside the `<body>` tag of the document.

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

If you open the HTML file in your browser, you will see a blank page, as we've only created a blank canvas. To make sure that your code is working, add the following code to your `sketch.js` file and refresh your browser.

```js
r.rect(0, 0, 200, 200).fill(0, 0, 255);
```

You should now see a blue rectangle in the top-left corner of the screen.

## Drawing shapes

### Basics

All shapes share some common functions. Here's an overview.

#### `.move(x, y, relative)`

This is something to say about this code example. It might be a little crazy, but that's how it is baby.

#### `.rotate(degrees, x, y)`

This is something to say about this code example. It might be a little crazy, but that's how it is baby.

### Rune.Polygon

A polygon is something that you use to do bla bla bla. It can rotate, bla bla bla. Initialize a new polygon without adding to the stage.  It might be a little crazy.

#### `new Rune.Polygon(x, y)`

Initialize a new polygon without adding to the stage.  It might be a little crazy, but that's how it is baby. This is something to say about this code example. It might be a little crazy, but that's how it is baby. This is something to say about this code example. It might be a little crazy, but that's how it is baby.

#### `.lineTo(x, y)`

This is something to say about this code example. It might be a little crazy, but that's how it is baby. This is something to say about this code example. It might be a little crazy, but that's how it is baby. This is something to say about this code example. It might be a little crazy, but that's how it is baby.

This method can be chained.

```
polygon
  .lineTo(10, 15)
  .lineTo(300, 305);
```