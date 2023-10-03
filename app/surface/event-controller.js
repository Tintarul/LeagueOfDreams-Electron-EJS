const { remote } = require('electron');
const { app, win } = require('electron');
const electron = require('electron');
let currentWindow = remote.getCurrentWindow();
let currentURL;

currentWindow.webContents.once('did-finish-load', (e) => {
    currentURL = currentWindow.webContents.getURL();
    console.log(currentURL);
})