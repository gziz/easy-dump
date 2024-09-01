import { Select, RefSelectProps } from 'antd'
import React, { useRef, useEffect, useState } from 'react'

interface TagSelectorProps {
  allTags: { value: string; label: string }[]
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
}

const TagSelectorModal: React.FC<TagSelectorProps> = ({
  allTags,
  selectedTags,
  setSelectedTags,
}) => {
  const innerRef = useRef<RefSelectProps>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (innerRef.current) {
        innerRef.current.focus()
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  const handleSelectChange = (tags: string[]) => {
    setSelectedTags(tags)
    setIsDropdownOpen(false)
  }

  return (
    <Select
      ref={innerRef}
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
      autoFocus={true}
      open={isDropdownOpen}
      onDropdownVisibleChange={(open) => setIsDropdownOpen(open)}
    />
  )
}

export default TagSelectorModal
