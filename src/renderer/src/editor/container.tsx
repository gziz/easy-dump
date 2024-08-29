import { useNotes } from "@renderer/context/NoteContext";
import SimpleMarkdownEditor from "../home/SimpleMarkdownEditor";
import { useMarkdownEditor } from "../home/useMarkdownEditor";
import { MDXEditor, thematicBreakPlugin } from "@mdxeditor/editor";

const EditorContainer = () => {
  const { notes } = useNotes();
  const { editorRef, handleClear } = useMarkdownEditor();

  const combinedMarkdown = notes.map(note => note.content).join('\n\n --- \m\m');

  const handleChange = (markdown: string) => {
    // TODO: Implement logic to update notes based on changes
    console.log("Markdown changed:", markdown);
  };

  editorRef.current?.setMarkdown(combinedMarkdown)
  const markdown = `
Hello

---

World
`

return (
<MDXEditor markdown={markdown} plugins={[thematicBreakPlugin()]} />
)




  // return (
  //   <div style={{ width: '100%', height: '100%' }} >
  //     <SimpleMarkdownEditor
  //       initialMarkdown={combinedMarkdown}
  //       onChange={handleChange}
  //       ref={editorRef}
  //     />
  //   </div>
  // );
};

export default EditorContainer;