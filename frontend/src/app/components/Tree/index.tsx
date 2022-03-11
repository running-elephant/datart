import { LoadingOutlined } from '@ant-design/icons';
import { Empty, Tree as AntTree, TreeProps as AntTreeProps } from 'antd';
import classnames from 'classnames';
import styled from 'styled-components/macro';
import {
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_REGULAR,
  SPACE,
  SPACE_TIMES,
  SPACE_XS,
} from 'styles/StyleConstants';

interface TreeProps extends AntTreeProps {
  loading: boolean;
}

export function Tree({ loading, treeData, ...treeProps }: TreeProps) {
  return (
    <Wrapper
      className={classnames({ container: loading || !treeData?.length })}
    >
      {loading ? (
        <LoadingOutlined />
      ) : (
        treeData &&
        (treeData.length ? (
          <StyledDirectoryTree
            showIcon
            blockNode
            treeData={treeData}
            {...treeProps}
          />
        ) : (
          <Empty />
        ))
      )}
    </Wrapper>
  );
}

export { TreeTitle } from './TreeTitle';

const Wrapper = styled.div`
  flex: 1;
  overflow-y: auto;

  &.container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const StyledDirectoryTree = styled(AntTree)`
  &.ant-tree {
    font-weight: ${FONT_WEIGHT_MEDIUM};
    color: ${p => p.theme.textColorSnd};

    .ant-tree-switcher {
      line-height: 38px;
    }

    .ant-tree-treenode {
      align-items: center;
      padding: 0 0 ${SPACE} ${SPACE_XS};

      .ant-tree-node-content-wrapper {
        display: flex;
        align-items: center;
        min-width: 0;
        line-height: 38px;

        &:hover {
          background: none;
        }

        .ant-tree-iconEle {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          color: ${p => p.theme.textColorDisabled};
        }

        .ant-tree-title {
          flex: 1;
          overflow: hidden;
        }

        &.ant-tree-node-selected {
          font-weight: ${FONT_WEIGHT_MEDIUM};
          color: ${p => p.theme.primary};
          background: none;
        }
      }

      &:hover {
        color: ${p => p.theme.primary};

        .ant-tree-node-content-wrapper {
          .ant-tree-iconEle {
            color: ${p => p.theme.primary};
          }
        }
      }
    }

    .ant-tree-treenode-selected {
      background-color: ${p => p.theme.bodyBackground};

      .ant-tree-switcher {
        color: ${p => p.theme.primary};
      }

      &.ant-tree-treenode {
        .ant-tree-node-content-wrapper {
          .ant-tree-iconEle {
            color: ${p => p.theme.primary};
          }
        }
      }
    }

    .ant-tree-checkbox {
      margin-top: 0;
    }

    &.dropdown {
      min-width: ${SPACE_TIMES(40)};
      padding: ${SPACE};
      font-weight: ${FONT_WEIGHT_REGULAR};
      color: ${p => p.theme.textColor};

      .ant-tree-switcher {
        display: none;
      }

      .ant-tree-treenode {
        .ant-tree-node-content-wrapper {
          line-height: 32px;
        }
      }
    }

    &.medium {
      .ant-tree-switcher {
        line-height: 32px;
      }
      .ant-tree-treenode {
        .ant-tree-node-content-wrapper {
          line-height: 32px;
        }
      }
    }
  }
`;
