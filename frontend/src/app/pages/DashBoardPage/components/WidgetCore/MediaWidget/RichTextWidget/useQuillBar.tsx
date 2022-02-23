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

import { FONT_FAMILIES, FONT_SIZES } from 'globalConstants';
import { useMemo } from 'react';

export const useQuillBar = (containerId: string | undefined, t) => {
  const toolbar = useMemo(
    () => (
      <div id={containerId}>
        <span className="ql-formats">
          <select
            className="ql-font"
            key="ql-font"
            defaultValue={FONT_FAMILIES[0].value}
            style={{
              whiteSpace: 'nowrap',
              width: '130px',
            }}
          >
            {FONT_FAMILIES.map(font => (
              <option value={font.value} key={font.name}>
                {t?.(font.name)}
              </option>
            ))}
          </select>
          <select className="ql-size" key="ql-size" defaultValue="13px">
            {FONT_SIZES.map(size => (
              <option value={`${size}px`} key={size}>{`${size}px`}</option>
            ))}
          </select>
          <button className="ql-bold" key="ql-bold" title="加粗" />
          <button className="ql-italic" key="ql-italic" title="斜体" />
          <button className="ql-underline" key="ql-underline" title="下划线" />
          <button className="ql-strike" key="ql-strike" title="删除线" />
        </span>

        <span className="ql-formats">
          <select className="ql-color" key="ql-color" />
          <select className="ql-background" key="ql-background" />
        </span>

        <span className="ql-formats">
          <select className="ql-align" key="ql-align" />
          <button
            className="ql-indent"
            value="-1"
            key="ql-indent"
            title="减少缩进"
          />
          <button
            className="ql-indent"
            value="+1"
            key="ql-indent-up"
            title="增加缩进"
          />
        </span>

        <span className="ql-formats">
          <button
            className="ql-list"
            value="ordered"
            key="ql-ordered"
            title="有序列表"
          />
          <button
            className="ql-list"
            value="bullet"
            key="ql-list"
            title="无序列表"
          />
          <button className="ql-blockquote" key="ql-blockquote" title="引用" />
          <button className="ql-code-block" key="ql-code-block" title="代码" />
        </span>

        <span className="ql-formats">
          <button className="ql-link" key="ql-link" title="超链接" />
          <button className="ql-image" key="ql-image" title="图片" />
        </span>

        <span className="ql-formats">
          <button className="ql-clean" key="ql-clean" title="清除样式" />
        </span>
      </div>
    ),
    [containerId, t],
  );
  return toolbar;
};
