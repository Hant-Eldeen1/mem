const { app, BrowserWindow } = require("electron");
const path = require("path");

// live reload على ملفات Electron نفسها
require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"),
});

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // الآن Electron يقرأ ملفات build مباشرة
  win.loadFile(path.join(__dirname, "dist", "index.html"));
});
