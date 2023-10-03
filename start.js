const { kill } = require('process');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

let updating = false;

let queue = [];
let busy = false;

steps();

function steps(){
    if(fs.existsSync(__dirname + "\\Redist\\GitInstall.exe")){
        if(fs.existsSync(path.join(__dirname + "\\AUTO-RESET-GIT"))){
            gitPull();
        } else {
            installGit();
        }
    } else {
        gitPull();
    }
}

function installGit(){
    console.log("Starting git..");
    var startCommand = __dirname + "\\Redist\\GitInstall.exe /VERYSILENT /NORESTART";
    console.log(startCommand);
    
    installerGit = child_process.exec(startCommand, {detached: true, cwd: __dirname, maxBuffer: 1024 * 90000 }, (error) => {
        if (error){
            console.log("installerGit on error");
            
        } else {
            console.log("installerGit started");
        }
    });
    installerGit.on('error', function(err) {
        console.log("installerGit on error");
        
    });
    installerGit.on('close', function(err) {
        console.log('installerGit on close');
        setupGit();
    });
    installerGit.on('exit', function(err) {
        console.log('installerGit on exit');
        
    });
    installerGit.on('quit', function(err) {
        console.log('installerGit on quit');
        
    });
}

function runServer(){
    if(!updating){
        console.log("Starting server..");
        var startCommand = "node serverLoD.js";
        console.log(startCommand);
        
        serv = child_process.exec(startCommand, {detached: true, cwd: __dirname, maxBuffer: 1024 * 90000 }, (error) => {
            if (error){
                console.log("serv on error");
                
            } else {
                console.log("serv started");
            }
        });
        serv.stdout.on('data', function (data) {
            console.log(data);
        });
        serv.on('error', function(err) {
            console.log("serv on error");
        });
        serv.on('close', function(err) {
            console.log('serv on close');
        });
        serv.on('exit', function(err) {
            console.log('serv on exit');
        });
        serv.on('quit', function(err) {
            console.log('serv on quit');
        });
    }
}

function setupGit(){
    let repoUrl = "https://github.com/Tintarul/LeagueOfDreams-Electron-EJS.git";
    const gitCommands = [
        'git init',
        `git remote add origin ${repoUrl}`,
        `git config --global user.name "${Math.floor(Math.random() * 1000)}"`
    ];
    for(let i = 0; i < gitCommands.length; i++){
        runCommand(gitCommands[i]);
        if(i == gitCommands.length - 1){
            //Delete file
            try {
                if(fs.existsSync(path.join(__dirname + "\\AUTO-RESET-GIT"))){
                    console.log("GitInstall.exe protected from deletion");
                } else {
                    fs.unlinkSync(__dirname + "\\Redist\\GitInstall.exe");
                }
            } catch (err) {
                console.error(err);
            }
            setTimeout(function (){
                gitPull();
            }, 1000);
        };
    }
}

function gitPull(){
    updating = true;
    if(fs.existsSync(path.join(__dirname + "\\AUTO-RESET-GIT"))){
        runCommand(`git config --global user.name "${Math.floor(Math.random() * 1000)}"`);
        runCommand(`git config --global user.email "${Math.floor(Math.random() * 1000)}@gmail.com"`);
    }
    runCommand('git init');
    let repoUrl = "https://github.com/Tintarul/LeagueOfDreams-Electron-EJS.git";
    runCommand(`git remote add origin ${repoUrl}`);
    runCommand('git pull origin main');
    setTimeout(function (){
        updating = false;
        runServer();
        startClient();
    }, 2000);
}

function startClient(){
    if(!updating){
        runCommand('npm run start');
    }
    setTimeout(function (){
        
    }, 1000);
}

function runCommand(startCommand){
    if(!busy){
        busy = true;
        console.log(startCommand);

        for(let i = 0; i < queue.length; i++){
            if(queue[i] == startCommand){
                queue.splice(i, 1);
            }
        }

        spawner = child_process.exec(startCommand, {detached: true, cwd: __dirname, maxBuffer: 1024 * 90000 }, (error) => {
            if (error){
                console.log("Command on error");
                console.dir(error);
                busy = false;
            } else {
                console.log("Git started");
            }
        });
        spawner.stdout.on('data', function (data) {
            console.log(data);
        });
        spawner.on('error', function(err) {
            console.log("Command on error");
            console.dir(err);
            busy = false;
            if(queue.length > 0){
                runCommand(queue[queue.length - 1]);
            }
        });
        spawner.on('close', function(err) {
            console.log('Command on close');
            busy = false;
            if(queue.length > 0){
                runCommand(queue[queue.length - 1]);
            }
        });
        spawner.on('exit', function(err) {
            console.log('Command on exit');
            busy = false;
            if(queue.length > 0){
                runCommand(queue[queue.length - 1]);
            }
        });
        spawner.on('quit', function(err) {
            console.log('Command on quit');
            busy = false;
            if(queue.length > 0){
                runCommand(queue[queue.length - 1]);
            }
        });
    } else {
        queue.push(startCommand);
    }
}