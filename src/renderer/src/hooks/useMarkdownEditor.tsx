import { MDXEditorMethods } from "@mdxeditor/editor"
import { useRef } from "react"

export const useMarkdownEditor = () => {
  const editorRef = useRef<MDXEditorMethods>(null)
  const handleClear = () => {
    editorRef.current?.setMarkdown("")
  }
  return {editorRef, handleClear}
}