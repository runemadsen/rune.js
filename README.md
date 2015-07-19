# rune.js

There are a ton of great open source JavaScript drawing libraries on web, and favorites like [D3.js](http://d3js.org/), [p5.js](http://p5js.org/) and [Two.js](https://jonobr1.github.io/two.js/) is a great fit for many projects.

However, while teaching [my algorithmic graphic design course](printingcode.runemadsen.com) I have run into issues where the syntax is either too difficult for my students, the renderer supports canvas only, or there is a lack of support for the features I care about (typography, computational geometry, etc). That's why I decided to write `rune.js`.

My main goal for the project is to make `rune.js` the best library making visual design systems in 2D. Here's a quick overview of what I'm working towards:

- **SVG only**. Simplify rendering by only focusing on SVG output. SVG is great for both generative design projects that end up as printed products, and web-native projects.
- **Scene Graph**. Make simple syntax without the need for beginners to use things like `addChild` and layering, yet provide a powerful scene graph for advanced use.
- **Virtual dom**. In order to optimize for speed, update the SVG element via a virtual DOM like React.
- **Color modes**. Support both RGB and HSB, and make color generation and conversion dead simple.
- **Computational Geometry**. Provide a full-featured set of functions for things like hit-testing and polygon subtraction, without the need for students to code these functions themselves. 
- **Typography**. Provide lower-level access to webfont vectors.
