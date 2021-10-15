import { Schema } from 'app/pages/MainPage/pages/ViewPage/slice/types';

export interface FileSourceConfig {
  tableName: string;
  format: string;
  path: string;
  columns: Schema[];
}
