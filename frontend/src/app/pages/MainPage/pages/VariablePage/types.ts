import { Variable } from './slice/types';

export interface VariableFormModel
  extends Omit<Variable, 'id' | 'defaultValue'> {
  defaultValue: any[];
}
