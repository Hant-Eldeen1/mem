import React, { useState } from "react";
import MemoryPreview from "./MemoryPreview";
import MemoryDetails from "./MemoryDetails";

export default function Sidebar({ memory = [], selected, onSelect }) {
  const [cursor, setCursor] = useState(-1);

  const handleSelect = (addr, value) => {
    setCursor(addr);
    onSelect && onSelect(addr, value);
  };

  return (
    <div className="sidebar">
      <MemoryDetails selected={selected} />
      <div className="divider" />
      <div style={{ flex: 1 }}>
        <div className="panel-title">Memory preview</div>
        <MemoryPreview memory={memory} cursor={cursor} onSelect={handleSelect} />
      </div>
    </div>
  );
}