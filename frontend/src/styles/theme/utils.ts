import { ThemeKeyType } from './slice/types';

/* istanbul ignore next line */
export const isSystemDark = window?.matchMedia
  ? window.matchMedia('(prefers-color-scheme: dark)')?.matches
  : undefined;

export function saveTheme(theme: ThemeKeyType) {
  window.localStorage && localStorage.setItem('selectedTheme', theme);
}

/* istanbul ignore next line */
export function getThemeFromStorage(): ThemeKeyType {
  const theme = window.localStorage
    ? (localStorage.getItem('selectedTheme') as ThemeKeyType)
    : '';

  if (!theme) {
    saveTheme('light');
    return 'light';
  } else {
    return theme;
  }
}
