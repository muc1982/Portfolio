export const APP_CONSTANTS = {
  ANIMATION_DURATION: {
    FAST: 200,
    MEDIUM: 300,
    SLOW: 500
  },
  BREAKPOINTS: {
    MOBILE: 899,
    TABLET: 1200,
    DESKTOP: 1440
  },
  STORAGE_KEYS: {
    LANGUAGE: 'currentLang',
    THEME: 'theme'
  },
  API_ENDPOINTS: {
    CONTACT_FORM: 'https://portfolio.yasinsun.de/sendMail.php'
  },
  OFFSET_VALUES: {
    NAVIGATION: 104,
    MOBILE_NAVIGATION: 72
  }
} as const;

export type AppConstants = typeof APP_CONSTANTS;