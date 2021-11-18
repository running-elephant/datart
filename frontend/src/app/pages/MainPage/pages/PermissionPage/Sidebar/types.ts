import { ResourceTypes, SubjectTypes } from '../constants';

export interface PanelsProps {
  viewpointId: string | undefined;
  viewpointType: SubjectTypes | ResourceTypes | undefined;
  onToggle: (active: boolean, key: string) => void;
  onToDetail: (id: string, type: SubjectTypes | ResourceTypes) => () => void;
}
