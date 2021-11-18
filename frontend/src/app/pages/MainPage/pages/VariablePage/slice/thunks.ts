import { createAsyncThunk } from '@reduxjs/toolkit';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import {
  AddVariableParams,
  DeleteVariableParams,
  EditVariableParams,
  Variable,
} from './types';

export const getVariables = createAsyncThunk<Variable[], string>(
  'variable/getVariables',
  async orgId => {
    try {
      const { data } = await request<Variable[]>({
        url: '/variables/org',
        method: 'GET',
        params: { orgId },
      });
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const addVariable = createAsyncThunk<Variable, AddVariableParams>(
  'variable/addVariable',
  async ({ variable, resolve }) => {
    try {
      const { data } = await request<Variable>({
        url: '/variables',
        method: 'POST',
        data: variable,
      });
      resolve();
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const editVariable = createAsyncThunk<Variable, EditVariableParams>(
  'variable/editVariable',
  async ({ variable, resolve }) => {
    try {
      await request<boolean>({
        url: '/variables',
        method: 'PUT',
        data: [variable],
      });
      resolve();
      return variable;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const deleteVariable = createAsyncThunk<null, DeleteVariableParams>(
  'variable/deleteVariable',
  async ({ ids, resolve }) => {
    try {
      await request<Variable>({
        url: '/variables',
        method: 'DELETE',
        params: { variables: ids.join(',') },
      });
      resolve();
      return null;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);
