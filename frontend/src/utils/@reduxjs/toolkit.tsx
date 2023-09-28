import {
  createSlice as createSliceOriginal,
  CreateSliceOptions,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import { RootStateKeyType } from '../types/injector-typings';

/* Wrap createSlice with stricter Name options */

/* istanbul ignore next */
// TODO: Check if this is still needed
export const createSlice = <
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends RootStateKeyType,
>(
  options: CreateSliceOptions<State, CaseReducers, Name>,
) => createSliceOriginal(options);
