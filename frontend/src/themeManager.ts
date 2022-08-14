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

export function registerEChartThemes() {
  registerTheme('default', defaultTheme);
  registerTheme('purple-passion', purplePassionTheme);
  registerTheme('macarons', macaronsTheme);
  registerTheme('chalk', chalkTheme);
  registerTheme('dark', darkTheme);
  registerTheme('essos', essosTheme);
  registerTheme('infographic', infographicTheme);
  registerTheme('roma', romaTheme);
  registerTheme('shine', shineTheme);
  registerTheme('vintage', vintageTheme);
  registerTheme('walden', waldenTheme);
  registerTheme('westeros', westerosTheme);
  registerTheme('wonderland', wonderlandTheme);
}
