import React from "react";

export default function MemoryPreview({ memory = [], cursor = -1, onSelect }) {
  return (
    <div className="memory-preview">
      <div className="memory-grid">
        {memory.map((b, i) => {
          const isCursor = i === cursor;
          return (
            <div
              key={i}
              className={`memory-cell ${isCursor ? "cell-cursor" : ""}`}
              onClick={() => onSelect && onSelect(i, b)}
            >
              <div className="cell-addr">0x{(i * 4).toString(16).padStart(4, "0")}</div>
              <div className="cell-val">{b}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}