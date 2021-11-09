import { CommonFormTypes } from 'globalConstants';
import { createContext, useCallback, useMemo, useState } from 'react';

interface SaveFormModel {
  id?: string;
  name: string;
  parentId: string | null;
  config?: object;
}

interface SaveFormState {
  type: CommonFormTypes;
  visible: boolean;
  simple?: boolean;
  initialValues?: SaveFormModel;
  parentIdLabel: string;
  onSave: (values: SaveFormModel, onClose: () => void) => void;
  onAfterClose?: () => void;
}

interface SaveFormContextValue extends SaveFormState {
  onCancel: () => void;
  showSaveForm: (formState: SaveFormState) => void;
}

const saveFormContextValue: SaveFormContextValue = {
  type: CommonFormTypes.Add,
  visible: false,
  simple: false,
  parentIdLabel: '',
  onSave: () => {},
  onCancel: () => {},
  showSaveForm: () => {},
};

export const SaveFormContext = createContext(saveFormContextValue);

export const useSaveFormContext = (): SaveFormContextValue => {
  const [type, setType] = useState(CommonFormTypes.Add);
  const [visible, setVisible] = useState(false);
  const [simple, setSimple] = useState<boolean | undefined>(false);
  const [initialValues, setInitialValues] = useState<
    undefined | SaveFormModel
  >();
  const [parentIdLabel, setParentIdLabel] = useState('目录');
  const [onSave, setOnSave] = useState(() => () => {});
  const [onAfterClose, setOnAfterClose] = useState(() => () => {});

  const onCancel = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const showSaveForm = useCallback(
    ({
      type,
      visible,
      simple,
      initialValues,
      parentIdLabel,
      onSave,
      onAfterClose,
    }: SaveFormState) => {
      setType(type);
      setVisible(visible);
      setSimple(simple);
      setInitialValues(initialValues);
      setParentIdLabel(parentIdLabel);
      setOnSave(() => onSave);
      setOnAfterClose(() => onAfterClose);
    },
    [],
  );

  return useMemo(
    () => ({
      type,
      visible,
      simple,
      initialValues,
      parentIdLabel,
      onSave,
      onCancel,
      onAfterClose,
      showSaveForm,
    }),
    [
      type,
      visible,
      simple,
      initialValues,
      parentIdLabel,
      onSave,
      onCancel,
      onAfterClose,
      showSaveForm,
    ],
  );
};
