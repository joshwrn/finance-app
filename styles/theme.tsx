export const themeColors = {
  eucalyptus: 'rgb(77, 236, 185)',
  coral: 'rgb(255, 59, 59)',
  'white-90': 'rgba(255, 255, 255, .90)',
  'white-75': 'rgba(255, 255, 255, .75)',
  'white-50': 'rgba(255, 255, 255, .50)',
  'white-05': 'rgba(255, 255, 255, 0.05)',
  'black-35': 'rgba(0, 0, 0, 0.35)',
  'black-100': 'rgba(0, 0, 0, 1)',
}

export const darkTheme = {
  type: 'dark',
  background: {
    primary: themeColors['black-100'],
    sidebar: themeColors['black-35'],
    item: themeColors['white-05'],
  },
  fontColor: {
    primary: themeColors['white-90'],
    secondary: themeColors['white-75'],
    tertiary: themeColors['white-50'],
    alternate: themeColors['black-100'],
  },
  button: {
    primary: themeColors['eucalyptus'],
  },
  badge: {
    primary: themeColors['coral'],
  },
}

export const lightTheme = {
  type: 'light',
}
