export const themeColors = {
  'eucalyptus': `rgb(77, 236, 185)`,
  'coral': `rgb(255, 59, 59)`,
  'white-100': `rgba(255, 255, 255, 1)`,
  'white-90': `rgba(255, 255, 255, .90)`,
  'white-75': `rgba(255, 255, 255, .75)`,
  'white-50': `rgba(255, 255, 255, .50)`,
  'white-05': `rgba(255, 255, 255, 0.05)`,
  'black-05': `rgba(0, 0, 0, 0.05)`,
  'black-35': `rgba(0, 0, 0, 0.35)`,
  'black-50': `rgba(0, 0, 0, 0.50)`,
  'black-75': `rgba(0, 0, 0, 0.75)`,
  'black-90': `rgba(0, 0, 0, .9)`,
  'black-100': `rgba(0, 0, 0, 1)`,
}

export const darkTheme = {
  attributes: {
    type: `dark`,
  },
  bg: {
    primary: themeColors[`black-75`],
    sidebar: themeColors[`black-35`],
    item: themeColors[`white-05`],
  },
  fc: {
    primary: themeColors[`white-90`],
    secondary: themeColors[`white-75`],
    tertiary: themeColors[`white-50`],
    alternate: themeColors[`black-100`],
    error: themeColors[`coral`],
  },
  btn: {
    primary: themeColors[`eucalyptus`],
  },
  badge: {
    primary: themeColors[`coral`],
  },
  color: {
    ...themeColors,
  },
}

export const lightTheme = {
  type: `light`,
  bg: {
    primary: themeColors[`white-100`],
    sidebar: themeColors[`white-100`],
    item: themeColors[`black-05`],
  },
  fc: {
    primary: themeColors[`black-90`],
    secondary: themeColors[`black-75`],
    tertiary: themeColors[`black-50`],
    alternate: themeColors[`white-100`],
    error: themeColors[`coral`],
  },
  btn: {
    primary: themeColors[`eucalyptus`],
  },
  badge: {
    primary: themeColors[`coral`],
  },
  color: {
    ...themeColors,
  },
}
