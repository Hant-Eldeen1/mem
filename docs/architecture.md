memory-visual-ide/
│
├─ backend/
│ ├─ main.py # Entry point
│ ├─ parser/
│ │ ├─ c_parser.py # pycparser wrapper
│ │ └─ symbols.py # Variables, structs
│ │
│ ├─ memory/
│ │ ├─ memory_model.py # Virtual memory
│ │ ├─ blocks.py # MemoryBlock, Cursor
│ │ └─ file_memory.py # File simulation
│ │
│ ├─ engine/
│ │ ├─ executor.py # Executes parsed C step-by-step
│ │ └─ events.py # Emits UI events
│ │
│ └─ api/
│ └─ ws_server.py # WebSocket to frontend
│
├─ frontend/
│ ├─ src/
│ │ ├─ components/
│ │ │ ├─ MemoryGrid.jsx
│ │ │ ├─ Pointer.jsx
│ │ │ └─ Controls.jsx
│ │ │
│ │ ├─ editor/
│ │ │ └─ CEditor.jsx
│ │ │
│ │ ├─ state/
│ │ │ └─ memoryStore.js
│ │ │
│ │ └─ App.jsx
│ │
│ └─ main.js # Electron entry
│
└─ docs/
└─ architecture.md

---

Run:
npm run dev

after any edit: npm run build

---

Important note!:
in dist index.html must be files start with . like

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Memory Visual IDE</title>
    <script type="module" crossorigin src="./assets/index-DC2dDmAz.js"></script> // like here
    <link rel="stylesheet" crossorigin href="./assets/index-DiIawhu2.css" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

---
