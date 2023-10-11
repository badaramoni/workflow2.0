import React from 'react';
import MonacoEditor from 'react-monaco-editor';

function EditorWindow({ content }) {
  const editorOptions = {
    selectOnLineNumbers: true,
    renderIndentGuides: true,
    colorDecorators: true,
    cursorBlinking: 'blink',
    autoClosingQuotes: 'always'
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', height: '100%' }}>
      <MonacoEditor
        width="100%"
        height="100%"
        language="plaintext"
        theme="vs-dark"
        value={content}
        options={editorOptions}
      />
    </div>
  );
}

export default EditorWindow;
