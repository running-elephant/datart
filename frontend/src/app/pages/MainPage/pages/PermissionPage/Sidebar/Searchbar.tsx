import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row } from 'antd';
import styled from 'styled-components/macro';
import { SPACE, SPACE_MD, SPACE_UNIT } from 'styles/StyleConstants';

interface SearchbarProps {
  placeholder?: string;
  onSearch: (e) => void;
}

export function Searchbar({ placeholder, onSearch }: SearchbarProps) {
  return (
    <Wrapper className="search">
      <Col span={24}>
        <Input
          prefix={<SearchOutlined className="icon" />}
          placeholder={placeholder}
          className="search-input"
          bordered={false}
          onChange={onSearch}
        />
      </Col>
    </Wrapper>
  );
}

const Wrapper = styled(Row)`
  padding: ${SPACE} 0;

  .icon {
    color: ${p => p.theme.textColorLight};
  }

  .search-input {
    padding-left: ${SPACE_MD};
  }

  .ant-tree .ant-tree-treenode {
    padding-left: ${SPACE_UNIT * 2 + 2}px;
  }
`;
