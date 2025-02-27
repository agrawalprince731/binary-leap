import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../public/electron-preload.js'),
      nodeIntegration: false, // Security best practice
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // Development: Load Vite Dev Server
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // Production: Load built React files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle deep linking in Electron (prevents navigation issues)
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http')) event.preventDefault();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Prevent multiple instances
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}
