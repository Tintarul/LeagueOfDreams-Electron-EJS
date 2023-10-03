const { app, BrowserWindow, Main } = require('electron');
const electron = require('electron');
const {download} = require("electron-dl");
const path = require('path');
const unzip = require('unzipper');
var fs = require('fs');
var http = require('http');
const {ipcMain} = require('electron');
const process = require('process');
const { kill } = require('process');
const child_process = require('child_process');
const { Socket } = require('socket.io-client');

//Torrent Stream import
let TorrentStream = require("torrent-stream");

let LoadingWindow;
let mainWindow;
let setupWindow;
let child;
let pathtoGame;
let server;
let ipOnly;
let abortGame = false;

const torrentFilePath = path.join(__dirname, 'Game', 'orcf289038ijrf0j239uksjd.zip.torrent');
const downloadPathGame = path.join(__dirname, 'Game');
const zipFilePathGame = path.join(downloadPathGame, 'orcf289038ijrf0j239uksjd.zip');

async function createMainWindow () {
  mainWindow = new BrowserWindow({
    icon: __dirname + '/app/files/img/icon.png',
    height: 894,
    title: "League of Dreams",
    show: false,
    width: 1362,
    center: true,
    webPreferences: {
        devTools: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        nodeIntegrationInSubFrames: true,
        sandbox: false,
        enableRemoteModule: false,
        javascript: true,
        webSecurity: true,
        allowRunningInsecureContent: false,
        images: true,
        plugins: true,
        experimentalFeatures: false,
        offscreen: false,
        spellcheck: false,
        preload: path.join(__dirname, '/app/surface/app-controller.js')
      },
      resizable: true,
    maximizable: true,
    minimizable: true,
    closable: true,
    fullscreenable: true,
	frame: false,
    minHeight: 894,
    minWidth: 1362
  });
    mainWindow.loadURL(server);
    setTimeout(function(){
        mainWindow.webContents.openDevTools();
    }, 2000);
    mainWindow.removeMenu();
    mainWindow.setSize(1280, 720);
    mainWindow.center();
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        LoadingWindow.close();
    });
    mainWindow.webContents.on('did-finish-load', async function () {

    });
    mainWindow.on('unresponsive', function(){
        var options = {
            title: 'Server issue',
            message: "It seems that server is unresponsive",
            buttons: ["Change Server", "Refresh", "Quit"],
            type: 'warning',
            serverId: 0,
            waitId: 1,
            quitId: 2
        };
        electron.dialog.showMessageBox(mainWindow,options).then(result => {
                if (result.response === 0) {
                    createSetupWindow();
                }
                if (result.response === 1) {
                    mainWindow.webContents.loadURL(server);
                }
                if (result.response === 2) {
                    mainWindow.close();
                    app.exit(0);
                }
        });
    });
    mainWindow.on('responsive', function(){
        //Code
    });
    mainWindow.on('blur', function(){
        //Optimization on
    });
    mainWindow.on('focus', function(){
        //Optimization off
    });
    mainWindow.webContents.on('did-fail-load', function(){
        var options = {
            title: 'Server issue',
            message: "It seems that server did fail to load",
            buttons: ["Change Server", "Refresh", "Quit"],
            type: 'warning',
            serverId: 0,
            waitId: 1,
            quitId: 2
        };
        electron.dialog.showMessageBox(mainWindow,options).then(result => {
                if (result.response === 0) {
                    createSetupWindow();
                }
                if (result.response === 1) {
                    mainWindow.webContents.loadURL(server);
                }
                if (result.response === 2) {
                    mainWindow.close();
                    app.exit(0);
                }
        });
    });
    mainWindow.webContents.on('will-redirect', function (event, url) {
        //Security issues
    });
    mainWindow.on('close', function () {
        CloseClient();
    });
}

ipcMain.on("download", () => {
    checkForEssentialFiles();
});

ipcMain.on("download server", () => {
    checkForServerFiles();
});

let serverGame;

ipcMain.on("startServer", () => {

    if(typeof serverGame !== 'undefined'){
        serverGame.kill();
    } else {
        console.log("Starting server..");
        var startCommand = "node start.js";
        console.log(startCommand);
        let cwdLocation = path.join(__dirname);

        serverGame = child_process.exec(startCommand, {detached: true, cwd: cwdLocation, maxBuffer: 1024 * 90000 }, (error) => {
            if (error){
                console.log("Server on error");
                console.log(error)
            } else {
                    
                console.log("Server started");
                setupWindow.webContents.send("startedServer");
            }
        });
        serverGame.on('error', function(err) {
            console.log("Server on error");
            console.dir(err);
            setupWindow.webContents.send("stopedServer");
        });
        serverGame.on('close', function() {
            console.log('Server on close');
            setupWindow.webContents.send("stopedServer");
        });
        serverGame.on('exit', function() {
            console.log('Server on exit');
            setupWindow.webContents.send("stopedServer");
        });
        serverGame.on('quit', function() {
            console.log('Server on quit');
            setupWindow.webContents.send("stopedServer");
        });
    }

});

ipcMain.on("update", () => {
    updateEverything();
});

function updateEverything(){

    console.log("Updater started..");
    var startCommand = 'node start.js';
    console.log(startCommand);

    child_process.exec(startCommand, {detached: true, cwd: __dirname, maxBuffer: 1024 * 90000 }, (error) => {
        if (error){
            console.log("Updater on error");
        } else {
            console.log("Updater started");
            CloseClient();
        }
    });

}

ipcMain.on('setupRefresh', () => {setupWindow.relaunch();});
ipcMain.on('setupMinimize', () => {setupWindow.minimize()});
ipcMain.on('setupUnmaximize', () => {setupWindow.unmaximize();});
ipcMain.on('setupMaximize', () => {setupWindow.maximize()});
ipcMain.on('setupClose', () => {
    setupWindow.close();
});

ipcMain.on('refresh', () => {mainWindow.loadURL(server)});
ipcMain.on('minimize', () => {mainWindow.minimize()});
ipcMain.on('unmaximize', () => {mainWindow.unmaximize();});
ipcMain.on('maximize', () => {mainWindow.maximize()});
ipcMain.on('close', () => {CloseClient();});

ipcMain.on('startGame', (event, data) => {
    console.log("IPC loading..");
    var startCommand = 'start "" "League of Legends.exe" "" "" "" "' + ipOnly + ' ' + data['port'] + " " + data['token'] + " " + data['id'];
    console.log(startCommand);
    var gameitSelf = child_process.exec(startCommand, {detached: true, cwd: pathtoGame, maxBuffer: 1024 * 90000 }, (error) => {
        if (error){console.log("Game on error");}
            console.log("Started game");
            child = gameitSelf.pid;
            if(abortGame == true){
                gameitSelf.kill('SIGKILL');
            }
    });
    gameitSelf.on('error', function(err) {
        console.log("Game on error");
    });
    gameitSelf.on('close', function(err) {
        console.log('Game on close');
    });
    gameitSelf.on('exit', function(err) {
        console.log('Game on exit');
    });
    gameitSelf.on('quit', function(err) {
        console.log('Game on quit');
    });
    child = gameitSelf;
});

ipcMain.on('abortGame', (event) => {
    console.log("IPC shutting down client..");
    try {
        child.kill('SIGKILL');
    } catch(e){}
    abortGame = true;
});

ipcMain.on('openSettings', (event) => {
    console.log("IPC opening settings..");
    createSetupWindow();
    setTimeout(function(){
        
    }, 2000);
});

ipcMain.on('setPath', (event, data, restart) => {
    try {
        console.warn("Checking path..");
        console.dir(data);
        if (fs.existsSync(data + "\\League of Legends.exe")) {
            fs.writeFile(__dirname + '\\config\\path.igor', data, function (err) {
                if (err) throw err;
                if(restart){
                    app.relaunch();
                    app.exit();
                }
            });
        } else {
            var options = {
                title: 'Cant find GAME.EXE',
                message: "Can't find League of Legends.exe version 4.20",
                buttons: ["Ok"],
                type: 'error'
            };
            electron.dialog.showMessageBox(setupWindow,options).then(result => {});
        }
    } catch(e){
        var options = {
            title: 'Your path is wrong',
            message: "Fatal error while checking your path",
            buttons: ["Ok"],
            type: 'error'
        };
        electron.dialog.showMessageBox(setupWindow,options).then(result => {});
    }
});

ipcMain.on('setServer', (event, data, restart) => {
    try {
        fs.writeFile(__dirname + '\\config\\server.igor', data, function (err) {
            if (err) throw err;
            if(restart){
                app.relaunch();
                app.exit();
            }
        });
    } catch(e){
        var options = {
            title: 'Error',
            message: "Can't write file, maybe permissions?",
            buttons: ["Ok"],
            type: 'error'
        };
        electron.dialog.showMessageBox(setupWindow,options).then(result => {});
    }
});

function createSetupWindow() {
    setupWindow = new BrowserWindow({
        icon: __dirname + '/app/files/img/icon.png',
        title: "League of Dreams",
        center: true,
        skipTaskbar: false,
        webPreferences: {
            devTools: false,
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            sandbox: true,
            enableRemoteModule: true,
            javascript: true,
            webSecurity: true,
            allowRunningInsecureContent: false,
            images: true,
            plugins: true,
            experimentalFeatures: false,
            offscreen: false,
            spellcheck: false,
            preload: path.join(__dirname, '/app/surface/setup.js')
        },
        resizable: true,
        maximizable: true,
        minimizable: true,
        closable: true,
        fullscreenable: true,
        frame: false,
    });
    
        setupWindow.loadFile(__dirname + '/app/files/pages/setup.html');
        setupWindow.removeMenu();
        setupWindow.setSize(1024, 1000, true);
        setupWindow.center();
        setTimeout(function(){
            setupWindow.webContents.openDevTools();
            
        }, 1000);
        

}

function createLoadingWindow() {
    LoadingWindow = new BrowserWindow({
        icon: __dirname + '/app/files/img/icon.png',
        title: "League of Dreams",
        center: true,
        skipTaskbar: true,
        webPreferences: {
            devTools: false,
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            sandbox: false,
            enableRemoteModule: true,
            javascript: true,
            webSecurity: true,
            allowRunningInsecureContent: false,
            images: true,
            plugins: true,
            experimentalFeatures: false,
            offscreen: false,
            spellcheck: false
        },
        resizable: false,
        maximizable: false,
        minimizable: false,
        closable: true,
        fullscreenable: false,
        frame: false,
    });
    LoadingWindow.loadFile(__dirname + '/app/files/pages/loading.html');
    LoadingWindow.webContents.openDevTools();
    LoadingWindow.removeMenu();
    LoadingWindow.setSize(320, 540);
    LoadingWindow.center();
    LoadingWindow.once('ready-to-show', () => {
        LoadingWindow.show();
    });
    setTimeout(createMainWindow, 2000);
}

app.whenReady().then(() => {
    if (fs.existsSync(__dirname + '\\config\\path.igor')) {
        if (fs.existsSync(__dirname + '\\config\\server.igor')) {
            fs.readFile(__dirname + '\\config\\path.igor', 'utf8', function(err, path){
                if(err) throw(err);
                fs.readFile(__dirname + '\\config\\server.igor', 'utf8', function(err, serverLoaded){
                    if(err) throw(err);
                    pathtoGame = path;
                    server = "http://" + serverLoaded + ":3000"
                    ipOnly = serverLoaded;
                    createLoadingWindow();
                    app.on('activate', function () {
                        if (BrowserWindow.getAllWindows().length === 0) createLoadingWindow();
                    });
                });
            });
        } else {
            createSetupWindow();
            app.on('activate', function () {
                if (BrowserWindow.getAllWindows().length === 0) createSetupWindow();
            });
        }
    } else {
        createSetupWindow();
        app.on('activate', function () {
            if (BrowserWindow.getAllWindows().length === 0) createSetupWindow();
        });
    }
});

async function downloadAndSeed() {
        console.log("Preparing to download...");
        var options = {
            title: 'Game',
            message: "Game started downloading, please wait..",
            buttons: ["Ok"],
            type: 'warning'
        };
        electron.dialog.showMessageBox(setupWindow,options).then(result => {});
        setupWindow.webContents.send("download progress", `Preparing to download...`);
        let totalFileSize = 0;
        let ultimatumPath = "";

        var engine = new TorrentStream(
            await fs.readFileSync("./Game/orcf289038ijrf0j239uksjd.zip.torrent"),
            {
                downloadLimit: 1024 * 1024 * 1024, // 1 GB/s
            }
        );

        engine.on('ready', () => {
            console.log('Downloading file...');
            setupWindow.webContents.send("download progress", `Starting download...`);
            const torrentFile = engine.files[0]; // Assuming we want to download the first file
        
            // Start streaming the file
            const stream = torrentFile.createReadStream();
            totalFileSize += torrentFile.length;
        
            // Save file to disk
            const savePath = './Game/';
            const filePath = savePath + torrentFile.name;
            ultimatumPath = filePath;
            stream.pipe(fs.createWriteStream(filePath));
        
        });

        // Event: When file download is complete
        engine.on('end', () => {
            setupWindow.webContents.send("download progress", `Installing...`);
            console.log('Download complete!');
            engine.destroy(); // Stop seeding after download completes
            
            //Unzip file
            let respfs = fs.createReadStream(ultimatumPath).pipe(unzip.Extract({ path: path.join(__dirname + "\\Game") }));
            respfs.on('close', function(){
                console.warn("Unzipped..");
                try {
                    let pathToExeGame = __dirname + "\\Game";
                    fs.writeFile(__dirname + '\\config\\path.igor', pathToExeGame, function (err) {
                        if (err) throw err;
                        setupWindow.webContents.send("unzip complete", pathToExeGame);
                    });
                } catch(e){
                    var options = {
                        title: 'Your path is wrong',
                        message: e.toString(),
                        buttons: ["Ok"],
                        type: 'error'
                    };
                    electron.dialog.showMessageBox(setupWindow,options).then(result => {});
                }
            });

            const seeder = TorrentStream(ultimatumPath);
            seeder.on('ready', () => {
                console.log(`Seeding ${ultimatumPath}`);
            });
        });

        // Log progress of file downloading
        let downloadedBytes = 0;
        engine.on('download', (bytes) => {
            downloadedBytes += bytes;
            const progress = (downloadedBytes / totalFileSize) * 100;
            console.log(`Downloaded ${progress.toFixed(2)}%`);
            setupWindow.webContents.send("download progress", `Downloaded ${progress.toFixed(2)}%`);
        });
      
      // Event: When an error occurs
      engine.on('error', (err) => {
        console.error('Error:', err);
        setupWindow.webContents.send("download progress", err);
      });
}

function seed(ultimatumPath) {
    try {
        setupWindow.webContents.send("download progress", `Your game is already downloaded!`);
        const seeder = TorrentStream(ultimatumPath);
        seeder.on('ready', () => {
            console.log(`Seeding ${ultimatumPath}`);
        });
    } catch(e){
        console.log(e);
    }
}

function seedForServer(ultimatumPath) {
    try {
        setupWindow.webContents.send("download progress server", `Server is already downloaded!`);
        const seeder = TorrentStream(ultimatumPath);
        seeder.on('ready', () => {
            console.log(`Seeding ${ultimatumPath}`);
        });
    } catch(e){
        console.log(e);
    }
}

function checkForServerFiles(){
    //first check path path.Join(__dirname + "\middlewares\GameServer\Content\LeagueSandbox-Default");
    if(fs.existsSync(path.join(__dirname + "\\middlewares\\GameServer\\Content\\LeagueSandbox-Default"))){
        setupWindow.webContents.send("server complete");
        console.log('The server files already exist. Starting to seed.');
        try {
            seedForServer(path.join(__dirname + "\\middlewares\\GameServer\\orddjf3nwmd930djebfi83jh.zip"));
        } catch(e){
            console.log(e);
        }
        
    } else {
        if(fs.existsSync(path.join(__dirname + "\\middlewares\\GameServer\\orddjf3nwmd930djebfi83jh.zip"))){

            console.log('The server files already exist. Starting to seed.');
            
            
            setupWindow.webContents.send("download progress server", "Extracting...");
                let respfs = fs.createReadStream(path.join(__dirname + "\\middlewares\\GameServer\\orddjf3nwmd930djebfi83jh.zip")).pipe(unzip.Extract({ path: path.join(__dirname + "\\middlewares\\GameServer\\") }));
                respfs.on('close', function(){
                    console.warn("Unzipped..");
                    setupWindow.webContents.send("server complete");
                    try {
                        seedForServer(path.join(__dirname + "\\middlewares\\GameServer\\orddjf3nwmd930djebfi83jh.zip"));
                    } catch(e){
                        console.log(e);
                    }
            });

        } else {
            downloadAndSeedPatch1();
        }
    }
}

async function downloadAndSeedPatch1(){
    console.log("Preparing to install server...");
    var options = {
        title: 'Server Console',
        message: "Server started downloading, please wait..",
        buttons: ["Ok"],
        type: 'warning'
    };
    electron.dialog.showMessageBox(setupWindow,options).then(result => {});
    setupWindow.webContents.send("download progress server", `Preparing to download server...`);
    let totalFileSize = 0;
    let ultimatumPath = "";

    var engine = new TorrentStream(
        await fs.readFileSync("./middlewares/GameServer/orddjf3nwmd930djebfi83jh.torrent"),
        {
            downloadLimit: 1024 * 1024 * 1024, // 1 GB/s
        }
    );

    engine.on('ready', () => {
        console.log('Downloading file server...');
        setupWindow.webContents.send("download progress server", `Starting download server...`);
        const torrentFile = engine.files[0]; // Assuming we want to download the first file
    
        // Start streaming the file
        const stream = torrentFile.createReadStream();
        totalFileSize += torrentFile.length;
    
        // Save file to disk
        const savePath = './middlewares/GameServer/';
        const filePath = savePath + torrentFile.name;
        ultimatumPath = filePath;
        stream.pipe(fs.createWriteStream(filePath));
    
    });

    // Event: When file download is complete
    engine.on('end', () => {
        setupWindow.webContents.send("download progress server", `Installing...`);
        console.log('Download complete!');
        engine.destroy(); // Stop seeding after download completes
        
        //Unzip file
        let respfs = fs.createReadStream(ultimatumPath).pipe(unzip.Extract({ path: path.join(__dirname + "/middlewares/GameServer/") }));
        respfs.on('close', function(){
            console.warn("Unzipped..");
            setupWindow.webContents.send("server complete");
        });

        const seeder = TorrentStream(ultimatumPath);
        seeder.on('ready', () => {
            console.log(`Seeding ${ultimatumPath}`);
        });
    });

    // Log progress of file downloading
    let downloadedBytes = 0;
    engine.on('download', (bytes) => {
        downloadedBytes += bytes;
        const progress = (downloadedBytes / totalFileSize) * 100;
        console.log(`Downloaded ${progress.toFixed(2)}%`);
        setupWindow.webContents.send("download progress server", `Downloaded ${progress.toFixed(2)}%`);
    });
  
  // Event: When an error occurs
  engine.on('error', (err) => {
    console.error('Error:', err);
    setupWindow.webContents.send("download progress server", err);
  });   
}


function checkForEssentialFiles(){
    if (fs.existsSync(path.join(__dirname + "\\Game"))){
        if (fs.existsSync(zipFilePathGame)) {
            console.log('The zip file already exists. Starting to seed.');
            seed(zipFilePathGame);
            //Check if League of Legends.exe exists
            setupWindow.webContents.send("download progress", "Game is already installed!");
            if(fs.existsSync(__dirname + "\\Game\\League of Legends.exe")){
                let pathToExeGame = __dirname + "\\Game";
                fs.writeFile(__dirname + '\\config\\path.igor', pathToExeGame, function (err) {
                    if (err) throw err;
                    setupWindow.webContents.send("unzip complete", pathToExeGame);
                });
            } else {
                //If not, unzip
                setupWindow.webContents.send("download progress", "Installing...");
                let respfs = fs.createReadStream(zipFilePathGame).pipe(unzip.Extract({ path: path.join(__dirname + "\\Game") }));
                respfs.on('close', function(){
                    console.warn("Unzipped..");
                    try {
                        let pathToExeGame = __dirname + "\\Game";
                        fs.writeFile(__dirname + '\\config\\path.igor', pathToExeGame, function (err) {
                            if (err) throw err;
                            setupWindow.webContents.send("unzip complete", pathToExeGame);
                        });
                    }
                    catch(e){
                        var options = {
                            title: 'Your path is wrong',
                            message: e.toString(),
                            buttons: ["Ok"],
                            type: 'error'
                        };
                        electron.dialog.showMessageBox(setupWindow,options).then(result => {});
                    }
                });
            }
        } else {
            
            console.log('The zip file does not exist. Starting to download.');
            downloadAndSeed();
        }
    } else {
        console.log('The game folder does not exist. Please provide a valid path.');
        //Dialog

        var options = {
            title: 'Game folder does not exist',
            message: "Game folder does not exist, please select your game folder manually",
            buttons: ["Ok"],
            type: 'warning'
        };
        electron.dialog.showMessageBox(setupWindow,options).then(result => {
            createSetupWindow();
        });
    }
}

function CloseClient(){
    app.exit(0);
}

app.on('window-all-closed', function () {
    app.exit(0);
})

