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
import { strEnumType } from 'app/pages/DashBoardPage/slice/types';
import { VizType } from './../../MainPage/pages/VizPage/slice/types';
export interface StoryBoardState {
  storyMap: Record<string, StoryBoard>;
  storyPageMap: Record<string, Record<string, StoryPage>>;
  storyPageInfoMap: Record<string, Record<string, StoryPageInfo>>;
}

export interface StoryBoard {
  id: string;
  name: string;
  thumbnail: string; //缩略图
  permission: any;
  status: number;
  config: StoryConfig;
}
export interface ServerStoryBoard extends Omit<StoryBoard, 'config'> {
  config: string;
  storypages?: StoryPageOfServer[];
}
export interface StoryConfig {
  autoPlay: {
    auto: boolean;
    delay: number;
  };
}
export interface StoryPage {
  id: string;
  relId: string;
  storyboardId: string;
  relType: StoryPageRelType;
  config: StoryPageConfig;
}
export interface StoryPageOfServer extends Omit<StoryPage, 'config'> {
  config: string;
}
export type StoryPageRelType = Extract<'DASHBOARD' | 'DATACHART', VizType>;
export interface StoryPageConfig {
  name?: string;
  thumbnail?: string;
  index: number;
  transitionEffect: TransitionEffect;
}
export interface StoryPageInfo {
  id: string;
  selected: boolean;
}
export interface TransitionEffect {
  in: EffectInType;
  out: EffectOutType;
  speed: EffectSpeedType;
}
// "none" | "fade" | "slide" | "convex" | "concave" | "zoom"
export const EffectInMap = strEnumType([
  'none',
  'fade-in',
  'slide-in',
  'convex-in',
  'concave-in',
  'zoom-in',
]);
export type EffectInType = keyof typeof EffectInMap;

export const EffectOutMap = strEnumType([
  'none',
  'fade-out',
  'slide-out',
  'convex-out',
  'concave-out',
  'zoom-out',
]);
export type EffectOutType = keyof typeof EffectOutMap;

export const EffectSpeedMap = strEnumType(['default', 'slow', 'fast']);
export type EffectSpeedType = keyof typeof EffectSpeedMap;
