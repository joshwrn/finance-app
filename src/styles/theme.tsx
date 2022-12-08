export const themeColors = {
  'eucalyptus': `rgb(77, 236, 185)`,
  'eucalyptus-10': `rgba(77, 236, 185, 0.1)`,
  'coral': `rgb(255, 74, 74)`,
  'white-100': `rgba(255, 255, 255, 1)`,
  'white-90': `rgba(255, 255, 255, .90)`,
  'white-75': `rgba(255, 255, 255, .75)`,
  'white-50': `rgba(255, 255, 255, .50)`,
  'white-30': `rgba(255, 255, 255, .30)`,
  'white-20': `rgba(255, 255, 255, .20)`,
  'white-10': `rgba(255, 255, 255, .10)`,
  'white-05': `rgba(255, 255, 255, 0.05)`,
  'black-05': `rgba(0, 0, 0, 0.05)`,
  'black-35': `rgba(0, 0, 0, 0.35)`,
  'black-50': `rgba(0, 0, 0, 0.50)`,
  'black-75': `rgba(0, 0, 0, 0.75)`,
  'black-80': `rgba(0, 0, 0, 0.80)`,
  'black-90': `rgba(0, 0, 0, .9)`,
  'black-100': `rgba(0, 0, 0, 1)`,
}

export const darkTheme = {
  attributes: {
    type: `dark`,
  },
  bg: {
    primary: themeColors[`black-80`],
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
    sidebar: themeColors[`black-05`],
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
    primary: `rgb(35, 169, 127)`,
  },
  badge: {
    primary: themeColors[`coral`],
  },
  color: {
    ...themeColors,
  },
}
