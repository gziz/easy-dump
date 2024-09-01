import { KeyboardEvent } from 'react'

export const handleKeyDownForForm = (event: KeyboardEvent<HTMLDivElement>, callback: () => void) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault()
    callback()
  }
}