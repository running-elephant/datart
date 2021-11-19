import { SearchOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components/macro';
import { SPACE_TIMES } from 'styles/StyleConstants';

export function NotFoundPage() {
  return (
    <Wrapper>
      <Helmet>
        <title>404 Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <h1>
        <SearchOutlined className="icon" />
        404
      </h1>
      <h2>没有这个页面</h2>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.textColorLight};

  h1 {
    position: relative;
    font-size: 128px;
    line-height: 1.2;

    .icon {
      position: absolute;
      top: ${SPACE_TIMES(4)};
      left: ${SPACE_TIMES(-20)};
      font-size: 64px;
    }
  }

  h2 {
    font-size: 48px;
  }
`;
