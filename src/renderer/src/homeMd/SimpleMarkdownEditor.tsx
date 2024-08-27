import '@mdxeditor/editor/style.css'
import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
} from '@mdxeditor/editor'
import { forwardRef } from 'react'

interface SimpleMarkdownEditorProps {
  initialMarkdown: string;
}

const SimpleMarkdownEditor = forwardRef<MDXEditorMethods, SimpleMarkdownEditorProps>(({ initialMarkdown }, ref) => {
  return (
    <MDXEditor
      markdown={initialMarkdown}
      ref={ref}
      plugins={[headingsPlugin(), listsPlugin(), markdownShortcutPlugin()]}
      onChange={(text) => console.log(text)}
    />
  )
});

export default SimpleMarkdownEditor;