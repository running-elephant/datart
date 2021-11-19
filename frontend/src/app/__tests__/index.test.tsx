import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { App } from '../index';

const renderer = createRenderer();

describe('<App />', () => {
  // TODO(Owner): fix app tests...
  it.skip('should render and match the snapshot', () => {
    renderer.render(<App />);
    const renderedOutput = renderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
