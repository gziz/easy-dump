import { Select, RefSelectProps } from 'antd'
import React, { useRef, useEffect, useState } from 'react'

interface TagSelectorProps {
  allTags: { value: string; label: string }[]
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
}

const TagSelector: React.FC<TagSelectorProps> = ({
  allTags,
  selectedTags,
  setSelectedTags,
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
      variant="borderless"
      onChange={handleSelectChange}
      value={selectedTags}
      placeholder="Select your tags..."
    />
  )
}

export default TagSelector
