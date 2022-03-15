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

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import BasicFont from '../Basic/BasicFont';

describe('<BasicFont />', () => {
  let translator;
  beforeAll(() => {
    translator = label => `This is a ${label}`;
  });

  test('should render component correct', async () => {
    const { getByText, container } = render(
      <BasicFont
        ancestors={[]}
        translate={translator}
        data={{
          key: 'font',
          comType: 'font',
          label: 'Component Label',
          value: true,
        }}
      />,
    );
    const allSelectors = await screen.findAllByRole('combobox');
    expect(getByText('This is a Component Label')).toBeInTheDocument();
    expect(container.querySelector('[class*="ColorPicker"]')).not.toBeNull();
    expect(allSelectors).toHaveLength(4);
  });

  test('should hide label when options hide label', async () => {
    render(
      <BasicFont
        ancestors={[]}
        translate={translator}
        data={{
          key: 'font',
          comType: 'font',
          label: 'Component Label',
          options: { hideLabel: true },
        }}
      />,
    );
    await waitFor(() => {
      expect(
        screen.queryByText('This is a Component Label'),
      ).not.toBeInTheDocument();
    });
  });
});
