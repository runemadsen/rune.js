import _ from "underscore"
import color from "./file2"

const Rune = {};

// export imports to global rune object
Rune.Color = color;

// export rune to the window
global.Rune = Rune;

export default Rune;