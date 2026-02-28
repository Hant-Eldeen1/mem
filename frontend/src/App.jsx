import React, { useState } from "react";
import Toolbar from "./components/Toolbar";
import CEditor from "./editor/CEditor";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [selected, setSelected] = useState({ addr: null, value: null });

  // placeholders for future real state (from backend)
  const memory = new Array(64).fill(0).map((v, i) => i);

  return (
    <div className="app-root">
      <Toolbar />
      <div className="main-grid">
        <main className="left-panel">
          <div className="code-frame">
            <CEditor />
          </div>
        </main>

        <aside className="right-panel">
          <Sidebar
            memory={memory}
            selected={selected}
            onSelect={(addr, value) => setSelected({ addr, value })}
          />
        </aside>
      </div>
    </div>
  );
}