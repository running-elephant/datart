import antd_en_US from 'antd/lib/locale/en_US';
import antd_zh_CN from 'antd/lib/locale/zh_CN';
import { StorageKeys } from 'globalConstants';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { initReactI18next } from 'react-i18next';
import { instance as requestInstance } from 'utils/request';
import en from './en/translation.json';
import { convertLanguageJsonToObject } from './translations';
import zh from './zh/translation.json';

export const translationsJson = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

// Create the 'translations' object to provide full intellisense support for the static json files.
convertLanguageJsonToObject(en);

export const changeLang = lang => {
  i18next.changeLanguage(lang);
  requestInstance.defaults.headers['Accept-Language'] =
    lang === 'zh' ? 'zh-CN' : 'en-US'; // FIXME locale
  localStorage.setItem(StorageKeys.Locale, lang);
  moment.locale(lang === 'zh' ? 'zh-cn' : 'en-us'); // FIXME locale
  window.location.reload();
};

const initialLocale = getInitialLocale();
moment.locale(initialLocale);

export const i18n = i18next
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: initialLocale,
    resources: translationsJson,
    fallbackLng: 'en',
    debug:
      process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export const antdLocales = {
  en: antd_en_US,
  zh: antd_zh_CN,
};

function getInitialLocale() {
  const storedLocale = localStorage.getItem(StorageKeys.Locale);
  if (!storedLocale) {
    const browserLocale = ['zh', 'zh-CN'].includes(navigator.language) // FIXME locale
      ? 'zh'
      : 'en';
    localStorage.setItem(StorageKeys.Locale, browserLocale);
    return browserLocale;
  } else {
    return storedLocale;
  }
}
