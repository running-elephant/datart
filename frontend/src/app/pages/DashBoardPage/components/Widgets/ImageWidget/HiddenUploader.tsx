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

import { Upload } from 'antd';
import { uploadBoardImage } from 'app/pages/DashBoardPage/pages/BoardEditor/slice/thunk';
import {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
} from 'react';
import { useDispatch } from 'react-redux';
import { BoardContext } from '../../BoardProvider/BoardProvider';

interface HiddenUploaderProps {
  onChange: (url: string) => void;
}

export const HiddenUploader = forwardRef(
  ({ onChange }: HiddenUploaderProps, ref) => {
    const dispatch = useDispatch();
    const uploadRef = useRef<any>();
    const { boardId } = useContext(BoardContext);

    useImperativeHandle(ref, () => uploadRef.current?.upload.uploader);

    const beforeUpload = useCallback(
      async info => {
        const formData = new FormData();
        formData.append('file', info);
        dispatch(
          uploadBoardImage({
            boardId,
            fileName: info.name,
            formData: formData,
            resolve: onChange,
          }),
        );
        return false;
      },
      [boardId, dispatch, onChange],
    );

    return (
      <Upload
        accept=".jpg,.jpeg,.png,.gif,.svg"
        beforeUpload={beforeUpload}
        multiple={false}
        showUploadList={false}
        style={{ display: 'none' }}
        ref={uploadRef}
      />
    );
  },
);
