"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const fs = require("fs");
const electron_2 = require("electron");
const electron_updater_1 = require("electron-updater");
let win = null;
const args = process.argv.slice(1), serve = args.some(val => val === '--serve');
function createWindow() {
    const size = electron_1.screen.getPrimaryDisplay().workAreaSize;
    win = new electron_1.BrowserWindow({
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
    win.webContents.on('did-finish-load', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const sources = yield electron_2.desktopCapturer.getSources({ types: ['screen', 'window'] });
            win.webContents.executeJavaScript(`
                window.getScreenSources = function() {
                    return navigator.mediaDevices.getUserMedia({ video: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: '${sources[0].id}' } } });
                }
            `);
        }
        catch (error) {
            console.error('Error accessing screen sources:', error);
        }
    }));
    if (serve) {
        const debug = require('electron-debug');
        debug();
        require('electron-reloader')(module);
        win.loadURL('http://localhost:3000/login');
    }
    else {
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
    electron_1.app.on('ready', () => {
        setTimeout(createWindow, 400);
        if (!serve) {
            electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
        }
    });
    electron_updater_1.autoUpdater.on('update-available', () => {
        win.webContents.send('update_available');
    });
    electron_updater_1.autoUpdater.on('update-downloaded', () => {
        win.webContents.send('update_downloaded');
        setTimeout(() => {
            electron_updater_1.autoUpdater.quitAndInstall();
        }, 5000);
    });
    electron_1.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', () => {
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    console.error(e);
}
//# sourceMappingURL=main.js.map