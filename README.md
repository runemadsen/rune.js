# rune.js

There is a ton of great open source JavaScript drawing libraries on web, and favorites like [D3.js](http://d3js.org/), [p5.js](http://p5js.org/) and [Two.js](https://jonobr1.github.io/two.js/) is a great fit for many projects.

However, while teaching [my algorithmic graphic design course](http://printingcode.runemadsen.com), I have run into several issues with these frameworks. Either the syntax is too complex, the scene graph is too simple, the renderer supports canvas-only, or there's a general lack of the features that I care about (typography, color, computational geometry, etc). So I have decided to write something that fits my taste.

My main goal for the project is to make `rune.js` the best library for making 2D design systems in code. Here's a quick overview of what I'm working towards:

- **No DOM or CSS knowledge required**. Like Processing or P5, the library should remove DOM-specifics API calls.
- **Beautiful drawing API**. Make it pleasant to draw any type of shape via code.
- **Vector output**. Focus on SVG output, which is a great fit for both print and digital designers.
- **Scene graph**. Make a powerful scene graph that beginners can ignore, and advanced users will grow to love.
- **Chaining syntax**. Inspired by jQuery and D3, let people draw shapes by chaining their methods.
- **Virtual dom**. Update the SVG element via [virtual-dom](https://github.com/Matt-Esch/virtual-dom) to optimize for speed.
- **Geometry helpers**. Provide native functions to help with complicated geometry calculations like hit tests, polygon diffing, and point-on-curve.
- **Advanced color support**. Make something designers will want to use for generative color designs.
- **Typography**. Take advantage of the native browser webfont support, while supporting lower-level access to webfont vectors.
- **Grid System**. Create a powerful grid system on top of the scene graph.
- **Debug mode**. Turn on debug mode and get a visual representation of things like bezier curves and grid systems.
- **Plugins** Expand the code base via plugins. Keep the core library small. 
- **Beautiful output**. Generate readable SVG elements.

`rune.js` was inspired by the Two.js scene graph, Processing's drawing functions, and Geomerative's geometry and color classes. It uses [Color.js](https://github.com/harthur/color) for color support, [virtual-dom](https://github.com/Matt-Esch/virtual-dom) for DOM diffing, [Bezier.js](http://pomax.github.io/bezierjs/) for curbe math, and [underscore.js](http://underscorejs.org/) for enumerables.


## Why not ...?

Here's why I didn't just use the following libraries.

#### bonsai.js

- Complex API because of history as a Flash conversion tool.
- Requires knowledge about CSS colors

#### snap.svg

- Apache licensed and requires CLA for contributing.
- Requires knowledge about SVG structure
- Requires knowledge about CSS colors

#### two.js

- Utilizes CSS color strings
- Drawing API cannot mix curves and lines in same shape
- Hard to construct complex shapes from scratch
- No support for typography or images

#### paper.js

- Renders to canvas only with export option to SVG.
- Very explicit drawing API (`new Rectangle(new Point(0, 0), new Size(0,0))`)

#### p5.js

- Renders to canvas only.
- No scene graph
