const Colors = {
  black: "#17111a",
  darkRed1: "#372538",
  darkRed2: "#7a213a",
  red: "#e14141",
  lightRed: "#ffa070",
  brownish: "#c44d29",
  orange: "#ffbf36",
  yellow: "#fff275",
  darkBrown: "#753939",
  brown: "#cf7957",
  lightBrown: "#ffd1ab",
  darkGreen: "#39855a",
  green: "#83e04c",
  lightGreen: "#dcff70",
  darkBlue: "#243b61",
  blue: "#3898ff",
  lightBlue: "#6eeeff",
  violet: "#682b82",
  magenta: "#bf3fb3",
  pink: "#ff80aa",
  darkGrey1: "#3e375c",
  darkGrey2: "#7884ab",
  grey: "#b2bcc2",
  white: "#ffffff"
}

const ColorKeys = Object.keys(Colors)

export function randomColor() {
  const ran = Math.round(Math.random() * 24 + 1)
  return Colors[ColorKeys[ran]]
}