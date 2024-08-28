import '@mdxeditor/editor/style.css'
import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
} from '@mdxeditor/editor'
import { forwardRef, useCallback, KeyboardEvent } from 'react'

interface SimpleMarkdownEditorProps {
  initialMarkdown: string;
  onChange?: (markdown: string) => void;
  onCreateNote?: () => void;
}

const SimpleMarkdownEditor = forwardRef<MDXEditorMethods, SimpleMarkdownEditorProps>(({ initialMarkdown, onChange, onCreateNote }, ref) => {

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      onCreateNote?.()
    }
  }, [onCreateNote])

  return (
    <div onKeyDown={handleKeyDown}>
      <MDXEditor
        markdown={initialMarkdown}
        ref={ref}
        plugins={[headingsPlugin(), listsPlugin(), markdownShortcutPlugin()]}
        onChange={onChange}
      />
    </div>
  )
});

export default SimpleMarkdownEditor;