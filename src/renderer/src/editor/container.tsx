import React, { useState, useRef, useEffect } from 'react';
import { Input, List, Typography } from 'antd';

const { TextArea } = Input;

const EditorContainer = () => {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const textAreaRef = useRef<any>(null);

  const tags = ['todo', 'struggle', 'interesting', 'to research', 'accomplished'];

  useEffect(() => {
    if (showSuggestions && textAreaRef.current) {
      const textarea = textAreaRef.current.resizableTextArea?.textArea;
      if (!textarea) return;
      const cursorIndex = textarea.selectionStart;
      const textBeforeCursor = text.slice(0, cursorIndex);
      const lastAtSymbolIndex = textBeforeCursor.lastIndexOf('@');
      
      if (lastAtSymbolIndex !== -1) {
        const query = textBeforeCursor.slice(lastAtSymbolIndex + 1).toLowerCase();
        const filteredSuggestions = tags.filter(tag => tag.toLowerCase().startsWith(query));
        setSuggestions(filteredSuggestions);
        setSelectedSuggestionIndex(0);

        const { top, left } = getCaretCoordinates(textarea, cursorIndex);
        setCursorPosition({ top, left });
      }
    }
  }, [text, showSuggestions]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    const cursorIndex = e.target.selectionStart;
    const textBeforeCursor = newText.slice(0, cursorIndex);
    const lastAtSymbolIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtSymbolIndex !== -1 && cursorIndex - lastAtSymbolIndex <= 15) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const textarea = textAreaRef.current?.resizableTextArea?.textArea;
    if (!textarea) return;
    const cursorIndex = textarea.selectionStart;
    const textBeforeCursor = text.slice(0, cursorIndex);
    const lastAtSymbolIndex = textBeforeCursor.lastIndexOf('@');
    
    const newText = text.slice(0, lastAtSymbolIndex) + '@' + suggestion + ' ' + text.slice(cursorIndex);
    setText(newText);
    setShowSuggestions(false);
    textarea.focus();
  };

  const getCaretCoordinates = (element: HTMLTextAreaElement, position: number) => {
    const { offsetLeft: inputX, offsetTop: inputY } = element;
    const div = document.createElement('div');
    const styles = getComputedStyle(element);
    div.style.font = styles.font;
    div.style.position = 'absolute';
    div.style.whiteSpace = 'pre-wrap';
    div.textContent = element.value.substring(0, position);
    
    const span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    div.appendChild(span);
    
    document.body.appendChild(div);
    const { offsetLeft: spanX, offsetTop: spanY } = span;
    document.body.removeChild(div);
    
    return {
      top: inputY + spanY,
      left: inputX + spanX,
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex((prevIndex) =>
            prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
          break;
        case 'Escape':
          e.preventDefault();
          setShowSuggestions(false);
          break;
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <TextArea
        ref={textAreaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type @ to mention a tag"
        style={{ width: '100%' }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <List
          style={{
            position: 'absolute',
            top: `${cursorPosition.top + 20}px`,
            left: `${cursorPosition.left}px`,
            border: '1px solid #d9d9d9',
            borderRadius: '2px',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
          size="small"
          dataSource={suggestions}
          renderItem={(suggestion, index) => (
            <List.Item
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                backgroundColor: index === selectedSuggestionIndex ? '#e6f7ff' : 'white',
                cursor: 'pointer',
              }}
            >
              <Typography.Text>{suggestion}</Typography.Text>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default EditorContainer;