---
layout: default
title: "Rune.js Documentation"
---

<div id="logo"></div>

# Rune.js

Rune.js is a JavaScript library for programming graphic design systems with SVG. It features a chainable drawing API, an unobtrusive scene graph, and a range of features aimed specifically at graphic designers: native support for color conversion, grid systems, typography, pixel iteration, as well as an expanding set of computational geometry helpers. Oh, and it uses [virtual-dom](https://github.com/Matt-Esch/virtual-dom) under the hood.

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

### Drawing shapes

Let's draw some things on the screen. `Rune.js` comes with a number of built-in functions to help you draw simple and complex shapes.

```js
// some simple shapes

r.line(0, 0, 100, 100);

r.rect(0, 0, 100, 50);

r.ellipse(0, 0, 100, 50);

r.circle(0, 0, 100);

// more advanced shapes

r.polygon(0, 0).lineTo(100, 0).lineTo(100, 100).lineTo(0, 100);

r.path(0, 0).lineTo(100, 0).curveTo(100, 100, 0, 100, 0, 0);
```

You can read about these functions in the [documentation](#), but the most important thing is that they all create a new shape object, add it to the stage, and return it. This means that you can save the object into a variable or chain functions after each other.

```js
var myRect = r.rect(0, 0, 100, 50)
  .move(...)
  .fill(...);
```

### Using colors


### Understanding the stage graph

Groups and stuff


## Documentation

All shapes share some common functions. Here's an overview.

#### `.function(x, y, relative)`

This is something to say about this code example. It might be a little crazy, but that's how it is baby.

<script type="text/javascript" src="js/app.js"></script>