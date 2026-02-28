import React from "react";

export default function MemoryDetails({ selected = null }) {
  if (!selected || selected.addr === null) {
    return (
      <div className="memory-details empty">
        <div className="h4">Memory details</div>
        <p className="muted">Select a memory cell to see details.</p>
      </div>
    );
  }

  return (
    <div className="memory-details">
      <div className="h4">Memory details</div>
      <div className="detail-row"><strong>Address:</strong> 0x{(selected.addr * 4).toString(16)}</div>
      <div className="detail-row"><strong>Value:</strong> {String(selected.value)}</div>
      <div className="detail-row"><strong>Interpret as:</strong> int / float / char[]</div>
      <div style={{ marginTop: 10 }}>
        <button className="btn primary">Inspect bytes</button>
      </div>
    </div>
  );
}