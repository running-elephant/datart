import { Col, Row } from 'antd';
import React, { FC, memo, useContext, useMemo } from 'react';
import styled from 'styled-components/macro';
import {
  ControllerWidgetContent,
  SpecialContainerConfig,
  Widget,
} from '../../pages/Board/slice/types';
import { getWidgetStyle } from '../../utils/widget';
import { WidgetCore } from '../WidgetCore';
import { WidgetName } from '../WidgetCore/WidgetName/WidgetName';
import { WidgetAllProvider } from '../WidgetProvider/WidgetAllProvider';
import { WidgetContext } from '../WidgetProvider/WidgetProvider';
import WidgetToolBar from '../WidgetToolBar';

const BoardLayout: FC<{
  config: SpecialContainerConfig;
  controllerGroup: Widget[];
  editor?: boolean;
}> = ({ config, controllerGroup, editor = false, children }) => {
  console.log(controllerGroup);
  const renderControllerList = useMemo(() => {
    if (controllerGroup?.length) {
      const list = controllerGroup
        .sort((first, last) => {
          const firstNum =
            (first.config.content as ControllerWidgetContent).config
              ?.positionOptions?.rank ?? 0;
          const lastNum =
            (last.config.content as ControllerWidgetContent).config
              ?.positionOptions?.rank ?? 0;
          return firstNum - lastNum;
        })
        .map(({ id, config }) => {
          const { positionOptions } = (
            config.content as ControllerWidgetContent
          ).config;
          return (
            <Col span={positionOptions?.width || 4}>
              <WidgetAllProvider id={id}>
                <WidgetOfController editor={editor} />
              </WidgetAllProvider>
            </Col>
          );
        });
      return (
        <StyledRow>
          <Row gutter={12}>{list}</Row>
        </StyledRow>
      );
    }
    return null;
  }, [controllerGroup, editor]);

  return (
    <>
      {config?.controllerGroup?.position === 'top' && renderControllerList}
      {children}
      {config?.controllerGroup?.position === 'bottom' && renderControllerList}
    </>
  );
};

export default BoardLayout;

export const WidgetOfController: React.FC<{ editor: boolean }> = memo(
  ({ editor }) => {
    const widget = useContext(WidgetContext);
    const ssp = e => {
      e.stopPropagation();
    };
    const widgetStyle = useMemo(() => getWidgetStyle('auto', widget), [widget]);
    return (
      <Warp style={widgetStyle} onClick={ssp}>
        <ItemContainer className="ItemContainer">
          <WidgetName config={widget.config} />
          <WidgetCore />
        </ItemContainer>

        {editor && (
          <div
            onClick={ssp}
            style={{
              position: 'absolute',
              top: '0',
              zIndex: 15,
              width: '100%',
              height: '100%',
            }}
          ></div>
        )}

        <WidgetToolBar />
      </Warp>
    );
  },
);

const Warp = styled.div<{}>`
  &:hover .widget-tool-dropdown {
    visibility: visible;
  }
`;
const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const StyledRow = styled.div`
  padding: 6px;
  background-color: #fff;
  border: 1px solid #e9ecef;
`;
