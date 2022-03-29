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

import { useContext } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { BoardActionContext } from '../components/BoardProvider/BoardActionProvider';
export default function useBoardEditorHotkeys() {
  const {
    undo,
    redo,
    deleteActiveWidgets,
    layerToTop,
    layerToBottom,
    copyWidgets,
    pasteWidgets,
  } = useContext(BoardActionContext);

  useHotkeys('delete,backspace', () => deleteActiveWidgets(), []);

  useHotkeys('ctrl+z,command+z', () => undo());
  useHotkeys('ctrl+shift+z,command+shift+z', () => redo());

  useHotkeys('ctrl+shift+up,command+shift+up', () => layerToTop());
  useHotkeys('ctrl+shift+down,command+shift+down', () => layerToBottom());

  useHotkeys('ctrl+c,command+c', () => copyWidgets());
  useHotkeys('ctrl+v,command+v', () => pasteWidgets());

  //
  useHotkeys('up', () => {
    console.log('__ widgets up1');
  });
  useHotkeys('shift+up', () => {
    console.log('__ widgets up10');
  });
  //
  useHotkeys('down', () => {
    console.log('__ widgets down1');
  });
  useHotkeys('shift+down', () => {
    console.log('__ widgets down10');
  });
  //
  useHotkeys('left', () => {
    console.log('__ widgets left1');
  });
  useHotkeys('shift+left', () => {
    console.log('__ widgets left10');
  });
  //
  useHotkeys('right', () => {
    console.log('__ widgets right1');
  });
  useHotkeys('shift+right', () => {
    console.log('__ widgets right10');
  });
}
