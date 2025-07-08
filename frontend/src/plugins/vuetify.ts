import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { type ThemeDefinition } from 'vuetify'

const customLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#005CFF',
    secondary: '#003051',
    background: '#FCFCFC',
    surface: '#FFFFFF',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-background': '#212121',
    'on-surface': '#212121',
  },
}

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'customLightTheme',
    themes: {
      customLightTheme,
    },
  },
  defaults: {
    global: {
      style: {
        fontFamily: 'Space Grotesk, sans-serif',
      },
    },
  },
})
