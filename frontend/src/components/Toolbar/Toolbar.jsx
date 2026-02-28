import React from "react";

export default function Toolbar() {
  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <div className="logo">Memory<span className="logo-accent">IDE</span></div>
        <div className="sep" />
        <nav className="toolbar-actions">
          <button className="btn subtle">New</button>
          <button className="btn subtle">Open</button>
          <button className="btn primary">Run</button>
          <button className="btn danger">Stop</button>
        </nav>
      </div>

      <div className="toolbar-right">
        <div className="status-pill">Disconnected</div>
      </div>
    </header>
  );
}