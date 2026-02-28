// frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import { useMemoryStore } from './store/memoryStore';
import Toolbar from './components/Toolbar/Toolbar';
import EditorPanel from './components/Editor/EditorPanel';
import MemoryStage from './components/MemoryStage/MemoryStage';
import InspectorPanel from './components/Inspector/InspectorPanel';
import Timeline from './components/Timeline/Timeline';
import StatusBar from './components/StatusBar/StatusBar';
import './styles.css';

function App() {
  const { connectToBackend, isConnected, executionHistory } = useMemoryStore();
  const [layout, setLayout] = useState('default'); // 'default', 'focus-editor', 'focus-memory'

  useEffect(() => {
    // Connect to Python backend via WebSocket or Electron IPC
    connectToBackend();
  }, []);

  return (
    <div className={`app-container layout-${layout}`}>
      {/* Top Toolbar */}
      <Toolbar 
        onLayoutChange={setLayout}
        isConnected={isConnected}
      />
      
      {/* Main Workspace */}
      <div className="workspace">
        {/* Left: Code Editor */}
        <EditorPanel 
          className="panel-editor"
          onRun={(code) => window.electronAPI?.sendToBackend('c-code:execute', code)}
        />
        
        {/* Center: Memory Visualization */}
        <MemoryStage 
          className="panel-memory"
          history={executionHistory}
        />
        
        {/* Right: Inspector */}
        <InspectorPanel 
          className="panel-inspector"
        />
      </div>
      
      {/* Bottom: Timeline & Status */}
      <div className="bottom-panel">
        <Timeline history={executionHistory} />
        <StatusBar isConnected={isConnected} />
      </div>
    </div>
  );
}

export default App;