import { KeyboardEvent } from 'react'

/**
 * Handles the keydown event for form submission.
 * Executes the callback function when Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux) is pressed.
 * 
 * @param event - The keyboard event
 * @param callback - The function to be called when the key combination is pressed
 */
export const handleKeyDownForForm = (event: KeyboardEvent<HTMLDivElement>, callback: () => void) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault()
    callback()
  }
}