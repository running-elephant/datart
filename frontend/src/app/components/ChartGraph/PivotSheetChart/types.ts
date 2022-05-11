import { Node, Palette, S2DataConfig, S2Options, S2Theme } from '@antv/s2';
export interface AndvS2Config {
  dataCfg?: S2DataConfig;
  options: S2Options;
  theme?: S2Theme;
  palette?: Palette;
  onRowCellCollapseTreeRows?: (val: {
    isCollapsed: boolean;
    node: Node;
  }) => void;
  onCollapseRowsAll?: (hierarchyCollapse: boolean) => void;
}
