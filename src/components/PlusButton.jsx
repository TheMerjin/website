import { useState } from 'react';
import '../styles/PlusMenu.css';

export default function PlusMenu({onTagSelect}) {
  const [open, setOpen] = useState(false);
  const [option, setOption] = useState(null);



  const handleClick = (option) => {
    setOpen(false);
    setOption(option);
    if (onTagSelect) onTagSelect(option);
  };

  return (
    <div className="plus-menu-container" style = {{display: "flex", }}>
      <button className="plus-button" onClick={() => setOpen(!open)}>＋</button>
      {open && (
        <div className="side-menu">
          <button onClick={() => handleClick('agree')}>Agree</button>
          <button onClick={() => handleClick('disagree')}>Disagree</button>
          <button onClick={() => handleClick('tag')}>Tag</button>
        </div>

      )} {option && ( <div className="selected-option1" ><h1 className = "glow" > #{option}</h1>
        </div>)}
    </div>
  );
}