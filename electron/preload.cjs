const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('eazySales', {
  loadData: () => ipcRenderer.invoke('data:load'),
  saveData: data => ipcRenderer.invoke('data:save', data),
  exportData: data => ipcRenderer.invoke('data:export', data),
  importData: () => ipcRenderer.invoke('data:import'),
  checkUpdate: () => ipcRenderer.invoke('update:check'),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  onUpdateStatus: callback => ipcRenderer.on('update:status', (_, value) => callback(value))
});
