const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendToBackend: (channel, data) => ipcRenderer.send(channel, data),
  receiveFromBackend: (channel, callback) => ipcRenderer.on(channel, callback),
});
