const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const fs = require('fs/promises');
const path = require('path');

let win;
const dataPath = () => path.join(app.getPath('userData'), 'eazysales-data.json');
const sendUpdate = (type, detail = '') => win?.webContents.send('update:status', { type, detail });

async function readData() {
  try { return JSON.parse(await fs.readFile(dataPath(), 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

async function writeData(data) {
  const target = dataPath();
  const temp = `${target}.tmp`;
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(temp, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(temp, target);
  return true;
}

function createWindow() {
  win = new BrowserWindow({ width: 1480, height: 920, minWidth: 1120, minHeight: 700, backgroundColor: '#f5f7fb', title: 'EazySales', webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false } });
  const dev = process.env.EAZYSALES_DEV_URL;
  if (dev) win.loadURL(dev); else win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('data:load', readData);
ipcMain.handle('data:save', (_, data) => writeData(data));
ipcMain.handle('data:export', async (_, data) => {
  const result = await dialog.showSaveDialog(win, { title: '导出 EazySales 数据', defaultPath: `EazySales-${new Date().toISOString().slice(0,10)}.json`, filters: [{ name: 'EazySales 数据', extensions: ['json'] }] });
  if (result.canceled || !result.filePath) return false;
  await fs.writeFile(result.filePath, JSON.stringify(data, null, 2), 'utf8'); return true;
});
ipcMain.handle('data:import', async () => {
  const result = await dialog.showOpenDialog(win, { title: '导入 EazySales 数据', properties: ['openFile'], filters: [{ name: 'EazySales 数据', extensions: ['json'] }] });
  if (result.canceled || !result.filePaths[0]) return null;
  return JSON.parse(await fs.readFile(result.filePaths[0], 'utf8'));
});

autoUpdater.autoDownload = false;
autoUpdater.on('checking-for-update', () => sendUpdate('checking'));
autoUpdater.on('update-available', info => sendUpdate('available', info.version));
autoUpdater.on('update-not-available', () => sendUpdate('latest'));
autoUpdater.on('download-progress', p => sendUpdate('downloading', String(Math.round(p.percent))));
autoUpdater.on('update-downloaded', info => sendUpdate('ready', info.version));
autoUpdater.on('error', error => sendUpdate('error', error.message));
ipcMain.handle('update:check', async () => {
  if (!app.isPackaged) { sendUpdate('dev'); return false; }
  const result = await autoUpdater.checkForUpdates();
  if (result?.updateInfo?.version && result.updateInfo.version !== app.getVersion()) await autoUpdater.downloadUpdate();
  return true;
});
ipcMain.handle('update:install', () => autoUpdater.quitAndInstall(false, true));
