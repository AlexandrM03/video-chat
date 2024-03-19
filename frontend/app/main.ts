import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { desktopCapturer } from 'electron';

let win: BrowserWindow | null = null;
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

    const size = screen.getPrimaryDisplay().workAreaSize;

    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve),
            contextIsolation: false,
        },
    });

    win.loadURL('file://' + path.join(__dirname, '../index.html'));

    win.webContents.on('did-finish-load', async () => {
        try {
            const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });
            win!.webContents.executeJavaScript(`
                window.getScreenSources = function() {
                    return navigator.mediaDevices.getUserMedia({ video: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: '${sources[0].id}' } } });
                }
            `);
        } catch (error) {
            console.error('Error accessing screen sources:', error);
        }
    });

    if (serve) {
        const debug = require('electron-debug');
        debug();

        require('electron-reloader')(module);
        win.loadURL('http://localhost:3000/login');
    } else {
        let pathIndex = './index.html';

        if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
            pathIndex = '../dist/index.html';
        }

        const url = new URL(path.join('file:', __dirname, pathIndex));
        win.loadURL(url.href);
    }

    win.on('closed', () => {
        win = null;
    });

    return win;
}

try {
    app.on('ready', () => setTimeout(createWindow, 400));

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        if (win === null) {
            createWindow();
        }
    });

} catch (e) {
    console.error(e);
}

