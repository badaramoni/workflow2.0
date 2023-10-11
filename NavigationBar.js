import React from 'react';

function NavigationBar({ children, createNewFile, loadProject }) {
  return (
    <div style={{ width: '20%', overflowY: 'auto', borderRight: '1px solid gray' }}>
      <button onClick={createNewFile}>New File</button>
      <input type="file" onChange={loadProject} />
      {children}
    </div>
  );
}

export default NavigationBar;
