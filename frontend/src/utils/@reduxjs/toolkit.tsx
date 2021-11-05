import {
  createSlice as createSliceOriginal,
  CreateSliceOptions,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import { RootStateKeyType } from '../types/injector-typings';

/* Wrap createSlice with stricter Name options */

/* istanbul ignore next */
export const createSlice = <
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends RootStateKeyType,
>(
  options: CreateSliceOptions<State, CaseReducers, Name>,
) => createSliceOriginal(options);

export function isMySliceAction(action, targetSliceName) {
  return action?.type?.startsWith(targetSliceName);
}
