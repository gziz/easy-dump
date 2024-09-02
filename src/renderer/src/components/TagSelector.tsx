import { Select } from 'antd'
import React, { useState } from 'react'

interface TagSelectorProps {
  allTags: { value: string; label: string }[]
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  onBlur?: () => void
  autoFocus?: boolean
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void
  isBorderless?: boolean
}

const TagSelector: React.FC<TagSelectorProps> = ({
  allTags,
  selectedTags,
  setSelectedTags,
  onBlur,
  onKeyDown,
  autoFocus = false,
  isBorderless = false
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const handleSelectChange = (tags: string[]) => {
    setSelectedTags(tags)
    setIsDropdownOpen(false)
  }
  
  return (
    <Select
      mode="tags"
      options={allTags}
      style={{
        width: '100%',
        padding: '4px',
        backgroundColor: '#141414',
        margin: 0
      }}
      variant={isBorderless ? 'borderless' : undefined}
      onChange={handleSelectChange}
      value={selectedTags}
      placeholder="Select your tags..."
      open={isDropdownOpen}
      onDropdownVisibleChange={(visible) => setIsDropdownOpen(visible)}
      onBlur={onBlur}
      autoFocus={autoFocus}
      onKeyDown={onKeyDown}
    />
  )
}

export default TagSelector
