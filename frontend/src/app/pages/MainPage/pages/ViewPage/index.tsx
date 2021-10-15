import { useSourceSlice } from '../SourcePage/slice';
import { Container } from './Container';
import { EditorContext, useEditorContext } from './EditorContext';
import { SaveFormContext, useSaveFormContext } from './SaveFormContext';
import { useViewSlice } from './slice';

export function ViewPage() {
  useViewSlice();
  useSourceSlice();
  const saveFormContextValue = useSaveFormContext();
  const editorContextValue = useEditorContext();

  return (
    <EditorContext.Provider value={editorContextValue}>
      <SaveFormContext.Provider value={saveFormContextValue}>
        <Container />
      </SaveFormContext.Provider>
    </EditorContext.Provider>
  );
}
