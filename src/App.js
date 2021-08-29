import './App.css';
import React from 'react';
import Tooltip from './components/Tooltip/Tooltip'

function App() {
  const anchorRef = React.useRef();
  return (
    <div className="App">
      <button ref={anchorRef}>Click me</button>
      <Tooltip anchorRef={anchorRef} tooltipPosition="bottom" pointerPosition="start"/>
    </div>
  );
}

export default App;
