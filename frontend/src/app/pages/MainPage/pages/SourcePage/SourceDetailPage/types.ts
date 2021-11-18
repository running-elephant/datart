import { Schema } from 'app/pages/MainPage/pages/ViewPage/slice/types';

export interface HttpSourceConfig {
  url: string;
  method: string;
  property: string;
  username: string;
  password: string;
  timeout: string;
  ResponseParser: string;
  headers: string;
  queryParam: string;
  body: string;
  contentType: string;
  tableName: string;
  columns: Schema[];
}
