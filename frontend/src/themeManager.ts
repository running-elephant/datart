/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import chalkTheme from 'app/assets/theme/chalk.theme.json';
import darkTheme from 'app/assets/theme/dark.theme.json';
import defaultTheme from 'app/assets/theme/default.theme.json';
import essosTheme from 'app/assets/theme/essos.theme.json';
import infographicTheme from 'app/assets/theme/infographic.theme.json';
import macaronsTheme from 'app/assets/theme/macarons.theme.json';
import purplePassionTheme from 'app/assets/theme/purple-passion.theme.json';
import romaTheme from 'app/assets/theme/roma.theme.json';
import shineTheme from 'app/assets/theme/shine.theme.json';
import vintageTheme from 'app/assets/theme/vintage.theme.json';
import waldenTheme from 'app/assets/theme/walden.theme.json';
import westerosTheme from 'app/assets/theme/westeros.theme.json';
import wonderlandTheme from 'app/assets/theme/wonderland.theme.json';
import { registerTheme } from 'echarts';

const themes = [
  {
    key: 'default',
    i18n: {
      zh: '默认',
      en: 'default',
    },
    theme: defaultTheme,
  },
  {
    key: 'dark',
    i18n: {
      zh: '暗黑色系',
      en: 'dark',
    },
    theme: darkTheme,
  },
  {
    key: 'purple-passion',
    i18n: {
      zh: '紫色激情色系',
      en: 'purple-passion',
    },
    theme: purplePassionTheme,
  },
  {
    key: 'macarons',
    i18n: {
      zh: 'macarons色系',
      en: 'macarons',
    },
    theme: macaronsTheme,
  },
  {
    key: 'chalk',
    i18n: {
      zh: 'chalk色系',
      en: 'chalk',
    },
    theme: chalkTheme,
  },
  {
    key: 'essos',
    i18n: {
      zh: 'essos色系',
      en: 'essos',
    },
    theme: essosTheme,
  },
  {
    key: 'infographic',
    i18n: {
      zh: 'infographic色系',
      en: 'infographic',
    },
    theme: infographicTheme,
  },
  {
    key: 'roma',
    i18n: {
      zh: 'roma色系',
      en: 'roma',
    },
    theme: romaTheme,
  },
  {
    key: 'shine',
    i18n: {
      zh: 'shine色系',
      en: 'shine',
    },
    theme: shineTheme,
  },
  {
    key: 'vintage',
    i18n: {
      zh: 'vintage色系',
      en: 'vintage',
    },
    theme: vintageTheme,
  },
  {
    key: 'walden',
    i18n: {
      zh: 'walden色系',
      en: 'walden',
    },
    theme: waldenTheme,
  },
  {
    key: 'westeros',
    i18n: {
      zh: 'westeros色系',
      en: 'walden',
    },
    theme: westerosTheme,
  },
  {
    key: 'wonderland',
    i18n: {
      zh: 'wonderland色系',
      en: 'wonderland',
    },
    theme: wonderlandTheme,
  },
];

export function getThemes() {
  return themes;
}

export function getThemeByKey(key: string) {
  return themes?.find(t => t.key === key)?.theme;
}

export function registerEChartThemes() {
  themes.forEach(t => {
    registerTheme(t.key, t.theme);
  });
}
