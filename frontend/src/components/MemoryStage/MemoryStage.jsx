import React, { useRef, useEffect, useState } from 'react';
import { useMemoryStore } from '../../store/memoryStore';
import HexView from './HexView';
import VisualView from './VisualView';
import HybridView from './HybridView';

const MemoryStage = ({ className }) => {
  const [viewMode, setViewMode] = useState('visual'); // 'visual', 'hex', 'hybrid'
  const { memoryState, currentStep, executionHistory } = useMemoryStore();
  
  const currentOperation = executionHistory[currentStep];

  return (
    <div className={`memory-stage ${className}`}>
      <div className="stage-header">
        <h3>Memory Visualization</h3>
        <div className="view-toggle">
          <button 
            className={viewMode === 'visual' ? 'active' : ''}
            onClick={() => setViewMode('visual')}
          >
            Visual
          </button>
          <button 
            className={viewMode === 'hex' ? 'active' : ''}
            onClick={() => setViewMode('hex')}
          >
            Hex
          </button>
          <button 
            className={viewMode === 'hybrid' ? 'active' : ''}
            onClick={() => setViewMode('hybrid')}
          >
            Hybrid
          </button>
        </div>
      </div>
      
      <div className="stage-content">
        {viewMode === 'visual' && (
          <VisualView 
            memoryState={memoryState}
            operation={currentOperation}
          />
        )}
        {viewMode === 'hex' && (
          <HexView 
            memoryState={memoryState}
            operation={currentOperation}
          />
        )}
        {viewMode === 'hybrid' && (
          <HybridView 
            memoryState={memoryState}
            operation={currentOperation}
          />
        )}
      </div>
      
      {currentOperation && (
        <div className="operation-banner">
          <span className="op-type">{currentOperation.type}</span>
          <span className="op-desc">{currentOperation.description}</span>
        </div>
      )}
    </div>
  );
};

export default MemoryStage;