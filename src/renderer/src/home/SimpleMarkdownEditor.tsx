import '@mdxeditor/editor/style.css'
import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
  thematicBreakPlugin,
} from '@mdxeditor/editor'
import { forwardRef } from 'react'

interface SimpleMarkdownEditorProps {
  initialMarkdown: string;
  onChange?: (markdown: string) => void;
  onCreateNote?: () => void;
}

const SimpleMarkdownEditor = forwardRef<MDXEditorMethods, SimpleMarkdownEditorProps>(({ initialMarkdown, onChange }, ref) => {
  return (
      <MDXEditor
        placeholder="Start typing..."
        markdown={initialMarkdown}
        ref={ref}
        plugins={[headingsPlugin(), listsPlugin(), markdownShortcutPlugin(), thematicBreakPlugin()]}
        onChange={onChange}
      />
  )
});

export default SimpleMarkdownEditor;