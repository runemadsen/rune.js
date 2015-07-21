# rune.js

### I'm actively working on the `0.0.1` release of this library.

There are a ton of great open source JavaScript drawing libraries on web, and favorites like [D3.js](http://d3js.org/), [p5.js](http://p5js.org/) and [Two.js](https://jonobr1.github.io/two.js/) is a great fit for many projects.

However, while teaching [my algorithmic graphic design course](http://printingcode.runemadsen.com) I have run into issues where the syntax is either too difficult for my students, the renderer supports canvas only, or there is a lack of support for the features I care about (typography, computational geometry, etc). That's why I decided to write `rune.js`.

My main goal for the project is to make `rune.js` the best library for making visual design systems in 2D. Here's a quick overview of what I'm working towards:

- **No knowledge about SVG required**. One should not need to know about SVG paths to use the library.
- **SVG only**. Simplify rendering by only focusing on SVG output. SVG is great for both generative design projects that end up as printed products, and web-native projects.
- **Scene graph**. Make a powerful scene graph with a simple API that gets out of the way for beginners. Functions like `addXXXX` will automatically add new objects to the scene graph.
- **Chaining syntax**. Inspired by jQuery and D3.
- **Virtual dom**. In order to optimize for speed, update the SVG element via a virtual DOM like React.
- **Color modes**. Support both RGB and HSB, and make color generation and conversion dead simple.
- **Computational geometry**. Provide native functions to help with complicated geometry calculations, like hit tests and polygon diffing.
- **Typography**. Provide lower-level access to webfont vectors.
- **Plugins** infrastructure. Things like SVG parsers and other extra functionality lies in separate plugins that can be compiled into the build. 

`rune.js` is very much inspired by Bonsai.js and Two.js.

## Random ideas

- Ability to toggle `debug` mode to see the bezier handles?
- Only draw things on screen if they are in the viewport?
- Setters should flag that the object changed, and update should only recompile if flag is set (or object is in changed array?)
- Ability to render to string

## Feature comparison

Here's a small list of things that made me think about creating a new library.

#### bonsai.js

- Uses CSS string represenations for colors. I don't want to assume that my students know about CSS.
- Has a bit of a complex API because of it's history of being tied to SWF conversion.
- Runners and contexts are a bit hard to understand if you *just* want to code.

#### snap.svg

- Apache licensed and requires CLA for contributing.

#### two.js

- Constructing polygons from scratch is pretty hard.
