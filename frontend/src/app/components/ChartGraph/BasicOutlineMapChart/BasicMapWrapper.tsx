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

import {
  RedoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { ECharts, init } from 'echarts';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { CloneValueDeep } from '../../../../utils/object';
import { ChartMouseEvent } from '../../../types/Chart';
import { initSelectEvent } from '../../../utils/chartHelper';
import { GeoInfo, MapOption } from './types';

interface MapWrapperProps {
  option: MapOption;
  containerId?: string;
  mouseEvents?: ChartMouseEvent[];
  isNormalGeoMap: boolean;

  // todo(tianlei) 临时储存数据更新chart start
  self: any;
  // todo(tianlei) 临时储存数据更新chart end
}

const BasicMapWrapper: FC<MapWrapperProps> = memo(
  ({ containerId, mouseEvents, option, isNormalGeoMap, self}) => {
    const [chart, setChart] = useState<ECharts>();
    const [geoConfig, setGeoConfig] = useState<GeoInfo>({
      center: undefined,
      zoom: 1,
    });

    const chartContainerId = useMemo(() => containerId + '-map', [containerId]);

    const getOptionsConfig = useCallback(() => {
      const newOption: any = CloneValueDeep(chart?.getOption());
      setGeoConfig(() => ({
        center: newOption?.geo?.[0].center,
        zoom: newOption?.geo?.[0].zoom,
      }));
    }, [chart]);

    useEffect(() => {
      const container = document.getElementById(chartContainerId);
      if (container) {
        setChart(init(container, 'default'));
        container.addEventListener('mouseup', getOptionsConfig);
      }
      return () => {
        chart?.clear();
      };
    }, [chartContainerId, getOptionsConfig]);

    useEffect(() => {
      mouseEvents?.forEach(event => {
        if (event.name === 'click') {
          chart?.on(event.name, (params: any) => {
            if (params.componentType === 'series' || isNormalGeoMap) {
              // todo(tianlei) 临时储存数据更新chart start
              initSelectEvent(params, self, chart);
              // todo(tianlei) 临时储存数据更新chart end
            }
            event.callback(params);
          });
        } else {
          chart?.on(event.name, event?.callback as any);
        }
      });
    }, [mouseEvents, chart, isNormalGeoMap, self]);

    useEffect(() => {
      if (option) {
        const newOption: object = Object.assign(option, {
          geo: {
            ...option.geo,
            ...geoConfig,
          },
        });
        chart?.setOption(Object.assign({}, newOption), true);
      }
    }, [chart, option, geoConfig]);

    const zoomIn = useCallback(() => {
      setGeoConfig(() => ({
        center: geoConfig.center,
        zoom: geoConfig.zoom! * 1.25,
      }));
    }, [geoConfig]);

    const zoomOut = useCallback(() => {
      setGeoConfig(() => ({
        center: geoConfig.center,
        zoom: geoConfig.zoom! / 1.25,
      }));
    }, [geoConfig]);

    const resetZoom = useCallback(() => {
      setGeoConfig(() => ({
        center: undefined,
        zoom: 1,
      }));
    }, []);

    return (
      <StyledMap>
        <div id={chartContainerId} className="basicMapWrapperBox"></div>
        <MapBtnBox>
          <RedoOutlined className="icon-btn" onClick={resetZoom} />
          <ZoomOutOutlined className="icon-btn" onClick={zoomOut} />
          <ZoomInOutlined className="icon-btn" onClick={zoomIn} />
        </MapBtnBox>
      </StyledMap>
    );
  },
);

const StyledMap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  .basicMapWrapperBox {
    width: 100%;
    height: 100%;
  }
`;

const MapBtnBox = styled.div`
  position: absolute;
  bottom: 2%;
  left: 2%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 20px;
  height: 80px;

  .icon-btn {
    display: block;
    font-size: 20px;
    line-height: 20px;
  }
`;

export default BasicMapWrapper;
