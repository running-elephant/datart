import {
  createContext,
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { monaco } from 'react-monaco-editor';

interface EditorContextValue {
  editorInstance: monaco.editor.IStandaloneCodeEditor | undefined;
  editorCompletionItemProviderRef:
    | MutableRefObject<monaco.IDisposable | undefined>
    | undefined;
  setEditor: (editor: monaco.editor.IStandaloneCodeEditor | undefined) => void;
  onRun: () => void;
  onSave: () => void;
  initActions: ({
    onRun,
    onSave,
  }: {
    onRun: () => void;
    onSave: () => void;
  }) => void;
}

const editorContextValue: EditorContextValue = {
  editorInstance: void 0,
  editorCompletionItemProviderRef: void 0,
  setEditor: () => {},
  onRun: () => {},
  onSave: () => {},
  initActions: () => {},
};

export const EditorContext = createContext(editorContextValue);

export const useEditorContext = (): EditorContextValue => {
  const [editorInstance, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor>();
  const [onRun, setOnRun] = useState(() => () => {});
  const [onSave, setOnSave] = useState(() => () => {});
  const editorCompletionItemProviderRef = useRef<monaco.IDisposable>();

  const initActions = useCallback(({ onRun, onSave }) => {
    setOnRun(() => onRun);
    setOnSave(() => onSave);
  }, []);

  return useMemo(
    () => ({
      editorInstance,
      editorCompletionItemProviderRef,
      setEditor,
      onRun,
      onSave,
      initActions,
    }),
    [
      editorInstance,
      editorCompletionItemProviderRef,
      onRun,
      onSave,
      initActions,
    ],
  );
};
