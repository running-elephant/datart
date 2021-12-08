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

import { Form, Modal } from 'antd';
import { useRef } from 'react';
import useI18NPrefix from './useI18NPrefix';

export interface IStateModalContentProps {
  onChange: (o: any) => void;
}

export enum StateModalSize {
  SMALL = 600,
  MIDDLE = 1000,
  LARGE = 1600,
  XLARGE = 2000,
}

const defaultBodyStyle: React.CSSProperties = {
  maxHeight: 1000,
  overflowY: 'scroll',
  overflowX: 'auto',
};

function useStateModal({
  i18nPrefix,
  initState,
}: {
  i18nPrefix?: string;
  initState?: any;
}) {
  const t = useI18NPrefix(i18nPrefix);
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const okCallbackRef = useRef<Function>();
  const cancelCallbackRef = useRef<Function>();
  const stateRef = useRef<any>(initState);

  const handleSaveCacheValue = (...rest) => {
    stateRef.current = rest;
  };

  const handleClickOKButton = closeFn => {
    return form
      .validateFields()
      .then(() => {
        try {
          const spreadParmas =
            Object.keys(stateRef.current || {}).length > 0
              ? stateRef.current
              : [];
          okCallbackRef.current?.call(null, ...spreadParmas);
        } catch (e) {
          console.error('useStateModal | exception message ---> ', e);
        }
        return closeFn;
      })
      .catch(info => {
        return Promise.reject();
      });
  };

  const handleClickCancelButton = () => {
    cancelCallbackRef.current?.call(null, null);
  };

  const FormWrapper = content => {
    return (
      <Form form={form} name="state_modal_form">
        {content}
      </Form>
    );
  };

  const getModalSize = (size?: string | number | StateModalSize): number => {
    if (!size) {
      return StateModalSize.MIDDLE;
    }
    if (!isNaN(+size)) {
      return +size;
    }
    if (typeof size === 'string' && StateModalSize[size.toUpperCase()]) {
      return StateModalSize[size.toUpperCase()];
    }
    return StateModalSize.MIDDLE;
  };

  const showModal = (props: {
    title: string;
    content: (
      cacheOnChangeValue: typeof handleSaveCacheValue,
    ) => React.ReactElement<IStateModalContentProps>;
    bodyStyle?: React.CSSProperties;
    modalSize?: string | number | StateModalSize;
    onOk?: typeof handleClickOKButton;
    onCancel?: typeof handleClickCancelButton;
  }) => {
    okCallbackRef.current = props.onOk;
    cancelCallbackRef.current = props.onCancel;

    // Note: should distory old modal and form effects in order to render new content
    Modal.destroyAll();
    form?.resetFields();

    return modal.confirm({
      title: props.title,
      width: getModalSize(props?.modalSize),
      bodyStyle: props.bodyStyle || defaultBodyStyle,
      content: FormWrapper(props?.content?.call(null, handleSaveCacheValue)),
      onOk: handleClickOKButton,
      onCancel: handleClickCancelButton,
      maskClosable: true,
      icon: null,
    });
  };

  return [showModal, contextHolder];
}

export default useStateModal;
