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

export const APP_VERSION_INIT = '0.0.0';
export const APP_VERSION_BETA_0 = '1.0.0-beta.0';
export const APP_VERSION_BETA_1 = '1.0.0-beta.1';
export const APP_VERSION_BETA_2 = '1.0.0-beta.2';
export const APP_SEMANTIC_VERSIONS = [
  APP_VERSION_INIT,
  APP_VERSION_BETA_0,
  APP_VERSION_BETA_1,
  APP_VERSION_BETA_2,
];
export const APP_CURRENT_VERSION =
  APP_SEMANTIC_VERSIONS[APP_SEMANTIC_VERSIONS.length - 1];
