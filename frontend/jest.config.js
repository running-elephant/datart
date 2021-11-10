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

const { createJestConfig } = require('@craco/craco');

const cracoConfig = require('./craco.config.js');
const jestConfig = createJestConfig(cracoConfig, {}, { displayName: 'Datart' });

module.exports = jestConfig;

// TODO(Stephen): to be merged into craco config
// const config = {
//   verbose: true,
//   coverageReporters: ['html', 'lcov', 'text-summary'],
//   collectCoverageFrom: [
//     'src/**/*.{js,jsx,ts,tsx}',
//     '!src/**/*/*.d.ts',
//     '!src/**/*/Loadable.{js,jsx,ts,tsx}',
//     '!src/**/*/messages.ts',
//     '!src/**/*/types.ts',
//     '!src/index.tsx',
//   ],
//   coverageThreshold: {
//     global: {
//       branches: 90,
//       functions: 90,
//       lines: 90,
//       statements: 90,
//     },
//   },
// };
// module.exports = config;
