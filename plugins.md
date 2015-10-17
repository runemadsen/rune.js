---
layout: default
title: "Plugins - Rune.js"
---

# Plugins

Rune.js extend the core codebase via optional plugins to prevent bloating the core, and to encourage an ecosystem around the basic Rune.js shape objects and their functionality.

## Rune.Font

A plugin that loads font files and converts them to `Rune.Path` objects. You can see how to use `Rune.Font` under the [Typography section](http://printingcode.runemadsen.com/examples/#typography) in the Rune.js examples.

#### Using in the browser

Simply include the `font.browser.js` file after your `rune.browser.js` file in your HTML file. You can download the latest release on [Github](#).

```html
<head>
  <script src="rune.browser.js"></script>
  <script src="font.browser.js"></script>
</head>
```

#### Using in node

Simply include the `rune.font.js` module in your code, along with your `rune.js` module.

```js
var Rune = require('rune.js');
var Font = require('rune.font.js');
```

