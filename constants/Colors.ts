


const moreColors = {
  primary: '#3F2CA0',
  successContrast: '#1E97320F',
  primaryContrast: '#261D52FF', 
  primaryOpacity: '#3F2CA0DA', 
  orange : '#FFAE00FF',
  danger: '#B02020FF',
  warning: '#FFD700',
  default: '#ECEDEE',
  success: '#1E9732FF',
  info: '#003984FF',
  white: '#ffffff',
  black: '#000000',
  grey: '#efefef'
}

export const Colors = {
  light: {
    text: '#101010',
    textSecondary: '#333333',
    background: '#ffffff',
    backgroundSecondary: '#F5FFECFF',
    tint: '#3F2CA0',
    secondary: '#fafafa',
    border: '#e0e0e0',
    themeGrey: '#aaaaaa',
    ...moreColors
  },
  dark: {
    text: '#e8e8e8',
    textSecondary: '#b0b0b0',
    background: '#121212',
    backgroundSecondary: '#1e1e1e',
    tint: '#7c6ec9',
    secondary: '#1e1e1e',
    border: '#404040',
    themeGrey: '#888888',
    ...moreColors
  }
};
