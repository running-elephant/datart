import { PivotSheet } from '@antv/s2';
import '@antv/s2-react/dist/style.min.css';

const s2Table = (container: any) => {
  const s2Options = {
    width: 600,
    height: 480,
    interaction: {
      enableCopy: true,
    },
  };

  const s2DataConfig = {
    fields: {},
    meta: [],
    data: [],
  };

  let chart: PivotSheet = new PivotSheet(container, s2DataConfig, s2Options);
  return chart;
};
export default s2Table;
