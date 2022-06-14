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
import { ChartSelectOption } from 'app/models/ChartSelectOption';
import { ChartMouseEvent } from 'app/types/Chart';
import { ECharts, init } from 'echarts';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { CloneValueDeep } from 'utils/object';
import { GeoInfo, MapOption } from './types';

interface MapWrapperProps {
  mapOption: MapOption;
  containerId?: string;
  mouseEvents: ChartMouseEvent[];
  isNormalGeoMap: boolean;
  selectOption: null | ChartSelectOption;
}

const BasicMapWrapper: FC<MapWrapperProps> = memo(
  ({ containerId, mouseEvents, mapOption, isNormalGeoMap, selectOption }) => {
    const [chartContainerId] = useState<string>(containerId + '-map');
    const chart = useRef<ECharts>();
    const [geoConfig, setGeoConfig] = useState<GeoInfo>({
      center: undefined,
      zoom: 1,
    });

    const getOptionsConfig = useCallback(() => {
      const newOption: any = CloneValueDeep(chart.current?.getOption());
      setGeoConfig(() => ({
        center: newOption?.geo?.[0].center,
        zoom: newOption?.geo?.[0].zoom,
      }));
    }, []);

    useEffect(() => {
      const container = document.getElementById(chartContainerId);
      if (container) {
        const initChart = init(container, 'default');
        chart.current = initChart;
        selectOption?.addUnselectOption({ chart: initChart, mouseEvents });
        container.removeEventListener('mouseup', getOptionsConfig);
        container.addEventListener('mouseup', getOptionsConfig);
        mouseEvents.forEach(event => {
          if (event.name === 'click') {
            initChart.on(event.name, (params: any) => {
              if (params.componentType === 'series' || isNormalGeoMap) {
                selectOption?.normalSelect({
                  index: params.componentIndex + ',' + params.dataIndex,
                  data: params.data,
                });
                event.callback({
                  ...params,
                  interactionType: 'select',
                  selectedItems: selectOption?.selectedItems,
                });
              }
            });
          } else {
            initChart.on(event.name, event?.callback as any);
          }
        });
      }
      return () => {
        container?.removeEventListener('mouseup', getOptionsConfig);
        selectOption?.removeEvent();
        chart.current?.clear();
      };
    }, [chartContainerId]);

    const setMapOption = useCallback(
      geoConfig => {
        if (mapOption) {
          const newOption: object = Object.assign(mapOption, {
            geo: {
              ...mapOption.geo,
              ...geoConfig,
            },
          });
          chart.current?.setOption(Object.assign({}, newOption), true);
        }
      },
      [mapOption],
    );

    useEffect(() => {
      setMapOption(geoConfig);
    }, [setMapOption, mapOption]);

    const zoomIn = useCallback(() => {
      const geo = {
        center: geoConfig.center,
        zoom: geoConfig.zoom! * 1.25,
      };
      setGeoConfig(geo);
      setMapOption(geo);
    }, [geoConfig, setMapOption]);

    const zoomOut = useCallback(() => {
      const geo = {
        center: geoConfig.center,
        zoom: geoConfig.zoom! / 1.25,
      };
      setGeoConfig(geo);
      setMapOption(geo);
    }, [geoConfig, setMapOption]);

    const resetZoom = useCallback(() => {
      const geo = {
        center: undefined,
        zoom: 1,
      };
      setGeoConfig(geo);
      setMapOption(geo);
    }, [setMapOption]);

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
