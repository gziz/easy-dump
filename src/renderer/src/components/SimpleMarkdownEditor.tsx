import {
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
  thematicBreakPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { forwardRef } from 'react';

interface SimpleMarkdownEditorProps {
  initialMarkdown: string;
  onChange?: (markdown: string) => void;
}

const SimpleMarkdownEditor = forwardRef<MDXEditorMethods, SimpleMarkdownEditorProps>(({ initialMarkdown, onChange }, ref) => {
  return (
      <MDXEditor
        placeholder="Start typing..."
        markdown={initialMarkdown}
        ref={ref}
        plugins={[headingsPlugin(), listsPlugin(), markdownShortcutPlugin(), thematicBreakPlugin(), linkPlugin()]}
        onChange={onChange}
        className="dark-theme dark-editor"
      />
  )
});

export default SimpleMarkdownEditor;