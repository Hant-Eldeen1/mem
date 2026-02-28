import React, { useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useMemoryStore } from '../../store/memoryStore';

const EditorPanel = ({ className, onRun }) => {
  const editorRef = useRef(null);
  const { currentCode, setCode, breakpoints, toggleBreakpoint } = useMemoryStore();

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Custom C language configuration for memory operations
    monaco.languages.register({ id: 'c-memory' });
    monaco.languages.setLanguageConfiguration('c-memory', {
      brackets: [['{', '}'], ['[', ']'], ['(', ')']],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
      ],
    });
    
    // Custom theme for memory operations
    monaco.editor.defineTheme('memoryDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '#C586C0' },
        { token: 'keyword.memory', foreground: '#FF6B6B', fontStyle: 'bold' }, // fseek, fread, etc.
        { token: 'function.io', foreground: '#4ECDC4' },
        { token: 'type.struct', foreground: '#FFE66D' },
        { token: 'comment', foreground: '#6A9955' },
        { token: 'number', foreground: '#B5CEA8' },
        { token: 'string', foreground: '#CE9178' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.lineHighlightBackground': '#2D2D30',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#C6C6C6',
      },
    });
    
    monaco.editor.setTheme('memoryDark');
    
    // Add breakpoint support via glyph margin
    editor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
        const line = e.target.position.lineNumber;
        toggleBreakpoint(line);
        updateBreakpointDecorations(editor, monaco);
      }
    });
  };
  
  const updateBreakpointDecorations = (editor, monaco) => {
    const decorations = Array.from(breakpoints).map(line => ({
      range: new monaco.Range(line, 1, line, 1),
      options: {
        isWholeLine: true,
        glyphMarginClassName: 'breakpoint-glyph',
        glyphMarginHoverMessage: { value: 'Breakpoint' },
        className: 'breakpoint-line',
        overviewRuler: {
          color: '#FF6B6B',
          position: monaco.editor.OverviewRulerLane.Left
        }
      }
    }));
    
    editor.setDecorationsByType('breakpoint', decorations);
  };

  const handleRun = useCallback(() => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      onRun(code);
    }
  }, [onRun]);

  return (
    <div className={`editor-panel ${className}`}>
      <div className="editor-header">
        <span className="file-name">main.c</span>
        <div className="editor-actions">
          <button className="btn-run" onClick={handleRun}>
            ▶ Run
          </button>
          <button className="btn-step" onClick={() => useMemoryStore.getState().stepForward()}>
            ⏭ Step
          </button>
          <button className="btn-reset" onClick={() => useMemoryStore.getState().reset()}>
            ⟲ Reset
          </button>
        </div>
      </div>
      
      <div className="editor-container">
        <Editor
          height="100%"
          defaultLanguage="c"
          value={currentCode}
          onChange={setCode}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true, scale: 1 },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            renderLineHighlight: 'all',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 4,
            insertSpaces: true,
          }}
        />
      </div>
    </div>
  );
};

export default EditorPanel;