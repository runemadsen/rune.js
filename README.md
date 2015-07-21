# rune.js

### I'm actively working on the `0.0.1` release of this library.

There are a ton of great open source JavaScript drawing libraries on web, and favorites like [D3.js](http://d3js.org/), [p5.js](http://p5js.org/) and [Two.js](https://jonobr1.github.io/two.js/) are a great fit for many projects.

However, while teaching [my algorithmic graphic design course](http://printingcode.runemadsen.com), I have run into several issues with these frameworks. Either the syntax is too complex, the scene graph is too simple, the renderer supports canvas-only, or there's a general lack of the features I care about (typography, color, computational geometry, etc). So I have decided to write something that fits my taste.

My main goal for the project is to make `rune.js` the best library for making 2D design systems in code. Here's a quick overview of what I'm working towards:

- **Beautiful drawing API**. Make it pleasant to draw any type of shape via code. Do not require knowledge about SVG.
- **Vector output**. Focus on SVG output, which is a great fit for both print and digital designers.
- **Scene graph**. Make a powerful scene graph that beginners can easily ignore, and advanced users will grow to love.
- **Chaining syntax**. Inspired by jQuery and D3, let people chain away.
- **Virtual dom**. Update the SVG element via [virtual-dom](https://github.com/Matt-Esch/virtual-dom) to optimize for speed.
- **Polygon math**. Provide native functions to help with complicated geometry calculations like hit testing, polygon diffing, and point-on-curve.
- **Advanced color support**. Make something designers will want to use for generative color designs.
- **Typography**. Take advantage of the native browser webfont support, as well as supporting lower-level access to webfont vectors.
- **Plugins** Expand the code base via plugins that can be compiled into the build. Keep the core library small. 

`rune.js` is very much inspired by Two.js.


## Feature comparison

Here's why I didn't just use the following libraries.

#### bonsai.js

- Uses CSS string represenations for colors. I don't want to assume that my students know about CSS.
- Has a a complex API bound to its history as a Flash conversion tool.
- Runners and contexts are a bit hard to understand if you *just* want to code.

#### snap.svg

- Apache licensed and requires CLA for contributing.

#### two.js

- The drawing API is not super pleasant when creating shapes from scratch.
