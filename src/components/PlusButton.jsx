import { useState, useRef, useEffect } from 'react';
import '../styles/PlusMenu.css';

export default function PlusMenu({onTagSelect}) {
  const [open, setOpen] = useState(false);
  const [option, setOption] = useState(null);
  const [customTag, setCustomTag] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (showCustomInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCustomInput]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
        setShowCustomInput(false);
        setCustomTag('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (option) => {
    if (option === 'custom') {
      setShowCustomInput(true);
    } else {
      setOpen(false);
      setOption(option);
      if (onTagSelect) onTagSelect(option);
    }
  };

  const handleCustomTagSubmit = (e) => {
    e.preventDefault();
    if (customTag.trim()) {
      setOpen(false);
      setShowCustomInput(false);
      setOption(customTag);
      if (onTagSelect) onTagSelect(customTag.trim());
      setCustomTag('');
    }
  };

  return (
    <div className="plus-menu-container" style={{display: "flex"}} ref={menuRef}>
      <button className="plus-button" onClick={() => setOpen(!open)}>＋</button>
      {open && !showCustomInput && (
        <div className="side-menu">
          <button onClick={() => handleClick('agree')}>Agree</button>
          <button onClick={() => handleClick('disagree')}>Disagree</button>
          <button onClick={() => handleClick('tag')}>Tag</button>
          <button onClick={() => handleClick('custom')}>Custom</button>
        </div>
      )}
      {showCustomInput && (
        <form onSubmit={handleCustomTagSubmit} className="side-menu">
          <input
            ref={inputRef}
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Custom tag..."
            maxLength={20}
          />
          <button type="submit">Add</button>
          <button 
            type="button" 
            onClick={() => {
              setShowCustomInput(false);
              setCustomTag('');
            }}
          >
            ×
          </button>
        </form>
      )}
      {option && (
        <div className="selected-option1">
          <h1 className="glow">#{option}</h1>
        </div>
      )}
    </div>
  );
}